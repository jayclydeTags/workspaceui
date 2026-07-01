import { describe, expect, it } from "vitest"

import { buildSearchIndexEntries, buildSearchIndexPayload } from "@/lib/search"

describe("buildSearchIndexEntries", () => {
  it("builds searchable entries from docs frontmatter", async () => {
    const entries = await buildSearchIndexEntries()

    expect(entries.some((entry) => entry.title === "Introduction" && entry.url === "/docs/getting-started/introduction")).toBe(true)
    expect(entries.some((entry) => entry.title === "Workspace Tabs" && entry.url === "/docs/components/workspace-tabs")).toBe(true)
  })
})

describe("buildSearchIndexPayload", () => {
  it("creates an Orama-compatible payload for the static client", async () => {
    const payload = await buildSearchIndexPayload()

    expect(payload.type).toBe("advanced")
    expect(payload).toHaveProperty("index")
    expect(payload).toHaveProperty("docs")
  })
})
