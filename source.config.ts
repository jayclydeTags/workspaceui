import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { remarkNpm } from "fumadocs-core/mdx-plugins"

export const { docs, meta } = defineDocs({ dir: "src/content/docs" })

// rehypeCode (github-light/dark, defaultColor: false) is included in the default fumadocs preset
export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => [...v, remarkNpm],
  },
})
