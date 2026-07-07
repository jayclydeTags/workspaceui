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
    // userEvent-driven dialog tests can exceed the 5s default under full-suite
    // parallel load (they pass in isolation). ponytail: raise the ceiling.
    testTimeout: 15000,
    setupFiles: ["./src/test/setup.ts"],
  },
})
