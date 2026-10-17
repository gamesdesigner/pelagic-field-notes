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
- Production accounts use private Vercel Blob store `store_5P506RkyxPFpB47z`.
  Vercel injects `BLOB_READ_WRITE_TOKEN`; keep it server-only. Reads must bypass
  caches and updates must preserve ETag conditions. Never use Neon or fall back
  to process memory in production. No SQL migration is required.
- Public owner signup is removed. The Max Yang owner is configured in private
  account storage by explicit user request. Never put credentials in source/client
  code. `MARINE_OWNER_SETUP_CODE` is unused; never re-enable public owner signup.
- Account/settings changes must preserve stable account keys, legacy sessions,
  ETag conditions and server-side ownership. Sign-in sessions last 30 days.
- Never run owner provisioning on deploy or overwrite an owner's password without
  an explicit administrative setup/reset request.
- A deployment is complete only after Vercel reports READY and public browser/API
  checks pass. Obtain the actual assigned URL; do not invent a subdomain.
- Vercel URL: https://marinebiology-learn.vercel.app. Production deployment
  `dpl_9hT2kpdmB1GCE8vQFtcEfzUw1vza` is READY from code commit `ac4c9b1`;
  live signup, sessions, owner availability and assets are verified.
- Git-source deployments work through the Vercel API with
  `{type: "github", org: "gamesdesigner", repo: "pelagic-field-notes", ref: "main"}`.
  The GitHub integration is not installed; pushes alone do not auto-deploy.
- Vercel owner setup handoff: `../VERCEL_OWNER_SETUP_PRIVATE.txt` (private, outside Git).
  The user explicitly requested this owner configuration; it is now set. Test
  credential changes with disposable student accounts, never mutate the real
  owner credentials during QA.

## Existing hosts

Keep existing sites available during migration. Retain Netlify adapters/configuration
for rollback; do not deploy there. Its project ID is
`c1ad4709-306e-4a2e-8695-baf83990d8d2` and updates remain credit-blocked.
The separate temporary Sites mirror is `../sites-hosted/`; never run Sites source
helpers in this canonical checkout. Each host has a separate account database.
Do not retry the previously rejected broad-scope Netlify secret configuration.

Preserve unrelated local changes in the older checkout at
`/Users/leima/Documents/Codex/2026-08-20/layout-for-an-ocean-biology-study`.
