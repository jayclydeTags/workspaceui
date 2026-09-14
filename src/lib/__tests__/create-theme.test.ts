import { describe, expect, it } from "vitest"

import { accentScales, baseColors } from "@/lib/create-theme-data"
import {
  DEFAULT_THEME,
  buildCssVars,
  fontSnippet,
  parseThemeParams,
  themeToParams,
  toCss,
  toPreviewCss,
  toRegistryItem,
  type ThemeConfig,
} from "@/lib/create-theme"

const theme = (overrides: Partial<ThemeConfig>): ThemeConfig => ({
  ...DEFAULT_THEME,
  ...overrides,
})

describe("buildCssVars", () => {
  it("keeps the base color's own palette when accent and chart are 'base'", () => {
    const vars = buildCssVars(theme({ base: "stone" }))

    expect(vars.light.primary).toBe(baseColors.stone.light.primary)
    expect(vars.dark.background).toBe(baseColors.stone.dark.background)
    expect(vars.light["chart-1"]).toBe(baseColors.stone.light["chart-1"])
  })

  it("sets the radius on :root only", () => {
    const vars = buildCssVars(theme({ radius: 0.3 }))

    expect(vars.light.radius).toBe("0.3rem")
    expect(vars.dark.radius).toBeUndefined()
  })

  it("maps an accent onto primary, sidebar-primary and ring in both modes", () => {
    const vars = buildCssVars(theme({ accent: "blue" }))

    expect(vars.light.primary).toBe(accentScales.blue["600"])
    expect(vars.light["sidebar-primary"]).toBe(accentScales.blue["600"])
    expect(vars.light.ring).toBe(accentScales.blue["400"])
    expect(vars.dark.primary).toBe(accentScales.blue["500"])
    // Surfaces still come from the base color.
    expect(vars.light.background).toBe(baseColors.neutral.light.background)
  })

  it("gives light accent fills dark foreground text and dark fills light text", () => {
    const fg = (accent: ThemeConfig["accent"]) =>
      buildCssVars(theme({ accent })).light["primary-foreground"]

    expect(fg("yellow")).toBe("oklch(0.205 0 0)")
    expect(fg("blue")).toBe("oklch(0.985 0 0)")
  })

  it("replaces the chart ramp independently of the accent", () => {
    const vars = buildCssVars(theme({ chart: "emerald" }))

    expect(vars.light["chart-1"]).toBe(accentScales.emerald["300"])
    expect(vars.dark["chart-5"]).toBe(accentScales.emerald["800"])
    expect(vars.light.primary).toBe(baseColors.neutral.light.primary)
  })

  it("points font stacks at next/font variables in the theme scope", () => {
    const vars = buildCssVars(theme({ heading: "lora", body: "inter" }))

    expect(vars.theme).toEqual({
      "font-sans": "var(--font-inter), sans-serif",
      "font-heading": "var(--font-lora), serif",
    })
  })
})

describe("toCss", () => {
  it("emits @theme inline, :root and .dark blocks", () => {
    const css = toCss(theme({ accent: "violet" }))

    expect(css).toContain("@theme inline {\n  --font-sans:")
    expect(css).toContain(`:root {`)
    expect(css).toContain(`  --primary: ${accentScales.violet["600"]};`)
    expect(css).toContain(`.dark {`)
  })
})

describe("toPreviewCss", () => {
  it("overrides the body font var and the font-heading utility", () => {
    const css = toPreviewCss(theme({ heading: "lora", body: "inter" }))

    expect(css).toContain("  --font-sans: var(--font-inter), sans-serif;")
    expect(css).toContain(
      ".font-heading {\n  font-family: var(--font-lora), serif;\n}"
    )
  })

  it("scopes dark vars under the .dark root", () => {
    const css = toPreviewCss(theme({ accent: "blue" }))

    expect(css).toContain(
      `html:root.dark {\n  --background: ${baseColors.neutral.dark.background};`
    )
    expect(css).toContain(`  --primary: ${accentScales.blue["500"]};`)
  })
})

describe("style in the preview", () => {
  it("adds the style overlay after the token CSS", () => {
    const css = toPreviewCss(theme({ style: "lyra" }))

    expect(css.indexOf("html:root {")).toBeLessThan(
      css.indexOf('[data-slot="button"]')
    )
  })

  it("adds nothing for Nova, and never leaks into exported CSS", () => {
    expect(toPreviewCss(DEFAULT_THEME)).not.toContain("data-slot")
    expect(toCss(theme({ style: "maia" }))).not.toContain("data-slot")
  })

  it("falls back to Nova for an unknown style param", () => {
    expect(parseThemeParams(new URLSearchParams("style=luna")).style).toBe(
      "nova"
    )
  })
})

describe("toRegistryItem", () => {
  it("is a registry:theme item carrying the css vars", () => {
    const config = theme({ accent: "rose" })
    const item = toRegistryItem(config)

    expect(item.type).toBe("registry:theme")
    expect(item.cssVars).toEqual(buildCssVars(config))
  })
})

describe("fontSnippet", () => {
  it("declares each distinct font once with its theme variable", () => {
    const snippet = fontSnippet(
      theme({ body: "dm-sans", heading: "playfair-display" })
    )

    expect(snippet).toContain(
      'import { DM_Sans, Playfair_Display } from "next/font/google"'
    )
    expect(snippet).toContain(
      'const dmSans = DM_Sans({\n  subsets: ["latin"],\n  variable: "--font-dm-sans",\n})'
    )
    expect(snippet).toContain(
      "<html className={`${dmSans.variable} ${playfairDisplay.variable}`}>"
    )
  })

  it("dedupes when heading and body share a font", () => {
    const snippet = fontSnippet(theme({ body: "inter", heading: "inter" }))

    expect(snippet.match(/Inter\(\{/g)).toHaveLength(1)
  })
})

describe("theme URL params", () => {
  it("round-trips a config", () => {
    const config = theme({
      style: "lyra",
      base: "zinc",
      accent: "teal",
      chart: "orange",
      radius: 1,
      heading: "playfair-display",
      body: "dm-sans",
    })

    expect(parseThemeParams(themeToParams(config))).toEqual(config)
  })

  it("omits fields that match the default", () => {
    expect(themeToParams(theme({ accent: "blue" })).toString()).toBe(
      "accent=blue"
    )
  })

  it("falls back per field on unknown values", () => {
    const parsed = parseThemeParams(
      new URLSearchParams("base=plaid&accent=blue&radius=9&body=comic-sans")
    )

    expect(parsed).toEqual(theme({ accent: "blue" }))
  })
})
