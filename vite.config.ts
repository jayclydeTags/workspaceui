import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { reactRouter } from "@react-router/dev/vite"
import react from "@vitejs/plugin-react"
import fumadocs from "fumadocs-mdx/vite"
import { defineConfig } from "vitest/config"

// ponytail: reactRouter() vite plugin doesn't support Vitest's test runner, so tests fall back to plain @vitejs/plugin-react for JSX transform
const isTest = !!process.env.VITEST

export default defineConfig({
  plugins: [fumadocs(), isTest ? react() : reactRouter(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: ".source", replacement: path.resolve(__dirname, "./.source") },
    ],
  },
  // ponytail: SPA mode has no index.html entry and react-router lazy-loads route
  // modules, so Vite's initial dep scan misses their imports, then re-optimizes +
  // reloads on first request (transient 504 "Outdated Optimize Dep"). Point the
  // scanner at all source so every dep is found in the first pass — no more
  // per-package whack-a-mole in `include`.
  optimizeDeps: {
    entries: ["./src/**/*.{ts,tsx,mdx}", "./.source/**/*.{js,ts}"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
})
