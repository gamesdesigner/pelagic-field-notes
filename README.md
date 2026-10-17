# Marine Biology Class

Interactive ocean-science lessons, animations, quizzes, and two reading levels.

## Vercel migration

The user requested migration from Netlify to Vercel on October 17, 2026.
Project `marinebiology-learn` is created in team `projects-9420`:
https://vercel.com/projects-9420/marinebiology-learn

Migration is pending database provisioning and a verified deployment. Existing
sites remain available during migration. Netlify is still serving older source
because account credits block new builds. The temporary current-content mirror
is https://marinebiology-learn.isuxyang.chatgpt.site, with separate account storage.

Canonical source: https://github.com/gamesdesigner/pelagic-field-notes (`main`).
Read `AGENTS.md` before deployment. Never copy private handoff files into source.

## Development and verification

Use Node 24 and the pnpm lockfile:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm run typecheck:vercel
pnpm run build:vercel
```

`vite.vercel.config.ts` builds the React entry `src/main.tsx` into `dist-vercel/`.
Lessons live in `app/`. Local accounts use disposable process memory and reset
when the Vite server restarts. Production deploys the source and `api/` functions
together; uploading only the static build would break sign-in.

## Persistent accounts on Vercel

Vercel Functions `api/auth.js` and `api/students.js` use shared handlers in
`server/accounts/`. The Postgres adapter uses parameterized queries and atomic
conditional writes to protect concurrent signup, singleton ownership, and
session revocation. No process-memory fallback exists on production endpoints.

Connect a Neon Postgres database using Vercel Storage. Set the private production
`DATABASE_URL` (or `POSTGRES_URL`) and execute the bounded, idempotent migration:

```sh
pnpm run db:migrate:vercel
```

The command reads an ignored `.env.vercel.local` if present, or process environment.
It creates `marine_account_records` from `migrations/postgres/001_account_records.sql`.
Never expose database URLs through VITE_ variables, commit them, or print them in logs.
Use separate databases for production and preview. Preserve previous-host databases;
account records are not automatically transferred by a hosting change.

Registration requires a username and any nonempty password up to 128 characters;
email is optional. Passwords use salted scrypt hashes. Seven-day sessions use
HttpOnly, SameSite cookies and Secure on HTTPS. APIs check origins, input sizes,
and attempt limits. Email verification and password recovery are not implemented.
Lesson assets are public; the welcome gate does not make lesson content confidential.

## Owner setup and student management

Configure private production `MARINE_OWNER_SETUP_CODE`. Owner signup appears only
when this is configured and the database has no owner. The account must supply
its password and that setup code. The singleton owner is claimed atomically;
ordinary signup cannot grant ownership. After claiming ownership use normal Sign in.
Keep the Vercel owner code in a private handoff file outside the repository.
Never create a default owner or automatically promote the first public signup.
Local `.env.local` is ignored and local ownership resets with the server.

Owners can search students by username prefix, view optional emails and join dates,
and pause/reactivate accounts in pages of 50. Server checks owner status on every
request. Pausing permanently revokes previous sessions even after reactivation;
a fresh sign-in is required. The app rechecks sessions every minute while visible
and when returning to the tab. Passwords and setup codes are never listed.
Account deletion, password reset, and lesson editing are not included.

## Retained rollback configuration

Legacy Netlify configuration and adapters remain for rollback, but Netlify is no
longer the deployment target. Its project ID is `c1ad4709-306e-4a2e-8695-baf83990d8d2`.
The previously rejected broad-scope Netlify secret action remains unapproved.
Temporary Sites source and Worker/D1 configuration are isolated in `../sites-hosted/`.
Do not run Sites source helpers in this canonical Git checkout or delete existing hosts.
