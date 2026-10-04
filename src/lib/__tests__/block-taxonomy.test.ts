import { describe, expect, it } from "vitest"

import { getBlockPages, getBlocksNav } from "@/lib/block-taxonomy"

describe("getBlockPages", () => {
  const pages = getBlockPages()

  it("lists every shipped block exactly once, in sidebar order", () => {
    const fromNav = getBlocksNav()
      .filter((section) => !section.comingSoon)
      .flatMap((section) => section.groups ?? [])
      .flatMap((group) => group.items.map((item) => item.href))

    expect(pages.map((p) => p.href)).toEqual(fromNav)
    expect(new Set(fromNav).size).toBe(fromNav.length)
    expect(pages.length).toBeGreaterThan(0)
  })

  it("points each page at /blocks/<slug>", () => {
    for (const page of pages) expect(page.href).toMatch(/^\/blocks\/[\w-]+$/)
  })

  it("leaves out announced-but-empty families", () => {
    const soon = getBlocksNav()
      .filter((section) => section.comingSoon)
      .flatMap((section) => section.groups ?? [])
      .flatMap((group) => group.items)
    expect(soon).toEqual([])
  })
})
