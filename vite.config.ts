import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import fumadocs from "fumadocs-mdx/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [fumadocs(), react(), tailwindcss()],
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
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
})
