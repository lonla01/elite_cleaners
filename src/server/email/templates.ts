import "server-only";
import { getTranslations } from "next-intl/server";
import { localeDefinitions, type Locale } from "@/config/locales";
import type { CompanyDetails } from "@/config/company";
import type { CareersInput, ContactInput } from "@/server/forms/schemas";
import { renderEmail } from "./layout";
import type { EmailMessage } from "./providers";

/**
 * Transactional emails for the public forms. Visitor emails use the visitor's locale;
 * internal notifications are in English (the admin language).
 */

type Lead = ContactInput & { id: string; locale: Locale; serviceTitle?: string };
type Application = CareersInput & { id: string; locale: Locale; cvFilename?: string };

async function labels(locale: Locale) {
  const [fields, options] = await Promise.all([
    getTranslations({ locale, namespace: "Forms.fields" }),
    getTranslations({ locale, namespace: "Forms.options" }),
  ]);
  return { fields, options };
}

async function leadDetails(lead: Lead, locale: Locale): Promise<[string, string][]> {
  const { fields, options } = await labels(locale);
  const rows: [string, string | undefined][] = [
    [fields("name"), lead.name],
    [fields("email"), lead.email],
    [fields("phone"), lead.phone],
    [fields("company"), lead.company],
    [fields("service"), lead.serviceTitle],
    [fields("propertyType"), lead.propertyType && options(`propertyType.${lead.propertyType}`)],
    [fields("location"), lead.location],
    [fields("preferredContact"), options(`preferredContact.${lead.preferredContact}`)],
    [fields("message"), lead.message],
  ];
  return rows.filter((row): row is [string, string] => !!row[1]);
}

export async function leadConfirmationEmail(
  lead: Lead,
  company: CompanyDetails,
): Promise<EmailMessage> {
  const t = await getTranslations({ locale: lead.locale, namespace: "Emails.leadConfirmation" });
  const { html, text } = renderEmail(
    {
      lang: localeDefinitions[lead.locale].hreflang,
      heading: t("heading", { name: lead.name }),
      paragraphs: [t("received"), t("urgent", { phone: company.phone }), t("summary")],
      details: await leadDetails(lead, lead.locale),
      signature: [t("signature", { company: company.name })],
    },
    company,
  );
  return {
    to: lead.email,
    subject: t("subject", { company: company.name }),
    html,
    text,
    replyTo: company.email,
  };
}

export async function leadNotificationEmail(
  lead: Lead,
  company: CompanyDetails,
): Promise<EmailMessage> {
  const t = await getTranslations({ locale: "en", namespace: "Emails.leadNotification" });
  const { html, text } = renderEmail(
    {
      lang: "en",
      heading: t("heading"),
      paragraphs: [t("intro", { locale: localeDefinitions[lead.locale].label })],
      details: [...(await leadDetails(lead, "en")), [t("reference"), lead.id]],
      signature: [t("replyHint")],
    },
    company,
  );
  return {
    to: company.notificationEmail,
    subject: t("subject", { name: lead.name }),
    html,
    text,
    replyTo: lead.email,
  };
}

async function applicationDetails(
  application: Application,
  locale: Locale,
): Promise<[string, string][]> {
  const { fields, options } = await labels(locale);
  const rows: [string, string | undefined][] = [
    [fields("name"), application.name],
    [fields("email"), application.email],
    [fields("phone"), application.phone],
    [fields("languages"), application.languages.map((l) => options(`languages.${l}`)).join(", ")],
    [fields("availability"), options(`availability.${application.availability}`)],
    [fields("cv"), application.cvFilename],
    [fields("message"), application.message],
  ];
  return rows.filter((row): row is [string, string] => !!row[1]);
}

export async function applicationConfirmationEmail(
  application: Application,
  company: CompanyDetails,
): Promise<EmailMessage> {
  const t = await getTranslations({
    locale: application.locale,
    namespace: "Emails.applicationConfirmation",
  });
  const { html, text } = renderEmail(
    {
      lang: localeDefinitions[application.locale].hreflang,
      heading: t("heading", { name: application.name }),
      paragraphs: [t("received"), t("next"), t("summary")],
      details: await applicationDetails(application, application.locale),
      signature: [t("signature", { company: company.name })],
    },
    company,
  );
  return {
    to: application.email,
    subject: t("subject", { company: company.name }),
    html,
    text,
    replyTo: company.email,
  };
}

export async function applicationNotificationEmail(
  application: Application,
  company: CompanyDetails,
): Promise<EmailMessage> {
  const t = await getTranslations({ locale: "en", namespace: "Emails.applicationNotification" });
  const { html, text } = renderEmail(
    {
      lang: "en",
      heading: t("heading"),
      paragraphs: [t("intro")],
      details: [...(await applicationDetails(application, "en")), [t("reference"), application.id]],
      signature: [t("cvHint")],
    },
    company,
  );
  return {
    to: company.notificationEmail,
    subject: t("subject", { name: application.name }),
    html,
    text,
    replyTo: application.email,
  };
}
