# CLAUDE.md

Premium cleaning company website and admin back office for Luxembourg.
Next.js 16 (App Router) · TypeScript strict · Tailwind v4 · next-intl · Drizzle + PostgreSQL ·
hosted on Railway. Repo: https://github.com/lonla01/elite_cleaners

@AGENTS.md

## Working agreement

- Work milestone by milestone (see the brief). Stop for review at the end of each one.
- One commit per coherent change, using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`,
  `test:`, `refactor:`).
- Never copy text, images, logos, testimonials or statistics from reference sites. All copy is
  original and written for Luxembourg.
- Every company-specific value is a placeholder. Track it in `PLACEHOLDERS.md` when you add it.

## Decisions agreed with the owner

- **One place to edit company details.** The DB `settings` row (edited in /admin/settings) is the
  source of truth for the site, emails and documents. `src/config/company.ts` only holds the
  defaults that seed it, plus the fallback used when there is no database (build, tests).
- **Numbering.** Invoices use `YYYY-NNNN`, credit notes `CN-YYYY-NNNN`, and quotes `Q-YYYY-NNNN`.
  Invoices and credit notes are gap-free.
- **Partial payments** are supported through a `payments` table. An invoice becomes `paid` when
  its payments cover the total.
- **No prices on the public site.** Quotes only.
- **Hero slides are manual.** No autoplay.
- **Areas map** is an inline SVG of the cantons, built from OpenStreetMap-derived data, with an
  ODbL attribution.
- **Analytics:** Plausible, loaded only after consent.
- **Branches:** `main` deploys to Railway staging, and `production` deploys to Railway
  production. Releases are PRs from `main` into `production`. Never push to `production`
  directly.
- **Package manager:** pnpm. Node 24 LTS in CI and on Railway (see `.nvmrc`).

## Commands

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` · `pnpm typecheck` · `pnpm format` · `pnpm test` (Vitest) ·
  `pnpm test:e2e` (Playwright, runs against `pnpm build` output)
