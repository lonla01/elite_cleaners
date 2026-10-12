# Elite Cleaners: website and back office

Public website and internal back office for a premium cleaning company in Luxembourg.

Stack: Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · next-intl ·
Drizzle ORM + PostgreSQL · Railway.

> This README grows with each milestone. Content editing, the "How to add or enable a
> language" guide and deployment details are completed in milestone 9.

## Getting started

Requirements: Node 24+, pnpm 11, and a local PostgreSQL (optional until milestone 5).

```bash
pnpm install
cp .env.example .env.local   # then fill in values
pnpm dev                      # http://localhost:3000 → redirects to /en
```

Useful pages in development:

- `/en/styleguide`: design tokens and core components (returns 404 when `APP_ENV=production`)
- `/api/health`: health check used by Railway

## Scripts

| Command                        | Purpose                                       |
| ------------------------------ | --------------------------------------------- |
| `pnpm dev`                     | Dev server                                    |
| `pnpm build` / `pnpm start`    | Production build / server                     |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript                           |
| `pnpm format`                  | Prettier (with Tailwind class sorting)        |
| `pnpm test`                    | Unit tests (Vitest)                           |
| `pnpm test:e2e`                | End-to-end tests (Playwright, needs a build)  |
| `pnpm db:generate`             | Create a SQL migration from schema changes    |
| `pnpm db:migrate`              | Apply migrations (runs on Railway pre-deploy) |

## Project layout

```
content/<locale>/      Public content (services, communes, pages); from milestone 2
messages/<locale>.json UI strings
src/app/[locale]/      Public site (root layout per locale)
src/app/admin/         Back office (separate root layout, English only)
src/components/site/   Public design-system components
src/config/            Locales, company defaults, site config
src/i18n/              Routing, translated pathnames, formatting (incl. lb fallback)
src/server/            Server-only code: db, auth, billing, email, storage
src/styles/            Tailwind theme and design tokens
```

## Editing content

Public page copy lives in `content/en/` as JSON (home, about, how it works, service
categories, services, testimonials). UI strings such as menus, buttons and labels live in
`messages/en.json`. Content is validated at build time, so a typo in a field name fails the
build with a clear message. To replace an image, see `PLACEHOLDERS.md`.

Environments:

- Staging (from `main`): https://web-staging-995d.up.railway.app
- Production (from `production`): https://web-production-d8b3.up.railway.app (until the custom
  domain is set up)

## Internationalisation

- Locales: `en` (enabled), plus `fr`, `de` and `lb` (configured but disabled). URLs are always
  prefixed (`/en/...`), and route segments are translated in `src/i18n/pathnames.ts`.
- **Luxembourgish formatting fallback:** browser and Node `Intl` support for `lb` is
  incomplete. `src/i18n/format.ts` resolves `lb` through `lb-LU → lb → de-LU`, using the first
  tag the runtime supports. Dates are always DD/MM/YYYY in the Europe/Luxembourg time zone.

## Deployment (Railway)

`railway.json` defines the build, the pre-deploy migrations, the start command and the health
check. You need one Railway project with two environments, `staging` and `production`, and in
each of them:

- a Postgres service (set `DATABASE_URL=${{Postgres.DATABASE_URL}}` on the app);
- a bucket (S3-compatible) for uploads and generated PDFs;
- the variables listed in `.env.example`, with `APP_ENV=staging` or `APP_ENV=production`.

### Release flow

- `main` → **staging**. Every merge to `main` deploys to staging.
- `production` → **production**. To release, open a pull request from `main` into `production`
  (CI runs on it), then merge. Never commit directly to `production`.
- Search engines stay blocked until `ALLOW_INDEXING=true` is set on production at launch.

## CMS trade-off

All public content lives in typed per-locale files behind `src/content`, and pages call only
that module. A CMS can be added later (for example Payload, which runs inside Next.js on the same
Postgres) by re-implementing `src/content` without touching page components. Details are added
in milestone 3.
