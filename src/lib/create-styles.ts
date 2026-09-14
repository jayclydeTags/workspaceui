// shadcn ships each visual style (base-vega, base-nova, …) as different
// component source, not different tokens. This repo's primitives are Nova, so
// the /create preview approximates the other styles with CSS that retargets
// each primitive's data-slot — keyed on the Nova class it replaces, so
// per-instance overrides a block adds are left alone. Values mirror the class
// diffs in ui.shadcn.com/r/styles/base-<style>/<component>.json.

export const STYLES = {
  vega: {
    label: "Vega",
    description: "Classic shadcn — roomier, soft shadows",
  },
  nova: { label: "Nova", description: "Compact — the WorkspaceUI default" },
  maia: { label: "Maia", description: "Soft and rounded, generous spacing" },
  lyra: { label: "Lyra", description: "Sharp corners and small type" },
  mira: { label: "Mira", description: "Dense, for data-heavy screens" },
} as const
export type StyleKey = keyof typeof STYLES
export const STYLE_KEYS = Object.keys(STYLES) as StyleKey[]

type Decls = Record<string, string>
type NonNova = Exclude<StyleKey, "nova">

export interface StyleRule {
  /** The data-slot the rule restyles. */
  slot: string
  /** Nova classes the element must carry for the rule to apply. */
  tokens?: string[]
  /** Extra selector suffix, e.g. a state guard. */
  suffix?: string
  styles: Partial<Record<NonNova, Decls>>
}

const sp = (n: number) => `${n * 0.25}rem`
// Tailwind's radius scale, relative to the theme's --radius.
const radius = (scale: number) =>
  scale === 0 ? "0" : `calc(var(--radius) * ${scale})`
const R = { sm: 0.6, md: 0.8, lg: 1, xl: 1.4, "2xl": 1.8, "4xl": 2.6 }

const TEXT_XS = { "font-size": "0.75rem", "line-height": "calc(1 / 0.75)" }
const TEXT_XS_RELAXED = { "font-size": "0.75rem", "line-height": "1.625" }
const TEXT_SM_SIZE = { "font-size": "0.875rem" }
const SHADOW_XS = { "box-shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)" }
const inputTint = (pct: number) => ({
  "background-color": `color-mix(in oklab, var(--input) ${pct}%, transparent)`,
})
const square = (n: number) => ({ width: sp(n), height: sp(n) })
// Focus rings are drawn with box-shadow, so resting shadows must not replace them.
const AT_REST = ":not(:focus-visible)"

