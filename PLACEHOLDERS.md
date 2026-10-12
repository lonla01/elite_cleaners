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

| Key / file                                  | Size      | Used on                                           | Suggested subject                                                            |
| ------------------------------------------- | --------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `hero-residential.webp`                     | 2400×1400 | Home hero, slide 1                                | Elegant living room in soft daylight                                         |
| `hero-corporate.webp`                       | 2400×1400 | Home hero, slide 2                                | Refined corporate lobby or office after hours                                |
| `hero-housekeeping.webp`                    | 2400×1400 | Home hero, slide 3                                | Pressed shirts or linen in a dressing room                                   |
| `hero-post-renovation.webp`                 | 2400×1400 | Home hero, slide 4                                | Newly renovated kitchen, gleaming surfaces                                   |
| `category-residential.webp`                 | 1200×900  | Home service cards                                | Tidy, bright residential interior                                            |
| `category-housekeeping.webp`                | 1200×900  | Home service cards                                | Folded linen on a made bed                                                   |
| `category-corporate.webp`                   | 1200×900  | Home service cards                                | Quiet open-plan office                                                       |
| `about-hero.webp`                           | 2400×1200 | About                                             | Team member polishing glass, hands only or consented                         |
| `about-standards.webp`                      | 1200×1500 | About, "Our people"                               | Supervisor and cleaner with a checklist                                      |
| `how-it-works-hero.webp`                    | 2400×1200 | How it works                                      | Consultation in a private residence                                          |
| `service-regular-home-cleaning.webp`        | 2400×1200 | Service: Regular home cleaning                    | A calm, freshly cleaned living room with plumped cushions and clear surfaces |
| `service-deep-cleaning.webp`                | 2400×1200 | Service: Deep cleaning                            | A gleaming kitchen with spotless worktops and polished stainless steel       |
| `service-end-of-tenancy-cleaning.webp`      | 2400×1200 | Service: End-of-tenancy cleaning                  | An empty, bright apartment with clean floors ready for handover              |
| `service-post-renovation-cleaning.webp`     | 2400×1200 | Service: Post-renovation cleaning                 | A newly renovated kitchen with protective film being removed from a cabinet  |
| `service-window-cleaning.webp`              | 2400×1200 | Service: Window & glass cleaning                  | Sunlight through spotless floor-to-ceiling windows                           |
| `service-carpet-upholstery-care.webp`       | 2400×1200 | Service: Carpet & upholstery care                 | Close-up of a soft wool rug being cleaned with care                          |
| `service-private-housekeeping.webp`         | 2400×1200 | Service: Private housekeeping & ironing           | Neatly pressed shirts hanging in a well-ordered dressing room                |
| `service-serviced-apartment-turnover.webp`  | 2400×1200 | Service: Serviced apartment & short-let turnover  | A serviced apartment bedroom with crisp white linen and folded towels        |
| `service-office-cleaning.webp`              | 2400×1200 | Service: Office cleaning                          | A modern open-plan office, clean and orderly in the early morning            |
| `service-financial-institutions.webp`       | 2400×1200 | Service: Financial institutions & secure premises | A quiet, polished bank reception area after closing                          |
| `service-transport-public-facilities.webp`  | 2400×1200 | Service: Transport & public facilities            | A bright, clean waiting area in a public transport station                   |
| `service-medical-practices.webp`            | 2400×1200 | Service: Medical & dental practices               | A spotless dental treatment room with clean, clear surfaces                  |
| `service-luxury-retail-hospitality.webp`    | 2400×1200 | Service: Luxury retail & hospitality              | An elegant boutique interior with polished floors and glass display cases    |
| `service-commercial-post-construction.webp` | 2400×1200 | Service: Commercial post-construction cleaning    | A newly fitted office floor with clean, empty desks ready for handover       |
| `service-disinfection-sanitisation.webp`    | 2400×1200 | Service: Disinfection & sanitisation              | A team member wiping down a door handle with a disinfectant cloth            |
| `services-hero.webp`                        | 2400×1200 | Services overview                                 | Professional equipment, neatly arranged                                      |
| `areas-hero.webp`                           | 2400×1200 | Areas we serve                                    | Luxembourg City skyline or a residential street                              |
| `careers-hero.webp`                         | 2400×1200 | Careers                                           | Team briefing, faces only with consent                                       |
| `testimonials-hero.webp`                    | 2400×1200 | Testimonials                                      | Calm, finished interior                                                      |

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

## Map data

The canton map (`src/content/geo/cantons.ts`) is generated from OpenStreetMap by
`node scripts/build-canton-map.mjs`. Its ODbL attribution is shown under the map and must stay.
