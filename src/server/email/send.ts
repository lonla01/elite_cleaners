import "server-only";
import { db } from "@/server/db/client";
import { emailLog } from "@/server/db/schema";
import { emailProviders, type EmailMessage } from "./providers";

/**
 * Sends an email through the configured providers (with fallback) and records the outcome in
 * email_log. Never throws: form submissions must not fail because an email could not be sent.
 */
export async function sendEmail(
  message: EmailMessage & { template: string; related?: Record<string, string> },
): Promise<boolean> {
  const { template, related, ...email } = message;
  const errors: string[] = [];
  for (const provider of emailProviders()) {
    try {
      const { id } = await provider.send(email);
      await log({ status: "sent", provider: provider.name, providerMessageId: id });
      return true;
    } catch (error) {
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  console.error(`[email] ${template} to ${email.to} failed`, errors);
  await log({ status: "failed", error: errors.join("\n").slice(0, 2000) });
  return false;

  async function log(entry: {
    status: "sent" | "failed";
    provider?: string;
    providerMessageId?: string;
    error?: string;
  }) {
    try {
      await db()
        .insert(emailLog)
        .values({ template, to: email.to, subject: email.subject, related, ...entry });
    } catch (error) {
      console.error("[email] could not write email_log", error);
    }
  }
}
