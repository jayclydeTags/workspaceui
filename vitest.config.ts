import path from "path"
import react from "@vitejs/plugin-react"
import fumadocs from "fumadocs-mdx/vite"
import { defineConfig } from "vitest/config"

// Standalone Vitest config (Next has no vite.config). fumadocs() is needed so
// Vite can transform the .mdx that src/lib/search.ts pulls in via an eager
// import.meta.glob (revisit in Phase 1 when search.ts moves to the loader).
export default defineConfig({
  plugins: [fumadocs(), react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: ".source", replacement: path.resolve(__dirname, "./.source") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
})
