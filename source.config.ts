import { defineConfig, defineDocs } from "fumadocs-mdx/config"

export const { docs, meta } = defineDocs({ dir: "content/docs" })

// rehypeCode (github-light/dark, defaultColor: false) is included in the default fumadocs preset
export default defineConfig()
