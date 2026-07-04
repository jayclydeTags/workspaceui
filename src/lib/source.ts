import { loader } from "fumadocs-core/source"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"

import { docs, meta } from ".source/server"

// Fumadocs loader over the generated `.source` collections (regenerated per
// bundler: createMDX for `next build`, the fumadocs vite plugin for tests).
// Replaces the old import.meta.glob loader.
export const source = loader({
  baseUrl: "/docs",
  source: toFumadocsSource(docs, meta),
})
