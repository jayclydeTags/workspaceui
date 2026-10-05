import { describe, expect, it } from "vitest"

import { getComponentExamples } from "@/lib/component-examples"

describe("getComponentExamples", () => {
  it("labels the page-level preview Overview", () => {
    expect(getComponentExamples("status-badge")).toEqual([
      { name: "status-badge", label: "Overview" },
    ])
  })

  it("labels each example by the heading above it, in document order", () => {
    const examples = getComponentExamples("metric-card")
    expect(examples).toEqual([
      { name: "metric-card", label: "Overview" },
      { name: "metric-card-loading", label: "Loading" },
    ])
  })

  it("returns every preview for a component with many examples", () => {
    const names = getComponentExamples("page").map((e) => e.name)
    expect(names[0]).toBe("page")
    expect(names).toContain("page-with-breadcrumbs")
    expect(new Set(names).size).toBe(names.length)
  })
})