- `pnpm db:generate` (creates a migration from schema changes; commit it) · `pnpm db:migrate`
  (also runs as Railway's pre-deploy command)
- CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, unit tests, migrations,
  build and e2e on every PR. All of them must pass.

## Next.js 16 specifics (read `node_modules/next/dist/docs/` when unsure)

- The middleware file is `src/proxy.ts`. It only runs next-intl routing. **Never rely on it for
  auth.** Check auth in the admin layout and in every server action.
- **Cache Components is on.** Data is dynamic by default. Use `"use cache"` + `cacheLife()` +
  `cacheTag()` for shared data, and wrap runtime reads (`cookies()`, `headers()`) in `<Suspense>`.
  Settings and content reads are cached and tagged. Admin mutations call `revalidateTag()`.
- Multiple root layouts: `app/[locale]/layout.tsx` (public site) and `app/admin/layout.tsx`.
  There is no `app/layout.tsx`. `app/global-not-found.tsx` handles unmatched URLs.
- `typedRoutes` is on. Use the localised `Link` from `@/i18n/navigation` for public links.

## Architecture rules

- **Pages never read content files directly.** They call `src/content` (`getService(slug, locale)`,
  `listCommunes(locale)`, ...). Swapping in a CMS later should only touch `src/content`.
- **Server-only code lives in `src/server/**`** and starts with `import "server-only"`.
- **The billing logic is pure.** `src/server/billing/{money,vat,totals}.ts` take no DB and no I/O,
  and they have unit tests. Their callers handle persistence.
- **Admin mutations are server actions.** Each one follows the same order:
  `requireUser({ role })`, then Zod parse, then a transaction, then an audit log entry. No
  unauthenticated action exists under `/admin`.
- External services sit behind small interfaces: `EmailProvider` (Resend, SMTP, log),
  `StorageProvider` (S3 / Railway bucket), `AnalyticsProvider`, and `EInvoiceExporter` (stub in v1).
- Env vars are read only in `src/env.ts`, which validates them with Zod. Use `requireEnv()` for
  values that must exist at runtime. The DB connects lazily via `db()`.

## Money, VAT and documents

- All amounts are **integer cents** (`number`, never float arithmetic on euros).
  Quantities are integer **thousandths** (`quantityMilli`). VAT rates are integer **basis points**
  (1700 = 17 %).
- Rounding: round half away from zero at the line net, then compute VAT **per rate** on the sum
  of line nets for that rate (EN 16931 style). Keep this in one function.
- VAT rates come from the DB. Never hard-code a rate.
- Invoice and credit-note numbers are assigned **at issue**, inside the issuing transaction, via
  `document_sequences` (`INSERT ... ON CONFLICT DO UPDATE ... RETURNING`). A rollback releases the
  number, so the series stays gap-free. Drafts have no number.
- Issued invoices and credit notes are immutable: seller and buyer data are snapshotted, and a DB
  trigger blocks edits except to status and payment fields. Corrections go through credit notes.

## i18n

- Locales are `en` (default) and `fr` (both enabled), plus `de` and `lb` (disabled). They are
  configured in `src/config/locales.ts`, and translated route segments live in
  `src/i18n/pathnames.ts`.
- **No hard-coded user-facing strings.** UI strings live in `messages/<locale>.json`, and missing
  keys fall back to English. Content lives in `content/<locale>/`. This rule also applies to
  metadata, validation errors, emails and PDFs. Internal dev-only pages (the styleguide) are the
  only exception.
- Always format through `src/i18n/format.ts`. Dates are always DD/MM/YYYY (Europe/Luxembourg),
  currency is EUR, and `lb` falls back through lb-LU → lb → de-LU.
- Pass `locale` explicitly to `getTranslations({ locale, namespace })` in pages and cached
  functions.
- Services and communes have translated slugs in their content files. Pages with a dynamic
  slug pass a per-locale `href` to `buildMetadata()` (via `getSlugMaps()`), and the header's
  `LanguageSwitcher` uses the same maps. Any new user-facing text needs both `en` and `fr`.
- French copy uses French typography (narrow no-break space before `? ! ;`, no-break space
  before `:` and inside « », typographic apostrophe ’).
- Admin UI is English-only (still uses message keys under `Admin.*`).
- Design for text 40 % longer than English: no fixed-width buttons, no nowrap labels.

## Content and components

- Content files live in `content/<locale>/*.json`, validated by the Zod schemas in
  `src/content/schemas.ts`. A missing locale file falls back to English. The list of services
  is in `content/services.json`, so adding a service means adding its id there plus one JSON file.
- Links in content are route keys plus params (`{ "href": "/services/[slug]", "params": {...} }`),
  never raw URLs. Images are registry keys (`src/content/images.ts`) plus translatable alt text.
- `@/components/site` (the barrel file) includes async server components. Client components
  must import sibling files directly, never the barrel.
- Every page sets metadata through `buildMetadata()` (`src/i18n/metadata.ts`), which adds the
  canonical URL and hreflang alternates.
- Unknown slugs under `[slug]`/`[commune]` render the not-found page with a 200 status and
  `noindex` (streaming has started). A Proxy slug check for a true 404 is planned in M8.
- In e2e tests, query headings by role and scope `alert`/`status` queries to `main` (the
  Next route announcer is also an alert). Form tests set a random `x-real-ip` per test so the
  rate limiter does not interfere. E2E tests need `DATABASE_URL` (CI service, or `.env.local`).
  Next 16 keeps the previous page in the DOM, hidden, after
  client navigation, so raw `h1` selectors can match twice.

## Public forms (contact, careers)

- Server actions live in `src/server/actions/`. Order: honeypot (`website` field, silent
  success), Zod parse (`src/server/forms/schemas.ts`, error messages are `Forms.errors` keys),
  Postgres rate limit (`rateLimit()`, keyed on a salted IP hash), DB insert, then emails in
  `after()` so the visitor never waits for the provider.
- Actions return `FormState` (`src/lib/form-state.ts`) with the submitted values; forms remount
  with them (`key={attempt}`) because React resets forms after an action.
- Emails: `sendEmail()` tries the configured providers (Resend, then SMTP as fallback) and
  logs every attempt in `email_log`. It never throws. Visitor emails use the visitor's locale;
  internal notifications are English.
- Uploads go through `storage()` (Railway bucket, virtual-hosted URLs; `.data/uploads` in
  development). CVs are checked by magic bytes, max 5 MB.
- Leads and applications store `consentAt` and `consentVersion` (`src/config/legal.ts`).
- Cookie consent is kept in localStorage (`src/lib/consent.ts`). Analytics load only after
  consent, from the layout's `<Analytics>` component.

## UI

- Design tokens live in `src/styles/tokens.css` (Tailwind `@theme`). The public site uses the
  custom components in `src/components/site`. The admin will use shadcn/ui in
  `src/components/ui` (from milestone 6).
- Contrast: on light backgrounds, brass is text-safe only as `brass-700`. `brass-500` is
  decorative, or for text on navy. Inside `<Section tone="navy">`, components adapt through the
  `in-[.dark-surface]:` variant.
- WCAG 2.1 AA: visible focus, labelled inputs, alt text, checked contrast, and motion that
  respects `prefers-reduced-motion`.
- Images go through `next/image`. Every placeholder image is listed in `PLACEHOLDERS.md`.

## Security

- Validate every input server-side with Zod, even when the client also validates it.
- Rate-limit public forms and login (Postgres-backed). Public forms include a honeypot field.
- No non-essential cookies or scripts before consent. The locale cookie is disabled.
- Security headers and CSP are set in `next.config.ts`. Add new third-party origins there
  deliberately.
- Client logos ("Trusted by") are shown only with each client's **written permission**.
