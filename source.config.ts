import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { remarkNpm } from "fumadocs-core/mdx-plugins"

// The component mdx files are read for their frontmatter (title/description,
// via `source`) and their "## API Reference" tables (lib/api-reference.ts); the
// body is compiled but never rendered.
export const { docs, meta } = defineDocs({ dir: "src/content/docs" })

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => [...v, remarkNpm],
  },
})
