import "server-only";
import nodemailer from "nodemailer";
import { env, requireEnv } from "@/env";

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<{ id?: string }>;
}

class ResendProvider implements EmailProvider {
  readonly name = "resend";
  async send(message: EmailMessage) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: requireEnv("EMAIL_FROM"),
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { id?: string };
    return { id: body.id };
  }
}

class SmtpProvider implements EmailProvider {
  readonly name = "smtp";
  private transport = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port: env.SMTP_PORT ?? 587,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
    connectionTimeout: 10_000,
  });
  async send(message: EmailMessage) {
    const info = await this.transport.sendMail({ from: requireEnv("EMAIL_FROM"), ...message });
    return { id: info.messageId };
  }
}

/** Development: prints the email instead of sending it. */
class LogProvider implements EmailProvider {
  readonly name = "log";
  async send(message: EmailMessage) {
    console.info(`[email] to=${message.to} subject="${message.subject}"\n${message.text}`);
    return {};
  }
}

/**
 * Providers to try, in order. With EMAIL_PROVIDER=resend and SMTP configured, SMTP is the
 * fallback when Resend fails.
 */
export function emailProviders(): EmailProvider[] {
  switch (env.EMAIL_PROVIDER) {
    case "resend":
      return env.SMTP_HOST ? [new ResendProvider(), new SmtpProvider()] : [new ResendProvider()];
    case "smtp":
      return [new SmtpProvider()];
    case "log":
      return [new LogProvider()];
  }
}
