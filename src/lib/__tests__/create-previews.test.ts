import { describe, expect, it } from "vitest"

import registry from "../../../registry.json"
import { CREATE_PREVIEWS } from "@/lib/create-previews"

describe("CREATE_PREVIEWS", () => {
  it("only lists blocks that exist in registry.json", () => {
    const blocks = new Set(
      registry.items
        .filter((item) => item.type === "registry:block")
        .map((item) => item.name)
    )

    for (const { slug } of CREATE_PREVIEWS) expect(blocks).toContain(slug)
  })

  it("has unique slugs", () => {
    const slugs = CREATE_PREVIEWS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