export const STYLE_RULES: StyleRule[] = [
  // Button — shape and type on the root, then one rule per Nova size.
  {
    slot: "button",
    tokens: ["rounded-lg"],
    styles: {
      vega: { "border-radius": radius(R.md) },
      maia: { "border-radius": radius(R["4xl"]) },
      lyra: { "border-radius": "0" },
      mira: { "border-radius": radius(R.md) },
    },
  },
  {
    slot: "button",
    tokens: ["text-sm"],
    styles: { lyra: TEXT_XS, mira: TEXT_XS_RELAXED },
  },
  {
    slot: "button",
    tokens: ["h-8"],
    styles: {
      vega: { height: sp(9) },
      maia: { height: sp(9), "padding-inline": sp(3) },
      mira: { height: sp(7), "padding-inline": sp(2), ...TEXT_XS_RELAXED },
    },
  },
  {
    slot: "button",
    tokens: ["h-7"],
    styles: {
      vega: { height: sp(8) },
      maia: { height: sp(8), "padding-inline": sp(3) },
      lyra: { "border-radius": "0" },
      mira: { height: sp(6), "padding-inline": sp(2), ...TEXT_XS_RELAXED },
    },
  },
  {
    slot: "button",
    tokens: ["h-6"],
    styles: {
      lyra: { "border-radius": "0" },
      mira: { height: sp(5), "border-radius": radius(R.sm) },
    },
  },
  {
    slot: "button",
    tokens: ["h-9"],
    styles: {
      vega: { height: sp(10) },
      maia: { height: sp(10), "padding-inline": sp(4) },
      mira: { height: sp(8), ...TEXT_XS_RELAXED },
    },
  },
  {
    slot: "button",
    tokens: ["size-8"],
    styles: { vega: square(9), maia: square(9), mira: square(7) },
  },
  {
    slot: "button",
    tokens: ["size-7"],
    styles: {
      vega: square(8),
      maia: square(8),
      lyra: { "border-radius": "0" },
      mira: square(6),
    },
  },
  {
    slot: "button",
    tokens: ["size-6"],
    styles: {
      lyra: { "border-radius": "0" },
      mira: { ...square(5), "border-radius": radius(R.sm) },
    },
  },
  {
    slot: "button",
    tokens: ["size-9"],
    styles: { vega: square(10), maia: square(10), mira: square(8) },
  },

  {
    slot: "badge",
    tokens: ["rounded-4xl"],
    styles: {
      lyra: { "border-radius": "0" },
      mira: { "border-radius": "9999px" },
    },
  },

  // Form controls
  {
    slot: "input",
    styles: {
      vega: { height: sp(9), "border-radius": radius(R.md) },
      maia: {
        height: sp(9),
        "border-radius": radius(R["4xl"]),
        "padding-inline": sp(3),
        ...inputTint(30),
      },
      lyra: { "border-radius": "0", ...TEXT_XS },
      mira: {
        height: sp(7),
        "border-radius": radius(R.md),
        "padding-inline": sp(2),
        ...TEXT_SM_SIZE,
        ...inputTint(20),
      },
    },
  },
  { slot: "input", suffix: AT_REST, styles: { vega: SHADOW_XS } },
  {
    slot: "textarea",
    styles: {
      vega: { "border-radius": radius(R.md) },
      maia: {
        "border-radius": radius(R.xl),
        padding: sp(3),
        ...inputTint(30),
      },
      lyra: { "border-radius": "0", ...TEXT_XS },
      mira: {
        "border-radius": radius(R.md),
        "padding-inline": sp(2),
        ...TEXT_SM_SIZE,
        ...inputTint(20),
      },
    },
  },
  { slot: "textarea", suffix: AT_REST, styles: { vega: SHADOW_XS } },
  {
    slot: "input-group",
    styles: {
      vega: { height: sp(9), "border-radius": radius(R.md) },
      maia: {
        height: sp(9),
        "border-radius": radius(R["4xl"]),
        ...inputTint(30),
      },
      lyra: { "border-radius": "0" },
      mira: { height: sp(7), "border-radius": radius(R.md), ...inputTint(20) },
    },
  },
  {
    slot: "select-trigger",
    styles: {
      vega: { "border-radius": radius(R.md) },
      maia: {
        "border-radius": radius(R["4xl"]),
        "padding-inline": sp(3),
        ...inputTint(30),
      },
      lyra: { "border-radius": "0", ...TEXT_XS },
      mira: {
        "border-radius": radius(R.md),
        "padding-inline": sp(2),
        ...TEXT_XS_RELAXED,
        ...inputTint(20),
      },
    },
  },
  { slot: "select-trigger", suffix: AT_REST, styles: { vega: SHADOW_XS } },
  {
    slot: "checkbox",
    styles: { lyra: { "border-radius": "0" } },
  },
  { slot: "checkbox", suffix: AT_REST, styles: { vega: SHADOW_XS } },

  // Menus
  ...["select-content", "dropdown-menu-content"].map((slot): StyleRule => ({
    slot,
    styles: {
      vega: { "border-radius": radius(R.md) },
      maia: { "border-radius": radius(R["2xl"]) },
      lyra: { "border-radius": "0" },
    },
  })),
  ...["select-item", "dropdown-menu-item"].map((slot): StyleRule => ({
    slot,
    styles: {
      vega: {
        "border-radius": radius(R.sm),
        "padding-block": sp(1.5),
        gap: sp(2),
      },
      maia: {
        "border-radius": radius(R.xl),
        "padding-block": sp(2),
        gap: sp(2.5),
      },
      lyra: {
        "border-radius": "0",
        "padding-block": sp(2),
        gap: sp(2),
        ...TEXT_XS,
      },
      mira: { "min-height": sp(7), ...TEXT_XS_RELAXED },
    },
  })),

  // Surfaces
  {
    slot: "card",
    tokens: ["rounded-xl"],
    styles: {
      // Card draws its ring with box-shadow; --tw-shadow layers underneath it.
      vega: { "--tw-shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
      maia: { "border-radius": radius(R["2xl"]) },
      lyra: { "border-radius": "0", ...TEXT_XS_RELAXED },
      mira: { "border-radius": radius(R.lg), ...TEXT_XS_RELAXED },
    },
  },
  {
    slot: "card",
    suffix: ':not([data-size="sm"])',
    styles: {
      vega: { "--card-spacing": sp(6) },
      maia: { "--card-spacing": sp(6) },
    },
  },
  {
    slot: "card-title",
    styles: { lyra: TEXT_SM_SIZE, mira: TEXT_SM_SIZE },
  },
  {
    slot: "card-description",
    styles: { lyra: TEXT_XS_RELAXED, mira: TEXT_XS_RELAXED },
  },
  {
    slot: "dialog-content",
    styles: {
      maia: { "border-radius": radius(R["4xl"]) },
      lyra: { "border-radius": "0", ...TEXT_XS_RELAXED },
      mira: TEXT_XS_RELAXED,
    },
  },
  {
    slot: "alert-dialog-content",
    styles: {
      maia: { "border-radius": radius(R["4xl"]) },
      lyra: { "border-radius": "0" },
    },
  },
  ...["dialog-title", "alert-dialog-title"].map((slot): StyleRule => ({
    slot,
    styles: { lyra: TEXT_SM_SIZE, mira: TEXT_SM_SIZE },
  })),
  ...[
    "dialog-description",
    "alert-dialog-description",
    "field-description",
  ].map((slot): StyleRule => ({
    slot,
    styles: { lyra: TEXT_XS_RELAXED, mira: TEXT_XS_RELAXED },
  })),
  {
    slot: "tabs-list",
    tokens: ["rounded-lg"],
    styles: {
      vega: { "border-radius": radius(R.md) },
      maia: { "border-radius": radius(R.xl) },
      lyra: { "border-radius": "0" },
      mira: { "border-radius": radius(R.md) },
    },
  },

  // Data
  {
    slot: "table",
    tokens: ["text-sm"],
    styles: {
      lyra: { "font-size": "0.75rem" },
      mira: { "font-size": "0.75rem" },
    },
  },
  {
    slot: "table-head",
    tokens: ["h-10"],
    styles: { maia: { height: sp(12), "padding-inline": sp(3) } },
  },
  {
    slot: "table-cell",
    tokens: ["p-2"],
    styles: { maia: { padding: sp(3) } },
  },
  {
    slot: "field-group",
    tokens: ["gap-5"],
    styles: {
      vega: { gap: sp(7) },
      maia: { gap: sp(7) },
      mira: { gap: sp(4) },
    },
  },
]

export function styleSelector(rule: StyleRule) {
  const tokens = (rule.tokens ?? []).map((t) => `[class~="${t}"]`).join("")
  return `[data-slot="${rule.slot}"]${tokens}${rule.suffix ?? ""}`
}

/** Preview-only CSS that reshapes Nova primitives into `style`. Nova yields "". */
export function toStyleCss(style: StyleKey) {
  if (style === "nova") return ""
  return STYLE_RULES.flatMap((rule) => {
    const decls = rule.styles[style]
    if (!decls) return []
    const lines = Object.entries(decls).map(([k, v]) => `  ${k}: ${v};`)
    return [`${styleSelector(rule)} {\n${lines.join("\n")}\n}`]
  }).join("\n\n")
}
