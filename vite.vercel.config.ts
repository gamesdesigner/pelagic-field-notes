import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { localAccounts } from './netlify/lib/dev-auth.mjs';

export default defineConfig({
  plugins: [react(), localAccounts()],
  publicDir:'public',
  build:{outDir:'dist-vercel',emptyOutDir:true},
});
