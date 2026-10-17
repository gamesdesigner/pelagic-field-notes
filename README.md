# Marine Biology Class

Interactive ocean-science lessons, animal animations, quizzes, and two reading levels.

## Production

- Website: https://marinebiology-study.netlify.app
- Hosting: **Netlify only**.
- Netlify project ID: `c1ad4709-306e-4a2e-8695-baf83990d8d2`.
- GitHub: https://github.com/gamesdesigner/pelagic-field-notes (branch `main`).

The requested `marinebiology.netlify.app` name was unavailable. The existing Netlify project was renamed to `marinebiology-study` on October 16, 2026.

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

## Retired host

The ChatGPT-hosted website is retired for this project. Do not edit or deploy it. The `.openai/hosting.json` and Vinext/Worker files are legacy configuration, not the production publishing path. Read `AGENTS.md` before making changes.
