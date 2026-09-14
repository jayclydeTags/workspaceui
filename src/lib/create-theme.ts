import { accentScales, baseColors } from "@/lib/create-theme-data"

export type BaseColor = keyof typeof baseColors
export type AccentColor = keyof typeof accentScales
/** "base" keeps the base color's own neutral primary / chart ramp. */
export type ThemeAccent = "base" | AccentColor

export const BASE_COLORS = Object.keys(baseColors) as BaseColor[]
export const ACCENT_COLORS = Object.keys(accentScales) as AccentColor[]

export const RADII = [0, 0.3, 0.5, 0.625, 0.75, 1] as const
export type Radius = (typeof RADII)[number]

/** `import` is the next/font/google export name. */
export const FONTS = {
  geist: { label: "Geist", import: "Geist", fallback: "sans-serif" },
  inter: { label: "Inter", import: "Inter", fallback: "sans-serif" },
  figtree: { label: "Figtree", import: "Figtree", fallback: "sans-serif" },
  manrope: { label: "Manrope", import: "Manrope", fallback: "sans-serif" },
  "dm-sans": { label: "DM Sans", import: "DM_Sans", fallback: "sans-serif" },
  outfit: { label: "Outfit", import: "Outfit", fallback: "sans-serif" },
  lora: { label: "Lora", import: "Lora", fallback: "serif" },
  "playfair-display": {
    label: "Playfair Display",
    import: "Playfair_Display",
    fallback: "serif",
  },
} as const
export type FontKey = keyof typeof FONTS
export const FONT_KEYS = Object.keys(FONTS) as FontKey[]

export interface ThemeConfig {
  base: BaseColor
  accent: ThemeAccent
  chart: ThemeAccent
  radius: Radius
  heading: FontKey
  body: FontKey
}

/** Matches the site's own globals.css, so an untouched creator exports today's theme. */
export const DEFAULT_THEME: ThemeConfig = {
  base: "neutral",
  accent: "base",
  chart: "base",
  radius: 0.625,
  heading: "geist",
  body: "geist",
}

export interface ThemeCssVars {
  theme: Record<string, string>
  light: Record<string, string>
  dark: Record<string, string>
}

/**
 * CSS custom property a font is exposed on. next/font hashes font-family
 * names, so themes reference this variable rather than the family name.
 */
export const fontVariable = (key: FontKey) => `--font-${key}`

const ON_LIGHT = "oklch(0.985 0 0)"
const ON_DARK = "oklch(0.205 0 0)"

