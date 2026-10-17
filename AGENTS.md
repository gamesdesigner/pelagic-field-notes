# Ocean Biology: Netlify only

This canonical checkout targets Netlify. On October 17, 2026, the user authorized the existing ChatGPT-hosted website as a temporary second host. Work on that Site only in the separate `../sites-hosted/` checkout using its AGENTS.md and the Sites skill. Never run Sites source helpers in this canonical GitHub checkout.

## Source and deployment

- Canonical checkout: `/Users/leima/Desktop/Projects/Ocean_biology/site`.
- GitHub remote: `https://github.com/gamesdesigner/pelagic-field-notes.git`, branch `main`.
- Existing Netlify project ID: `c1ad4709-306e-4a2e-8695-baf83990d8d2`.
- Production URL: `https://marinebiology-learn.netlify.app` (`marinebiology.netlify.app` was already taken).
- Use `netlify.toml`, `vite.netlify.config.ts`, and the static React entry in `src/netlify-main.tsx`.
- Build with `npm run build:netlify` (or the configured pnpm equivalent); publish directory is `dist-netlify`.
- Git pushes to the connected GitHub main branch are the normal Netlify deployment path.
- Verify the corresponding Netlify deployment reaches `ready` before reporting publication.
- Obtain the current public URL from the Netlify project; do not infer it from the legacy Sites manifest.

## Separate temporary Sites mirror

Use Netlify tools and builds from this checkout. The `.openai/hosting.json` here is legacy information; Sites operations belong to the separate mirror. Retain both hosts for now, as explicitly requested. The Sites mirror uses the existing Site project and its own Worker/D1 account storage.

Preserve unrelated local changes in the older checkout at `/Users/leima/Documents/Codex/2026-08-20/layout-for-an-ocean-biology-study`; it is not the active working directory.
