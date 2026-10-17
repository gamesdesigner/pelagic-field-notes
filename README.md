# Marine Biology Class

Interactive ocean-science lessons, animations, quizzes, and two reading levels.

## Vercel migration

The user requested migration from Netlify to Vercel on October 17, 2026.
Project `marinebiology-learn` is created in team `projects-9420`:
https://vercel.com/projects-9420/marinebiology-learn

The first Vercel build is ready at https://marinebiology-learn.vercel.app.
The private Blob account backend update is pending final deployment verification. Existing
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
`server/accounts/`. Private Vercel Blob holds JSON account records; no Neon or
external database is required. The connected store is `store_5P506RkyxPFpB47z`.
The production `BLOB_READ_WRITE_TOKEN` is injected by Vercel, never client code.
Do not commit it or prefix it with VITE_. Keep preview records separate from
production; the adapter uses environment-specific path namespaces.

Reads use `useCache: false` so session revocation and account pauses are immediate.
New records disallow overwrites; updates require the previous ETag (`ifMatch`).
These conditional writes protect simultaneous signup, singleton ownership, and
attempt limits. No process-memory fallback exists on production endpoints.
The private store is initialized on use; no SQL migration is required.

Run optional integration verification with an ignored `.env.vercel.local` containing
the private store token:

```sh
MARINE_BLOB_INTEGRATION=1 node --env-file=.env.vercel.local --test tests/vercel-accounts.test.mjs
```

The test uses a random isolated namespace and removes its records afterward.
Previous hosts have separate account records, which are not automatically moved.

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
