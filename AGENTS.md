# Ocean Biology: Netlify only

The user explicitly switched all future work to the existing Netlify website on October 16, 2026. Do not work on or publish the old ChatGPT-hosted website again.

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

## Retired hosting

Do not call Sites synchronization, save, deploy, domain, or access tools. Do not run `site-workflow.mjs`. The `.openai/hosting.json` file is legacy configuration. Historical ChatGPT-hosted URLs and publishing instructions do not override the user's Netlify-only instruction.

Preserve unrelated local changes in the older checkout at `/Users/leima/Documents/Codex/2026-08-20/layout-for-an-ocean-biology-study`; it is not the active working directory.
