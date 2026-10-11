# Placeholders to replace

An inventory of everything the company must supply or validate. It is completed in milestone 9.

## Company identity and legal details

Defaults are in `src/config/company.ts`. From milestone 6, edit them in **/admin/settings**.

- [ ] Company name, legal name (S.à r.l. / S.A.), tagline
- [ ] Registered address (street, L-postcode, city)
- [ ] Phone (+352), WhatsApp number, contact email, lead notification email
- [ ] RCS number, business permit (autorisation d'établissement) number, VAT number (LU…)
- [ ] IBAN / BIC
- [ ] Year founded
- [ ] Logo (SVG preferred) and favicon

## Brand

- [ ] Final colours and typefaces. The current palette in `src/styles/tokens.css` is a proposal.

## Infrastructure

- [ ] Production domain (`NEXT_PUBLIC_SITE_URL`)
- [ ] Email sender domain verified in Resend (`EMAIL_FROM`)
- [ ] Plausible site domain

## To validate with the accountant

- [ ] Default VAT rate(s) and categories
- [ ] Mandatory invoice mentions, reverse-charge wording
- [ ] Numbering formats: invoices `YYYY-NNNN`, credit notes `CN-YYYY-NNNN`
- [ ] Payment terms

_Photos, testimonials, client logos (with written permission), service descriptions and
retention periods are added here as the related milestones land._
