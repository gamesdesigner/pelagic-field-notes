import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { localAccounts } from "./netlify/lib/dev-auth.mjs";

export default defineConfig(({ mode }) => ({
  plugins: [react(), localAccounts({ ownerSignupCode: loadEnv(mode, process.cwd(), 'MARINE_').MARINE_OWNER_SETUP_CODE })],
  publicDir: "public",
  build: {
    outDir: "dist-netlify",
    emptyOutDir: true,
  },
}));
