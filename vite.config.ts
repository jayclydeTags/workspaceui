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
  // ponytail: pre-bundle deps Vite discovers late, else it re-optimizes + reloads
  // on first load (transient 504s). Add names from any future "new dependencies
  // optimized" log line here.
  optimizeDeps: {
    include: ["@fuma-translate/react", "lucide-react", "next-themes"],
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
