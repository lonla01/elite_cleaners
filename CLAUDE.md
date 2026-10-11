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

- Locales are `en` (default, the only enabled locale in v1), `fr`, `de` and `lb`. They are
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
- Admin UI is English-only (still uses message keys under `Admin.*`).
- Design for text 40 % longer than English: no fixed-width buttons, no nowrap labels.

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
