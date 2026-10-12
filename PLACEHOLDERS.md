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

## Photos

The files in `public/images/` are generated placeholders (navy or stone gradients labelled
"PLACEHOLDER · key"). Replace each one with a licensed photograph of the same name and similar
aspect ratio, or update `src/content/images.ts`. Update the alt text in the content file that
references the key. After replacing a file, do not re-run `generate-placeholders --force`.

| Key / file                   | Size      | Used on             | Suggested subject                                    |
| ---------------------------- | --------- | ------------------- | ---------------------------------------------------- |
| `hero-residential.webp`      | 2400×1400 | Home hero, slide 1  | Elegant living room in soft daylight                 |
| `hero-corporate.webp`        | 2400×1400 | Home hero, slide 2  | Refined corporate lobby or office after hours        |
| `hero-housekeeping.webp`     | 2400×1400 | Home hero, slide 3  | Pressed shirts or linen in a dressing room           |
| `hero-post-renovation.webp`  | 2400×1400 | Home hero, slide 4  | Newly renovated kitchen, gleaming surfaces           |
| `category-residential.webp`  | 1200×900  | Home service cards  | Tidy, bright residential interior                    |
| `category-housekeeping.webp` | 1200×900  | Home service cards  | Folded linen on a made bed                           |
| `category-corporate.webp`    | 1200×900  | Home service cards  | Quiet open-plan office                               |
| `about-hero.webp`            | 2400×1200 | About               | Team member polishing glass, hands only or consented |
| `about-standards.webp`       | 1200×1500 | About, "Our people" | Supervisor and cleaner with a checklist              |
| `how-it-works-hero.webp`     | 2400×1200 | How it works        | Consultation in a private residence                  |

Photos of real staff or clients need their written consent (GDPR / image rights).

## Content placeholders (in `content/en/`)

- [ ] `home.json`: trust bar `[XX] years` and the insurer name, plus 6 "Trusted by" logo slots.
      **Real client logos (CFL, banks, …) only with each client's written permission.**
- [ ] `testimonials.json`: 3 placeholder testimonials, published only with written consent.
- [ ] `pages/about.json`: founding story paragraph, `[XX] years`, insurer and cover.

_Service descriptions and retention periods are added here as the related milestones land._
