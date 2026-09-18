import { existsSync } from "fs"
import { join } from "path"
import { describe, expect, it } from "vitest"

import { copyBlockComponents } from "@/lib/blocks"
import { getBlockGroups, getBlocksNav } from "@/lib/block-taxonomy"
import { COPY_BLOCKS_DIR, copyBlocks } from "@/lib/copy-blocks"
import registry from "../../../registry.json"

describe("copy-only blocks", () => {
  it("every manifest entry has a component, and vice versa", () => {
    expect(Object.keys(copyBlockComponents).sort()).toEqual(
      copyBlocks.map((b) => b.slug).sort()
    )
  })

  it("never shares a slug with a registry item", () => {
    const registryNames = new Set(registry.items.map((i) => i.name))
    expect(copyBlocks.filter((b) => registryNames.has(b.slug))).toEqual([])
  })

  it("lists source files that exist on disk", () => {
    for (const block of copyBlocks) {
      for (const file of block.files) {
        const path = join(process.cwd(), COPY_BLOCKS_DIR, block.slug, file)
        expect(existsSync(path), `${block.slug}/${file} missing`).toBe(true)
      }
    }
  })

  it("shows in the gallery and the sidebar", () => {
    const gallery = new Set(
      getBlockGroups().flatMap((g) => g.items.map((i) => i.slug))
    )
    const sidebar = new Set(
      getBlocksNav().flatMap((f) =>
        (f.groups ?? []).flatMap((g) => g.items.map((i) => i.href))
      )
    )
    for (const { slug } of copyBlocks) {
      expect(gallery.has(slug), `${slug} not in gallery`).toBe(true)
      expect(sidebar.has(`/blocks/${slug}`), `${slug} not in sidebar`).toBe(
        true
      )
    }
  })
})
