# Ocean Biology: Vercel migration

The user requested switching from Netlify to Vercel on October 17, 2026.
This supersedes the older Netlify-only deployment target.

## Source and deployment

- Canonical checkout: `/Users/leima/Desktop/Projects/Ocean_biology/site`.
- Origin: `https://github.com/gamesdesigner/pelagic-field-notes.git`, branch `main`.
- Vercel team: `team_H46xn7eMAifKIkbtBxahAwMU` (`projects-9420`).
- Vercel project: `prj_p8H4QykqouyJu8leR4eIJbaITawL` (`marinebiology-learn`).
- Build: `pnpm run build:vercel`; output: `dist-vercel`; config: `vercel.json`.
- React entry: `src/main.tsx`; API: `api/auth.js`, `api/students.js`.
- Validate with `pnpm test` and `pnpm run typecheck:vercel`.
- Production accounts require Neon Postgres (`DATABASE_URL` or `POSTGRES_URL`).
  Run `pnpm run db:migrate:vercel` with the private URL configured before release.
  Never fall back to in-memory records in production.
- `MARINE_OWNER_SETUP_CODE` is a private server environment variable. No VITE_ prefix.
- A deployment is complete only after Vercel reports READY and public browser/API
  checks pass. Obtain the actual assigned URL; do not invent a subdomain.
- Migration is currently pending database provisioning and deployment verification.

## Existing hosts

Keep existing sites available during migration. Retain Netlify adapters/configuration
for rollback; do not deploy there. Its project ID is
`c1ad4709-306e-4a2e-8695-baf83990d8d2` and updates remain credit-blocked.
The separate temporary Sites mirror is `../sites-hosted/`; never run Sites source
helpers in this canonical checkout. Each host has a separate account database.
Do not retry the previously rejected broad-scope Netlify secret configuration.

Preserve unrelated local changes in the older checkout at
`/Users/leima/Documents/Codex/2026-08-20/layout-for-an-ocean-biology-study`.
