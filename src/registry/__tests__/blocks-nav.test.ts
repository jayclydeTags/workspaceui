import { describe, it, expect } from "vitest"

import { blockComponents } from "@/lib/blocks"
import { getBlocksNav, getBlockGroups } from "@/lib/block-taxonomy"
import registry from "../../../registry.json"

// The sidebar and gallery are both derived from registry.json + the family
// declaration now, so they can't disagree with each other. What can still go
// wrong is a block falling out of one of the two hand-maintained halves: a
// registry entry with no component to render, or a category no family claims —
// the latter silently drops the block from the sidebar *and* the gallery.
const regBlocks = registry.items.filter((i) => i.type === "registry:block")

describe("registry ↔ components", () => {
  it("every registry block has a component, and vice versa", () => {
    expect(Object.keys(blockComponents).sort()).toEqual(
      regBlocks.map((b) => b.name).sort()
    )
  })

  it("every block carries exactly one category", () => {
    const bad = regBlocks
      .filter((b) => !("categories" in b) || b.categories?.length !== 1)
      .map((b) => b.name)
    expect(bad).toEqual([])
  })

  it("every block has a description", () => {
    const bad = regBlocks
      .filter((b) => (b.description ?? "").length < 10)
      .map((b) => b.name)
    expect(bad).toEqual([])
  })
})

describe("taxonomy covers every block", () => {
  it("no block is stranded in a category no family declares", () => {
    const shown = new Set(
      getBlockGroups().flatMap((g) => g.items.map((i) => i.slug))
    )
    const stranded = regBlocks
      .filter((b) => !shown.has(b.name))
      .map(
        (b) =>
          `${b.name} (category: ${("categories" in b && b.categories?.[0]) || "none"})`
      )
    expect(stranded).toEqual([])
  })

  it("announced families stay empty until they ship", () => {
    for (const family of getBlocksNav()) {
      if (!family.comingSoon) continue
      const items = (family.groups ?? []).flatMap((g) => g.items)
      expect(items, `${family.title} lists blocks but is marked comingSoon`) //
        .toEqual([])
    }
  })

  it("sidebar and gallery agree on every block", () => {
    const nav = getBlocksNav().flatMap((f) =>
      (f.groups ?? []).flatMap((g) => g.items.map((i) => i.href))
    )
    const gallery = getBlockGroups().flatMap((g) =>
      g.items.map((i) => `/blocks/${i.slug}`)
    )
    expect(nav).toEqual(gallery)
  })
})
