# Marine Biology Class

Interactive ocean-science lessons, animal animations, quizzes, and two reading levels.

## Production

- Website: https://marinebiology-learn.netlify.app
- Hosting: **Netlify only**.
- Netlify project ID: `c1ad4709-306e-4a2e-8695-baf83990d8d2`.
- GitHub: https://github.com/gamesdesigner/pelagic-field-notes (branch `main`).

The existing Netlify project was renamed to `marinebiology-learn` on October 17, 2026, as requested. `127.0.0.1:5173` is only the local development preview; the public address is the Netlify URL above.

## Development and build

Install dependencies using the existing lockfile, then run the Vite configuration used by Netlify:

```sh
pnpm run dev:netlify
pnpm run build:netlify
pnpm run test:accounts
pnpm run typecheck:netlify
```

`netlify.toml` defines the build and SPA fallback. Build output goes to `dist-netlify/`. The React entry point is `src/netlify-main.tsx`; lesson source is in `app/`.

The normal publishing path is a commit pushed to the connected GitHub `main` branch. Verify that its Netlify deployment reaches `ready`. If Netlify rejects a deployment because of account credits, report that limitation; do not purchase credits or change billing without authorization.

## Accounts and cuttlefish discovery

The welcome page uses the existing logo and offers sign-up and sign-in. Registration requires a username and any non-empty password (up to 128 characters); email is optional. Accounts use a Netlify Function (`netlify/functions/auth.mjs`) and the private `marine-biology-private-accounts` Netlify Blobs store. Passwords are salted and hashed with scrypt. Random sessions use HttpOnly, SameSite cookies, Secure on HTTPS, with seven-day expiry. The server validates inputs, checks the request origin, and limits login/registration attempts. Optional emails stay in the private account record and are not returned to the browser. Email verification and password recovery are not implemented.

The Vite development server uses the same handler with disposable server-memory records. Local preview accounts disappear when the development server restarts; production uses persistent Netlify Blobs. Do not publish only `dist-netlify/` as a static ZIP: the account function must also be deployed through the connected Netlify build. Lesson assets remain public resources; the welcome gate is not a paywall or confidential-content authorization layer.

The Common Cuttlefish lesson includes six interactive anatomy markers, generated teaching illustrations, chromatophore/iridophore/leucophore explanations, papillae texture controls, animated pigment expansion, and a seven-question, five-option quiz. Generated illustrations and their prompt set are in `public/assets/cuttlefish/`. The diagrams are simplified artistic teaching models rather than microscopy.

## Owner setup and student accounts

Owner signup requires the private `MARINE_OWNER_SETUP_CODE` server environment variable. The welcome page offers **Owner signup** only while that code is configured and the private store has no owner. Register a new account or use an existing student's username and password, then supply the setup code. The server atomically claims a single owner record; regular signup cannot assign an owner role. After setup, use the normal Sign in button. Concurrent claims can create a regular student account for the losing request, but cannot grant it owner access.

For local development the code is loaded from ignored `.env.local`. The private handoff file `../OWNER_SETUP_PRIVATE.txt` contains the code and instructions; it must never be committed or copied into `public/`. Local ownership and accounts reset when the development server restarts. Do not create a default owner, hard-code an invitation in client code, or automatically promote the first public signup.

For Netlify, configure `MARINE_OWNER_SETUP_CODE` as a **production** server environment variable before deploying. Function-only scope was refused by the current plan. A broader-scope retry was rejected by automatic approval review; production setup remains unconfigured pending the user's explicit approval. No broader scope, billing, or plan changes were made. Production uses the existing persistent private Netlify Blobs store. The owner code is never exposed by either account API or the built client.

Owners have a **Student accounts** button. The panel shows usernames, optional email, join date, and active/paused status. Search matches the start of a username, with 50 accounts per page. Owners can pause and reactivate accounts; these APIs verify owner status server-side on every request. Pausing increments a session version, permanently invalidating earlier sessions even after reactivation. The app rechecks sessions every minute while visible and when returning to the tab. A reactivated student must sign in again. Owner accounts cannot be modified through this panel. Student passwords and setup codes are never listed. Account deletion, password reset, and lesson editing are not provided by this panel.

## Retired host

The ChatGPT-hosted website is retired for this project. Do not edit or deploy it. The `.openai/hosting.json` and Vinext/Worker files are legacy configuration, not the production publishing path. Read `AGENTS.md` before making changes.
