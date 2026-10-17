# Ocean Biology: Netlify only

The latest user-provided AGENTS.md instructions explicitly require Netlify only.
They override the historical Vercel migration entries in project documents.

- Work in this canonical `site/` checkout on `main`.
- Origin: https://github.com/gamesdesigner/pelagic-field-notes.git.
- Netlify project: `c1ad4709-306e-4a2e-8695-baf83990d8d2`.
- Website: https://marinebiology-learn.netlify.app.
- Build: `pnpm run build:netlify`; output: `dist-netlify`.
- Validate: `pnpm test` and `pnpm run typecheck:netlify`.
- Deploy source with the functions in `netlify/functions/`; a static-only upload
  would omit sign-in and saved progress. API handlers share `server/accounts/`.
- Private accounts and learning records use the existing Netlify Blob store,
  `marine-biology-private-accounts`, through `netlify/lib/blob-store.mjs`.
  Preserve strong reads and conditional ETag writes. Never use production memory
  or replace this account database with another host's database.
- Keep stable account keys, legacy sessions, owner authorization, and progress
  during username changes and deployment. Never overwrite the real owner password
  or run owner provisioning during deployment. Public owner signup stays removed.
- Grade quizzes on the server using the shared bank. Drafts and completed attempts
  belong to the authenticated account. Preserve revision checks, completed-answer
  immutability, and idempotent score saves. Owner student reports remain owner-only.
- Never edit, deploy, rename, or manage the old `*.chatgpt.site` website.
  Do not use Sites source helpers or publishing tools. `.openai/hosting.json` and
  historical Sites entries are legacy information.
- Do not deploy to or manage Vercel. Its retained adapters are historical source.
- Netlify previously blocked deployments because account credits were exceeded.
  Verify the actual deployment result; do not claim a blocked build is live or
  purchase credits/change billing without the user's authorization.
- Do not retry the previously rejected broad-scope Netlify secret configuration.
  Keep credentials and private handoff files out of source and public assets.
- Preserve unrelated changes in other checkouts.
