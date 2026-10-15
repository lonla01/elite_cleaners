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
      Typefaces are Heebo (headings, navigation, buttons) and IBM Plex Sans (body), both from
      Google Fonts under the SIL Open Font License.

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

- [ ] Replace the stock photos with the company's own photography where possible.

The files in `public/images/` are stock photos from [Pexels](https://www.pexels.com/), used under
the [Pexels licence](https://www.pexels.com/license/): free for commercial use, no attribution
required. They show no real staff, clients or premises of the company. Pexels does not allow
reselling the photos unaltered or implying that people shown endorse the company.

To replace a photo, keep the file name and aspect ratio, or update `src/content/images.ts`, then
update the alt text in the content files (`en` and `fr`) that reference the key. Full-bleed heroes
are 2560×1600 and are cropped with `object-cover`; keep the subject near the centre and leave calm
space on the left for the text. After replacing files, bump `imageVersion` in
`src/content/images.ts` so browsers and caches fetch the new ones. Do not re-run
`generate-placeholders --force`.

| Key / file                                  | Size      | Used on                               | Source                                                    |
| ------------------------------------------- | --------- | ------------------------------------- | --------------------------------------------------------- |
| `hero-residential.webp`                     | 2560×1600 | Home hero, slide 1                    | [Pexels 7534561](https://www.pexels.com/photo/7534561/)   |
| `hero-corporate.webp`                       | 2560×1600 | Home hero, slide 2                    | [Pexels 32674962](https://www.pexels.com/photo/32674962/) |
| `hero-housekeeping.webp`                    | 2560×1600 | Home hero, slide 3                    | [Pexels 35189675](https://www.pexels.com/photo/35189675/) |
| `hero-post-renovation.webp`                 | 2560×1600 | Home hero, slide 4                    | [Pexels 6587896](https://www.pexels.com/photo/6587896/)   |
| `category-residential.webp`                 | 1200×900  | Home service cards                    | [Pexels 29012619](https://www.pexels.com/photo/29012619/) |
| `category-housekeeping.webp`                | 1200×900  | Home service cards                    | [Pexels 15195270](https://www.pexels.com/photo/15195270/) |
| `category-corporate.webp`                   | 1200×900  | Home service cards                    | [Pexels 36631701](https://www.pexels.com/photo/36631701/) |
| `about-hero.webp`                           | 2560×1600 | About                                 | [Pexels 4239146](https://www.pexels.com/photo/4239146/)   |
| `about-standards.webp`                      | 1200×1500 | About, "Our people"                   | [Pexels 6466489](https://www.pexels.com/photo/6466489/)   |
| `how-it-works-hero.webp`                    | 2560×1600 | How it works                          | [Pexels 7045703](https://www.pexels.com/photo/7045703/)   |
| `service-regular-home-cleaning.webp`        | 2560×1600 | Service: Regular home cleaning        | [Pexels 5998120](https://www.pexels.com/photo/5998120/)   |
| `service-deep-cleaning.webp`                | 2560×1600 | Service: Deep cleaning                | [Pexels 36777559](https://www.pexels.com/photo/36777559/) |
| `service-end-of-tenancy-cleaning.webp`      | 2560×1600 | Service: End of tenancy cleaning      | [Pexels 8146156](https://www.pexels.com/photo/8146156/)   |
| `service-post-renovation-cleaning.webp`     | 2560×1600 | Service: Post renovation cleaning     | [Pexels 20348123](https://www.pexels.com/photo/20348123/) |
| `service-window-cleaning.webp`              | 2560×1600 | Service: Window cleaning              | [Pexels 31435403](https://www.pexels.com/photo/31435403/) |
| `service-carpet-upholstery-care.webp`       | 2560×1600 | Service: Carpet upholstery care       | [Pexels 6980718](https://www.pexels.com/photo/6980718/)   |
| `service-serviced-apartment-turnover.webp`  | 2560×1600 | Service: Serviced apartment turnover  | [Pexels 36916378](https://www.pexels.com/photo/36916378/) |
| `service-office-cleaning.webp`              | 2560×1600 | Service: Office cleaning              | [Pexels 7750129](https://www.pexels.com/photo/7750129/)   |
| `service-financial-institutions.webp`       | 2560×1600 | Service: Financial institutions       | [Pexels 14613453](https://www.pexels.com/photo/14613453/) |
| `service-transport-public-facilities.webp`  | 2560×1600 | Service: Transport public facilities  | [Pexels 20712722](https://www.pexels.com/photo/20712722/) |
| `service-medical-practices.webp`            | 2560×1600 | Service: Medical practices            | [Pexels 6812453](https://www.pexels.com/photo/6812453/)   |
| `service-luxury-retail-hospitality.webp`    | 2560×1600 | Service: Luxury retail hospitality    | [Pexels 33257665](https://www.pexels.com/photo/33257665/) |
| `service-commercial-post-construction.webp` | 2560×1600 | Service: Commercial post construction | [Pexels 5511098](https://www.pexels.com/photo/5511098/)   |
| `service-disinfection-sanitisation.webp`    | 2560×1600 | Service: Disinfection sanitisation    | [Pexels 4099471](https://www.pexels.com/photo/4099471/)   |
| `services-hero.webp`                        | 2560×1600 | Services overview                     | [Pexels 10557898](https://www.pexels.com/photo/10557898/) |
| `areas-hero.webp`                           | 2560×1600 | Areas we serve                        | [Pexels 32224979](https://www.pexels.com/photo/32224979/) |
| `careers-hero.webp`                         | 2560×1600 | Careers                               | [Pexels 6197108](https://www.pexels.com/photo/6197108/)   |
| `testimonials-hero.webp`                    | 2560×1600 | Testimonials                          | [Pexels 6615908](https://www.pexels.com/photo/6615908/)   |
| `contact-hero.webp`                         | 2560×1600 | Contact                               | [Pexels 12277631](https://www.pexels.com/photo/12277631/) |
| `commune-hero.webp`                         | 2560×1600 | Every commune page                    | [Pexels 19909061](https://www.pexels.com/photo/19909061/) |
| `legal-hero.webp`                           | 2560×1600 | Privacy, cookies, legal notice        | [Pexels 6615805](https://www.pexels.com/photo/6615805/)   |

Photos of real staff or clients need their written consent (GDPR / image rights).

## Content placeholders (in `content/en/`)

- [ ] `home.json`: trust bar `[XX] years` and the insurer name, plus 6 "Trusted by" logo slots.
      **Real client logos (CFL, banks, …) only with each client's written permission.**
- [ ] `testimonials.json`: 6 placeholder testimonials (the home page shows the first 3),
      published only with each client's written consent.
- [ ] `pages/about.json`: founding story paragraph, `[XX] years`, insurer and cover.
- [ ] `services/*.json`: original service descriptions. Review every claim (vetting checks,
      response times, partners, products) against what the company actually does.
- [ ] `communes/*.json`: local descriptions for the 6 starter areas. Check that they match
      where the company really works; add communes by adding an id to `content/communes.json`.
- [ ] `pages/contact.json`: displayed opening hours `[Monday to Friday, 8:00 to 18:00]`.
- [ ] `pages/careers.json`: `[collective agreement]` wording for employment conditions.

## Legal pages (in `content/en/pages/`) — to review with a lawyer

The privacy policy, cookie policy and legal notice are templates. Each shows a "pending legal
review" notice until its `reviewed` field is set to `true`. Company details (`{legalName}`,
`{rcs}`, …) are filled in from the settings automatically.

- [ ] `privacy.json`: retention periods `[24 months]` (unconverted leads), `[6 months]`
      (applications), `[12 months]` (email logs); processor names `[Hosting provider]`,
      `[Storage provider]`, `[Email provider]`, `[Analytics provider]`.
- [ ] `cookies.json`: `[Plausible Analytics]` (confirm the provider).
- [ ] `legal-notice.json`: legal form, share capital, managing/publication director, hosting
      provider name and address.
- [ ] When the privacy policy changes materially, update its `updated` date and
      `privacyNoticeVersion` in `src/config/legal.ts` (stored with each lead and application).

## French translation

- [ ] Have a native French speaker review `messages/fr.json` and everything in `content/fr/`
      (service descriptions, area pages, emails). The legal pages in French also need the
      lawyer's review, like the English ones.
- [ ] The same placeholders exist in French (`[XX] ans`, `[Logo client 1]`, opening hours,
      `[convention collective]`, legal details): replace them in both languages.

## Map data

The canton map (`src/content/geo/cantons.ts`) is generated from OpenStreetMap by
`node scripts/build-canton-map.mjs`. Its ODbL attribution is shown under the map and must stay.
