import { describe, expect, it } from "vitest"

import { templates, templateUrl, templateZipPath } from "@/lib/templates"

// The detail URL and zip path are derived from the slug in one place so the
// nav link, the gallery, and the search index can't drift apart. Guard the
// derivation and that every real manifest slug produces a valid detail path.
describe("template url helpers", () => {
  it("derives the detail page and zip paths from a slug", () => {
    expect(templateUrl("starter-stub")).toBe("/templates/starter-stub")
    expect(templateZipPath("starter-stub")).toBe("/templates/starter-stub.zip")
  })

  it("maps every template to its detail route", () => {
    expect(templates.length).toBeGreaterThan(0)
    for (const t of templates) {
      expect(templateUrl(t.slug)).toBe(`/templates/${t.slug}`)
    }
  })
})
