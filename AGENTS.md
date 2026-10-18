# Ocean Biology: Vercel production

The user explicitly requested live Vercel updates on October 18, 2026.
This overrides the earlier Netlify-only deployment instruction.

- Work in this canonical `site/` checkout on `main`.
- Origin: https://github.com/gamesdesigner/pelagic-field-notes.git.
- Vercel project: `prj_p8H4QykqouyJu8leR4eIJbaITawL` (`marinebiology-learn`).
- Team: `team_H46xn7eMAifKIkbtBxahAwMU` (`projects-9420`).
- Website: https://marinebiology-learn.vercel.app.
- Build: `pnpm run build:vercel`; output: `dist-vercel`.
- Validate: `pnpm test` and `pnpm run typecheck:vercel`.
- Deploy source with `api/` Vercel Functions; a static-only upload would omit
  sign-in and saved progress. API handlers share `server/accounts/`.
- Private Vercel Blob store `store_5P506RkyxPFpB47z` holds existing production
  accounts and learning records through `server/accounts/vercel-store.mjs`.
  Preserve uncached reads, environment namespaces and conditional ETag writes.
  Never use production memory or overwrite this store from another host.
- Keep stable account keys, legacy sessions, owner authorization, and progress
  during username changes and deployment. Never overwrite the real owner password
  or run owner provisioning during deployment. Public owner signup stays removed.
- Grade quizzes on the server using the shared bank. Drafts and completed attempts
  belong to the authenticated account. Preserve revision checks, completed-answer
  immutability, and idempotent score saves. Owner student reports remain owner-only.
- Never edit, deploy, rename, or manage the old `*.chatgpt.site` website.
  Do not use Sites source helpers or publishing tools. `.openai/hosting.json` and
  historical Sites entries are legacy information.
- Do not deploy to Netlify unless the user explicitly requests it again.
- Netlify previously blocked deployments because account credits were exceeded.
  Verify the actual deployment result; do not claim a blocked build is live or
  purchase credits/change billing without the user's authorization.
- Do not retry the previously rejected broad-scope Netlify secret configuration.
  Keep credentials and private handoff files out of source and public assets.
- Preserve unrelated changes in other checkouts.
