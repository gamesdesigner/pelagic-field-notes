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
npx vite --config vite.netlify.config.ts
npm run build:netlify
```

`netlify.toml` defines the build and SPA fallback. Build output goes to `dist-netlify/`. The React entry point is `src/netlify-main.tsx`; lesson source is in `app/`.

The normal publishing path is a commit pushed to the connected GitHub `main` branch. Verify that its Netlify deployment reaches `ready`. If Netlify rejects a deployment because of account credits, report that limitation; do not purchase credits or change billing without authorization.

## Retired host

The ChatGPT-hosted website is retired for this project. Do not edit or deploy it. The `.openai/hosting.json` and Vinext/Worker files are legacy configuration, not the production publishing path. Read `AGENTS.md` before making changes.
