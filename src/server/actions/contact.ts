"use server";

import "server-only";
import { after } from "next/server";
import { getTranslations } from "next-intl/server";
import { privacyNoticeVersion } from "@/config/legal";
import { listServices } from "@/content";
import type { FormState } from "@/lib/form-state";
import { getCompany } from "@/server/company";
import { db } from "@/server/db/client";
import { leads } from "@/server/db/schema";
import { sendEmail } from "@/server/email/send";
import { leadConfirmationEmail, leadNotificationEmail } from "@/server/email/templates";
import { errorState, formLocale, formValues, isBot } from "@/server/forms/helpers";
import { rateLimit } from "@/server/forms/rate-limit";
import { clientIp, hashIdentifier } from "@/server/forms/request";
import { contactSchema } from "@/server/forms/schemas";

/** Public quote request. Order: honeypot, validation, rate limit, storage, then emails. */
export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = formLocale(formData);
  // Bots get the same response as people, so they learn nothing.
  if (isBot(formData)) return { status: "success" };

  const values = formValues(formData);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return errorState(locale, values, parsed.error.issues);

  const limit = await rateLimit({
    key: `contact:${hashIdentifier(await clientIp())}`,
    limit: 5,
    windowSeconds: 10 * 60,
  });
  if (!limit.ok) {
    const t = await getTranslations({ locale, namespace: "Forms.errors" });
    return errorState(locale, values, [], t("rateLimited"));
  }

  const input = parsed.data;
  let id: string;
  try {
    const [row] = await db()
      .insert(leads)
      .values({
        locale,
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        serviceId: input.service,
        propertyType: input.propertyType,
        location: input.location,
        preferredContact: input.preferredContact,
        message: input.message,
        consentAt: new Date(),
        consentVersion: privacyNoticeVersion,
      })
      .returning({ id: leads.id });
    id = row!.id;
  } catch (error) {
    console.error("[contact] could not store lead", error);
    const t = await getTranslations({ locale, namespace: "Forms.errors" });
    return errorState(locale, values, [], t("server"));
  }

  // Emails are sent after the response, so the visitor does not wait for the provider.
  after(async () => {
    const [company, services] = await Promise.all([getCompany(), listServices(locale)]);
    const lead = {
      ...input,
      id,
      locale,
      serviceTitle: services.find((s) => s.id === input.service)?.title,
    };
    const related = { leadId: id };
    await sendEmail({
      ...(await leadNotificationEmail(lead, company)),
      template: "lead-notification",
      related,
    });
    await sendEmail({
      ...(await leadConfirmationEmail(lead, company)),
      template: "lead-confirmation",
      related,
    });
  });

  return { status: "success" };
}
