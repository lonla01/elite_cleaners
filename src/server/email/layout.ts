import "server-only";
import type { CompanyDetails } from "@/config/company";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type EmailContent = {
  lang: string;
  heading: string;
  paragraphs: string[];
  /** Label/value rows, e.g. a summary of the submitted form. */
  details?: [string, string][];
  signature: string[];
};

/**
 * Renders a simple, accessible branded email (table layout and inline styles for email
 * clients) plus its plain-text version. All values are escaped.
 */
export function renderEmail(content: EmailContent, company: CompanyDetails) {
  const p = (text: string) =>
    `<p style="margin:0 0 16px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#2b2f36">${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
  const rows = (content.details ?? [])
    .map(
      ([label, value]) =>
        `<tr><th scope="row" align="left" valign="top" style="padding:8px 16px 8px 0;font:600 14px/1.5 Arial,Helvetica,sans-serif;color:#121a2b;white-space:nowrap">${escapeHtml(label)}</th><td style="padding:8px 0;font:14px/1.5 Arial,Helvetica,sans-serif;color:#2b2f36">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="${escapeHtml(content.lang)}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(content.heading)}</title></head>
<body style="margin:0;padding:0;background:#f7f4ee">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ee"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff">
<tr><td style="background:#121a2b;padding:24px 32px;font:20px/1.3 Georgia,serif;color:#f7f4ee;letter-spacing:0.05em">${escapeHtml(company.name)}</td></tr>
<tr><td style="padding:32px">
<h1 style="margin:0 0 24px;font:normal 28px/1.3 Georgia,serif;color:#121a2b">${escapeHtml(content.heading)}</h1>
${content.paragraphs.map(p).join("\n")}
${rows ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;border-top:1px solid #ede7dd;width:100%">${rows}</table>` : ""}
${content.signature.map(p).join("\n")}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #ede7dd;font:12px/1.6 Arial,Helvetica,sans-serif;color:#5a6070">
${escapeHtml(company.legalName)} · ${escapeHtml(`${company.address.street}, ${company.address.postcode} ${company.address.city}`)}<br>
${escapeHtml(company.phone)} · ${escapeHtml(company.email)}
</td></tr>
</table></td></tr></table>
</body></html>`;

  const text = [
    content.heading,
    "",
    ...content.paragraphs.flatMap((x) => [x, ""]),
    ...(content.details ?? []).map(([label, value]) => `${label}: ${value}`),
    ...(content.details?.length ? [""] : []),
    ...content.signature,
    "",
    "--",
    `${company.legalName} · ${company.phone} · ${company.email}`,
  ].join("\n");

  return { html, text };
}
