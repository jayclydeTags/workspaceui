import { describe, expect, it } from "vitest"

import { getApiReference, parseApiReference } from "@/lib/api-reference"

describe("parseApiReference", () => {
  it("returns nothing when there is no API Reference section", () => {
    expect(parseApiReference("## Usage\n\ntext")).toEqual([])
  })

  it("reads headings, paragraphs and tables, and stops at the next section", () => {
    const blocks = parseApiReference(
      [
        "## Usage",
        "ignored",
        "## API Reference",
        "",
        "Extends `Card`,",
        "minus children.",
        "",
        "### Thing",
        "",
        "| Prop | Type | Default | Description |",
        "| ---- | ---- | ------- | ----------- |",
        "| `a`  | `string \\| number` | -  | The a. |",
        "| `b`  | `boolean` | `false` | The b. |",
        "",
        "## Troubleshooting",
        "not included",
      ].join("\n")
    )
    expect(blocks).toEqual([
      { type: "text", text: "Extends `Card`, minus children." },
      { type: "heading", text: "Thing" },
      {
        type: "table",
        columns: ["Prop", "Type", "Default", "Description"],
        rows: [
          ["`a`", "`string | number`", "-", "The a."],
          ["`b`", "`boolean`", "`false`", "The b."],
        ],
      },
    ])
  })

  it("skips fenced code and keeps list items together", () => {
    const blocks = parseApiReference(
      [
        "## API Reference",
        "```tsx",
        "| not | a table |",
        "```",
        "- one",
        "  continued",
        "- two",
      ].join("\n")
    )
    expect(blocks).toEqual([{ type: "list", items: ["one continued", "two"] }])
  })
})

describe("getApiReference", () => {
  it("parses a real component's prop table", () => {
    const table = getApiReference("metric-card").find((b) => b.type === "table")
    expect(table).toBeDefined()
    if (table?.type !== "table") return
    expect(table.columns).toEqual(["Prop", "Type", "Default", "Description"])
    expect(table.rows.map((r) => r[0])).toContain("`invertDelta`")
  })

  it("keeps each sub-table of a multi-part API under its heading", () => {
    const headings = getApiReference("workspace")
      .filter((b) => b.type === "heading")
      .map((b) => b.text)
    expect(headings).toContain("WorkspacePaneDef")
    expect(headings).toContain("useWorkspace()")
  })
})
