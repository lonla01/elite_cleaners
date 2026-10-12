"use server";

import "server-only";
import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { getTranslations } from "next-intl/server";
import { privacyNoticeVersion } from "@/config/legal";
import type { FormState } from "@/lib/form-state";
import { getCompany } from "@/server/company";
import { db } from "@/server/db/client";
import { files, jobApplications } from "@/server/db/schema";
import { sendEmail } from "@/server/email/send";
import {
  applicationConfirmationEmail,
  applicationNotificationEmail,
} from "@/server/email/templates";
import { errorState, formLocale, formValues, isBot } from "@/server/forms/helpers";
import { rateLimit } from "@/server/forms/rate-limit";
import { clientIp, hashIdentifier } from "@/server/forms/request";
import { careersSchema, CV_MAX_BYTES, detectCvType } from "@/server/forms/schemas";
import { storage } from "@/server/storage";

/** Job application with an optional CV. The CV goes to object storage, never to the DB. */
export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = formLocale(formData);
  if (isBot(formData)) return { status: "success" };

  const values = formValues(formData, ["languages"]);
  const parsed = careersSchema.safeParse(values);
  const t = await getTranslations({ locale, namespace: "Forms.errors" });

  // Validate the CV alongside the other fields, so all errors are reported at once.
  const cv = formData.get("cv");
  let upload: { bytes: Uint8Array; filename: string; contentType: string; ext: string } | null =
    null;
  let cvError: string | undefined;
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > CV_MAX_BYTES) cvError = t("cvTooLarge");
    else {
      const bytes = new Uint8Array(await cv.arrayBuffer());
      const type = detectCvType(bytes);
      if (!type) cvError = t("cvType");
      else upload = { bytes, filename: cv.name.slice(0, 200), ...type };
    }
  }

  if (!parsed.success || cvError) {
    const state = await errorState(locale, values, parsed.error?.issues ?? []);
    if (state.status === "error" && cvError) state.fieldErrors.cv = cvError;
    return state;
  }

  const limit = await rateLimit({
    key: `careers:${hashIdentifier(await clientIp())}`,
    limit: 3,
    windowSeconds: 10 * 60,
  });
  if (!limit.ok) return errorState(locale, values, [], t("rateLimited"));

  const input = parsed.data;
  let id: string;
  try {
    let cvFileId: string | undefined;
    if (upload) {
      const now = new Date();
      const key = `cv/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${upload.ext}`;
      await storage().put(key, upload.bytes, upload.contentType);
      const [file] = await db()
        .insert(files)
        .values({
          storageKey: key,
          filename: upload.filename,
          contentType: upload.contentType,
          size: upload.bytes.byteLength,
          purpose: "cv",
        })
        .returning({ id: files.id });
      cvFileId = file!.id;
    }
    const [row] = await db()
      .insert(jobApplications)
      .values({
        locale,
        name: input.name,
        email: input.email,
        phone: input.phone,
        languages: input.languages,
        availability: input.availability,
        message: input.message,
        cvFileId,
        consentAt: new Date(),
        consentVersion: privacyNoticeVersion,
      })
      .returning({ id: jobApplications.id });
    id = row!.id;
  } catch (error) {
    console.error("[careers] could not store application", error);
    return errorState(locale, values, [], t("server"));
  }

  after(async () => {
    const company = await getCompany();
    const application = { ...input, id, locale, cvFilename: upload?.filename };
    const related = { applicationId: id };
    await sendEmail({
      ...(await applicationNotificationEmail(application, company)),
      template: "application-notification",
      related,
    });
    await sendEmail({
      ...(await applicationConfirmationEmail(application, company)),
      template: "application-confirmation",
      related,
    });
  });

  return { status: "success" };
}
