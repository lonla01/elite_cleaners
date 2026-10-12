import "server-only";
import { z } from "zod";
import serviceIds from "../../../content/services.json";

/** Error messages are keys under `Forms.errors` in messages/<locale>.json. */

const requiredText = (max: number) =>
  z
    .string({ error: "required" })
    .trim()
    .min(1, { error: "required" })
    .max(max, { error: "tooLong" });

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "tooLong" })
    .optional()
    .transform((v) => v || undefined);

const email = z
  .string({ error: "required" })
  .trim()
  .min(1, { error: "required" })
  .max(254, { error: "tooLong" })
  .pipe(z.email({ error: "email" }))
  .transform((v) => v.toLowerCase());

const phonePattern = /^\+?[0-9][0-9 ()./-]{5,24}$/;
const phone = requiredText(30).regex(phonePattern, { error: "phone" });
const optionalPhone = optionalText(30).refine((v) => v === undefined || phonePattern.test(v), {
  error: "phone",
});

const consent = z.literal("on", { error: "consent" });

export const propertyTypes = [
  "apartment",
  "house",
  "office",
  "retail",
  "medical",
  "other",
] as const;

export const contactSchema = z.object({
  name: requiredText(120),
  email,
  phone: optionalPhone,
  company: optionalText(120),
  service: z
    .enum(serviceIds as [string, ...string[]], { error: "invalid" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  propertyType: z
    .enum(propertyTypes, { error: "invalid" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  location: optionalText(120),
  preferredContact: z.enum(["email", "phone", "whatsapp"], { error: "required" }).default("email"),
  message: requiredText(5000).min(10, { error: "messageTooShort" }),
  consent,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const languages = ["lb", "fr", "de", "en", "pt", "other"] as const;
export const availabilities = [
  "full-time",
  "part-time",
  "mornings",
  "evenings",
  "weekends",
  "flexible",
] as const;

export const careersSchema = z.object({
  name: requiredText(120),
  email,
  phone,
  languages: z.array(z.enum(languages, { error: "invalid" })).min(1, { error: "languages" }),
  availability: z.enum(availabilities, { error: "required" }),
  message: optionalText(3000),
  consent,
});
export type CareersInput = z.infer<typeof careersSchema>;

/** CV uploads: up to 5 MB, PDF or Word, checked by content rather than by name. */
export const CV_MAX_BYTES = 5 * 1024 * 1024;

export function detectCvType(bytes: Uint8Array): { contentType: string; ext: string } | null {
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts(0x25, 0x50, 0x44, 0x46)) return { contentType: "application/pdf", ext: "pdf" };
  // DOCX and ODT are zip containers.
  if (starts(0x50, 0x4b, 0x03, 0x04)) {
    return {
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ext: "docx",
    };
  }
  if (starts(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1)) {
    return { contentType: "application/msword", ext: "doc" };
  }
  return null;
}