// Pick a readable foreground from the fill's OKLCH lightness — yellow/lime/amber/
// orange fills are light enough to need dark text, the rest take near-white.
function foregroundFor(fill: string) {
  const lightness = Number(/oklch\(([\d.]+)/.exec(fill)?.[1] ?? 0)
  return lightness > 0.64 ? ON_DARK : ON_LIGHT
}

function applyPrimary(
  vars: Record<string, string>,
  fill: string,
  ring: string
) {
  const fg = foregroundFor(fill)
  vars.primary = fill
  vars["primary-foreground"] = fg
  vars["sidebar-primary"] = fill
  vars["sidebar-primary-foreground"] = fg
  vars.ring = ring
  vars["sidebar-ring"] = ring
}

// Status tokens aren't part of shadcn's base colors but WorkspaceUI components use them.
const STATUS = {
  light: {
    success: "oklch(0.596 0.145 163.225)",
    warning: "oklch(0.769 0.188 70.08)",
  },
  dark: {
    success: "oklch(0.765 0.177 163.223)",
    warning: "oklch(0.769 0.188 70.08)",
  },
}

export function buildCssVars(config: ThemeConfig): ThemeCssVars {
  const base = baseColors[config.base]
  const light: Record<string, string> = { ...base.light, ...STATUS.light }
  const dark: Record<string, string> = { ...base.dark, ...STATUS.dark }

  light.radius = `${config.radius}rem`

  if (config.accent !== "base") {
    const scale = accentScales[config.accent]
    applyPrimary(light, scale["600"], scale["400"])
    applyPrimary(dark, scale["500"], scale["700"])
  }

  if (config.chart !== "base") {
    const scale = accentScales[config.chart]
    const ramp = [
      scale["300"],
      scale["500"],
      scale["600"],
      scale["700"],
      scale["800"],
    ]
    ramp.forEach((value, i) => {
      light[`chart-${i + 1}`] = value
      dark[`chart-${i + 1}`] = value
    })
  }

  const fontStack = (key: FontKey) =>
    `var(${fontVariable(key)}), ${FONTS[key].fallback}`

  return {
    theme: {
      "font-sans": fontStack(config.body),
      "font-heading": fontStack(config.heading),
    },
    light,
    dark,
  }
}

function block(selector: string, vars: Record<string, string>) {
  const lines = Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`)
  return `${selector} {\n${lines.join("\n")}\n}`
}

export function toCss(config: ThemeConfig) {
  const vars = buildCssVars(config)
  return [
    block("@theme inline", vars.theme),
    block(":root", vars.light),
    block(".dark", vars.dark),
  ].join("\n\n")
}

// Live preview CSS. Selectors carry extra specificity so they win over
// globals.css regardless of stylesheet order, and the heading rule targets the
// utility directly because `@theme inline` bakes `font-heading` in at build time.
export function toPreviewCss(config: ThemeConfig) {
  const vars = buildCssVars(config)
  return [
    block("html:root", {
      ...vars.light,
      "font-sans": vars.theme["font-sans"]!,
    }),
    block("html:root.dark", vars.dark),
    `.font-heading {\n  font-family: ${vars.theme["font-heading"]};\n}`,
  ].join("\n\n")
}

export function toRegistryItem(config: ThemeConfig) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "workspaceui-theme",
    type: "registry:theme",
    cssVars: buildCssVars(config),
  }
}

const camelCase = (key: string) =>
  key.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())

/** next/font setup that defines the variables the theme's font stacks read. */
export function fontSnippet(config: ThemeConfig) {
  const keys = [...new Set([config.body, config.heading])]
  const imports = keys.map((k) => FONTS[k].import).join(", ")
  const declarations = keys.map(
    (k) =>
      `const ${camelCase(k)} = ${FONTS[k].import}({\n  subsets: ["latin"],\n  variable: "${fontVariable(k)}",\n})`
  )
  const className = keys.map((k) => `\${${camelCase(k)}.variable}`).join(" ")

  return [
    `import { ${imports} } from "next/font/google"`,
    ...declarations,
    `// Then add the variables to <html>:\n// <html className={\`${className}\`}>`,
  ].join("\n\n")
}

const isOneOf = <T extends string | number>(
  list: readonly T[],
  value: unknown
): value is T => list.includes(value as T)

const ACCENT_OPTIONS: ThemeAccent[] = ["base", ...ACCENT_COLORS]

/** Reads a theme from URL params, falling back per-field on anything unknown. */
export function parseThemeParams(params: URLSearchParams): ThemeConfig {
  const pick = <T extends string>(
    key: keyof ThemeConfig,
    list: readonly T[]
  ) =>
    isOneOf(list, params.get(key))
      ? (params.get(key) as T)
      : (DEFAULT_THEME[key] as T)
  const radius = Number(params.get("radius"))

  return {
    base: pick("base", BASE_COLORS),
    accent: pick("accent", ACCENT_OPTIONS),
    chart: pick("chart", ACCENT_OPTIONS),
    radius:
      params.has("radius") && isOneOf(RADII, radius)
        ? radius
        : DEFAULT_THEME.radius,
    heading: pick("heading", FONT_KEYS),
    body: pick("body", FONT_KEYS),
  }
}

/** Serializes only the fields that differ from the default, for short shareable URLs. */
export function themeToParams(config: ThemeConfig) {
  const params = new URLSearchParams()
  for (const key of Object.keys(DEFAULT_THEME) as (keyof ThemeConfig)[]) {
    if (config[key] !== DEFAULT_THEME[key]) params.set(key, String(config[key]))
  }
  return params
}
