# Marine Biology Class

Interactive ocean-science lessons, animations, quizzes, and two reading levels.

## Vercel migration

The user requested migration from Netlify to Vercel on October 17, 2026.
Project `marinebiology-learn` is created in team `projects-9420`:
https://vercel.com/projects-9420/marinebiology-learn

Live website: **https://marinebiology-learn.vercel.app**.
The private Vercel Blob account backend is live. The account-settings and welcome
redesign update is undergoing deployment verification. Existing
sites remain available as previous hosts. Netlify is still serving older source
because account credits block new builds. The temporary current-content mirror
is https://marinebiology-learn.isuxyang.chatgpt.site, with separate account storage.

Deployment `dpl_9hT2kpdmB1GCE8vQFtcEfzUw1vza` reached READY from code commit
`ac4c9b143b641fc95cbb4fd4bb93d70e0b3c83ed`. Live checks passed for short-password
signup, persistent sessions, sign-in/out, owner access, student
authorization, request origins, and lesson images. Only disposable test records
were removed. Existing host accounts have not been copied into the Vercel store.

Deploy through the connected Vercel API using Git source
`gamesdesigner/pelagic-field-notes`, branch `main`, production target, and the
project/team IDs in AGENTS.md. GitHub integration is not installed, so pushes alone
do not yet trigger automatic Vercel deployments. Verify READY and the live API.

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
email is optional. Passwords use salted scrypt hashes. Thirty-day sessions use
HttpOnly, SameSite cookies and Secure on HTTPS. APIs check origins, input sizes,
and attempt limits. Email verification and password recovery are not implemented.
Lesson assets are public; the welcome gate does not make lesson content confidential.

## Account settings and owner access

Public owner signup has been removed from the interface and API. The owner account
is configured administratively in private Vercel storage; it signs in using the
regular Sign in form. The user requested the owner name **Max Yang**. Never put an
owner password, hash, or invitation code in client code, documentation, or Git.
`server/accounts/provision-owner.mjs` is an administrative helper, never an API.
Run provisioning only after an explicit owner setup/reset instruction; deployment
must never reset an existing owner's changed credentials. The earlier setup-code
variable is unused. Private handoff instructions are outside the repository.

**Account settings** lets every signed-in user change a username or password after
entering the current password. New passwords are confirmed in the UI; any nonempty
password up to 128 characters is accepted. Usernames support 3–24 ASCII letters,
numbers, underscores, and single spaces between words; sign-in ignores case.
Display capitalization is preserved. Changes revoke all earlier sessions and issue
a new cookie for the current browser. Stable account keys preserve ownership and
student records across renames. Historical names remain reserved to prevent takeovers.
Legacy accounts and sessions are read compatibly; no data reset is required.

Owners can search students by the start of their current username, view optional
emails/join dates, and pause/reactivate accounts, with 50 accounts per page. APIs
check ownership on every request. Pausing permanently revokes previous sessions,
including after reactivation. The client rechecks sign-in each visible minute and
when returning to a tab. Passwords never appear in student management.

The illustrated signup/sign-in page keeps the existing logo and ocean palette,
adds turtle, cuttlefish, and ocean-current lesson previews, and explains the site.
The Vercel Blob account store persists across deployments. Cookies retain sign-in
for 30 days; signing out ends that session without deleting the account. No password
is stored in browser localStorage. Local development remains disposable memory.

## Retained rollback configuration

Legacy Netlify configuration and adapters remain for rollback, but Netlify is no
longer the deployment target. Its project ID is `c1ad4709-306e-4a2e-8695-baf83990d8d2`.
The previously rejected broad-scope Netlify secret action remains unapproved.
Temporary Sites source and Worker/D1 configuration are isolated in `../sites-hosted/`.
Do not run Sites source helpers in this canonical Git checkout or delete existing hosts.
