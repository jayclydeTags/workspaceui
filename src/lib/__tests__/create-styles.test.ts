import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  STYLE_KEYS,
  STYLE_RULES,
  styleSelector,
  toStyleCss,
} from "@/lib/create-styles"

const uiDir = join(process.cwd(), "src/components/ui")
const uiSources = readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => readFileSync(join(uiDir, f), "utf8"))

// A slot is declared either as a data-slot attribute or via useRender state.
const sourcesForSlot = (slot: string) =>
  uiSources.filter(
    (src) =>
      src.includes(`data-slot="${slot}"`) || src.includes(`slot: "${slot}"`)
  )

describe("STYLE_RULES", () => {
  // Guards against the preview silently going stale when a primitive changes.
  it.each(STYLE_RULES.map((rule) => [styleSelector(rule), rule] as const))(
    "%s targets a slot and Nova classes that exist in components/ui",
    (_, rule) => {
      const sources = sourcesForSlot(rule.slot)
      expect(
        sources,
        `no ui primitive declares slot "${rule.slot}"`
      ).not.toHaveLength(0)

      for (const token of rule.tokens ?? []) {
        const present = sources.some((src) =>
          new RegExp(`["\\s]${token.replace(/[-/]/g, "\\$&")}["\\s]`).test(src)
        )
        expect(present, `slot "${rule.slot}" has no "${token}" class`).toBe(
          true
        )
      }
    }
  )

  it("never defines Nova overrides — the primitives already are Nova", () => {
    for (const rule of STYLE_RULES)
      expect(rule.styles).not.toHaveProperty("nova")
  })
})

describe("toStyleCss", () => {
  it("is empty for Nova", () => {
    expect(toStyleCss("nova")).toBe("")
  })

  it.each(STYLE_KEYS.filter((s) => s !== "nova"))(
    "emits rules for %s",
    (style) => {
      expect(toStyleCss(style)).toContain('[data-slot="button"]')
    }
  )

  it("keys rules on the Nova class they replace", () => {
    expect(toStyleCss("vega")).toContain(
      '[data-slot="button"][class~="h-8"] {\n  height: 2.25rem;\n}'
    )
  })

  it("keeps resting shadows off focused controls so focus rings survive", () => {
    expect(toStyleCss("vega")).toContain(
      '[data-slot="input"]:not(:focus-visible) {\n  box-shadow:'
    )
  })

  it("only emits a style's own declarations", () => {
    expect(toStyleCss("lyra")).not.toContain("--card-spacing")
    expect(toStyleCss("maia")).toContain("--card-spacing: 1.5rem;")
  })
})
