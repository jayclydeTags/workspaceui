import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // @/registry/* resolves to the registry source folder so the demo app
      // uses the same import paths that shadcn rewrites on consumer install.
      { find: /^@\/registry(.*)$/, replacement: path.resolve(__dirname, "./registry") + "$1" },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    alias: [
      { find: /^@\/registry(.*)$/, replacement: path.resolve(__dirname, "./registry") + "$1" },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
})
