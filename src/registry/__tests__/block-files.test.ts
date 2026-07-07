import { existsSync } from "fs"
import { join } from "path"
import { describe, it, expect } from "vitest"

import { blocks } from "@/lib/blocks"
import { blockFiles } from "@/lib/block-files"

// The /blocks/[slug] detail route calls notFound() when a gallery block has no
// blockFiles entry, and reads each ref's `src` off disk for the Code tab. Both
// gaps render as a broken page rather than a failing build — so guard them here.
const BLOCKS_DIR = "src/registry/bases/base/blocks"

describe("block-files manifest", () => {
  for (const block of blocks) {
    describe(block.slug, () => {
      it("has a blockFiles entry", () => {
        expect(blockFiles[block.slug]).toBeDefined()
        expect(blockFiles[block.slug].length).toBeGreaterThan(0)
      })

      it("references source files that exist on disk", () => {
        for (const ref of blockFiles[block.slug] ?? []) {
          const abs = join(process.cwd(), BLOCKS_DIR, block.slug, ref.src)
          expect(existsSync(abs), `${block.slug}/${ref.src} missing`).toBe(true)
        }
      })
    })
  }
})
