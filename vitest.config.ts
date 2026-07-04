import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// Standalone Vitest config (Next has no vite.config). No tests import .mdx or
// .source, so the fumadocs-mdx plugin isn't needed here.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
})
