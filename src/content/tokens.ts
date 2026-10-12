import type { CompanyDetails } from "@/config/company";

/** Values available to content as {token}. Company details come from the settings. */
export function companyTokens(company: CompanyDetails, siteUrl: string): Record<string, string> {
  return {
    companyName: company.name,
    legalName: company.legalName,
    address: `${company.address.street}, ${company.address.postcode} ${company.address.city}, Luxembourg`,
    email: company.email,
    phone: company.phone,
    rcs: company.rcsNumber,
    vat: company.vatNumber,
    permit: company.businessPermitNumber,
    siteUrl,
  };
}

/** Replaces {token} with its value. Unknown tokens are left as they are, so they stay visible. */
export function fillTokens(text: string, values: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
