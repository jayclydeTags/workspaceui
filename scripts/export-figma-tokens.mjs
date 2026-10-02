// Exports the theme in src/app/globals.css as W3C design tokens for a Figma
// variables import. globals.css stays the source of truth: re-run after any
// token change.
//
//   node scripts/export-figma-tokens.mjs
//
// Writes design-tokens/{theme,light,dark}.tokens.json.
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const CSS = path.join(ROOT, "src/app/globals.css")
const OUT = path.join(ROOT, "design-tokens")

// Status colors are one --token each in CSS; Tailwind derives surface, border
// and ring with opacity modifiers (bg-info/10, border-info/30, ...). Figma has
// no derivation, so each derived step is materialized as the same hue at a
// fixed alpha under status/. The base color stays in color/ under its CSS name
// (one variable per decision). Alphas mirror how components/ui uses
// `destructive`, the reference.
const STATUS = ["destructive", "success", "warning", "info"]
const LADDER = {
  // name: [light alpha, dark alpha]
  surface: [0.1, 0.2], // bg-<s>/10 dark:bg-<s>/20
  "surface-hover": [0.2, 0.3], // hover:bg-<s>/20 dark:hover:bg-<s>/30
  border: [0.3, 0.3], // border-<s>/30
  ring: [0.2, 0.4], // ring-<s>/20 dark:ring-<s>/40
}
// Only destructive validates form controls or is ever a solid fill.
const EXTRA = {
  destructive: {
    "ink-secondary": [0.9, 0.9], // Alert description: text-destructive/90
    "border-invalid": [1, 0.5], // aria-invalid:border-destructive dark:/50
  },
}

const css = fs.readFileSync(CSS, "utf8")

function block(selector) {
  const start = css.indexOf(selector)
  if (start < 0) throw new Error(`${selector} not found in globals.css`)
  const open = css.indexOf("{", start)
  const close = css.indexOf("\n}", open)
  const vars = {}
  for (const line of css.slice(open + 1, close).split("\n")) {
    const m = line.match(/^\s*--([a-z0-9-]+):\s*(.+?);\s*$/i)
    if (m) vars[m[1]] = m[2]
  }
  return vars
}

const light = block(":root {")
const dark = block(".dark {")

function parseOklch(value) {
  const m = value.match(/^oklch\(\s*([^)]*)\)$/)
  if (!m) return null
  const [color, alphaRaw] = m[1].split("/").map((s) => s?.trim())
  const [L, C, H = 0] = color.split(/\s+/).map(Number)
  let a = 1
  if (alphaRaw) {
    a = alphaRaw.endsWith("%")
      ? parseFloat(alphaRaw) / 100
      : parseFloat(alphaRaw)
  }
  return { L, C, H, a }
}

// OKLCH -> sRGB (Ottosson). Out-of-gamut channels are clamped, since Figma
// variables are sRGB; `clipped` flags where Figma can't match the browser.
function toSrgb({ L, C, H }) {
  const h = (H * Math.PI) / 180
  const A = C * Math.cos(h)
  const B = C * Math.sin(h)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  const clipped = lin.some((c) => c < -1e-4 || c > 1.0001)
  const rgb = lin.map((c) => {
    const x = Math.max(0, Math.min(1, c))
    const e = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
    return Math.round(e * 255)
  })
  return { rgb, clipped }
}

const byte = (n) => n.toString(16).padStart(2, "0").toUpperCase()
function hex({ rgb }, alpha) {
  const base = "#" + rgb.map(byte).join("")
  return alpha >= 1 ? base : base + byte(Math.round(alpha * 255))
}

function resolve(value) {
  const o = parseOklch(value)
  if (!o) return null
  const srgb = toSrgb(o)
  return { srgb, alpha: o.a, hex: hex(srgb, o.a), clipped: srgb.clipped }
}

const colorToken = (lightHex, darkHex, description) => ({
  $type: "color",
  $value: lightHex,
  ...(description && { $description: description }),
  $extensions: { mode: { light: lightHex, dark: darkHex } },
})

const theme = { color: {}, status: {}, radius: {} }
const clippedNames = []

for (const name of Object.keys(light)) {
  if (name === "radius") continue
  const lv = resolve(light[name])
  const dv = resolve(dark[name] ?? light[name])
  if (!lv || !dv) continue
  const clipped = lv.clipped || dv.clipped
  if (clipped) clippedNames.push(name)
  theme.color[name] = colorToken(
    lv.hex,
    dv.hex,
    clipped
      ? "Outside sRGB: clamped, renders less saturated than the CSS value."
      : undefined
  )
}

for (const s of STATUS) {
  const lv = resolve(light[s])
  const dv = resolve(dark[s])
  if (!lv || !dv) throw new Error(`--${s} missing from :root or .dark`)
  const steps = { ...LADDER, ...EXTRA[s] }
  for (const [step, [la, da]] of Object.entries(steps)) {
    theme.status[`${s}-${step}`] = colorToken(
      hex(lv.srgb, la),
      hex(dv.srgb, da)
    )
  }
}

// --radius is rem; Figma wants px. Derived steps mirror @theme inline.
const radiusPx = parseFloat(light.radius) * 16
const SCALE = {
  sm: 0.6,
  md: 0.8,
  lg: 1,
  xl: 1.4,
  "2xl": 1.8,
  "3xl": 2.2,
  "4xl": 2.6,
}
for (const [k, f] of Object.entries(SCALE)) {
  theme.radius[k] = {
    $type: "dimension",
    $value: `${+(radiusPx * f).toFixed(2)}px`,
  }
}

// One mode per file, for importers that take a single mode at a time.
function flatten(tree, mode) {
  const out = {}
  for (const [group, tokens] of Object.entries(tree)) {
    out[group] = {}
    for (const [name, t] of Object.entries(tokens)) {
      const { $extensions, ...rest } = t
      out[group][name] = {
        ...rest,
        $value: $extensions?.mode?.[mode] ?? t.$value,
      }
    }
  }
  return out
}

fs.mkdirSync(OUT, { recursive: true })
const write = (file, data) =>
  fs.writeFileSync(path.join(OUT, file), JSON.stringify(data, null, 2) + "\n")
write("theme.tokens.json", theme)
write("light.tokens.json", flatten(theme, "light"))
write("dark.tokens.json", flatten(theme, "dark"))

const n = (g) => Object.keys(theme[g]).length
console.log(
  `color ${n("color")} · status ${n("status")} · radius ${n("radius")}`
)
console.log(`clipped to sRGB: ${clippedNames.join(", ") || "none"}`)
