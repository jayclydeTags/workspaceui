---
name: WorkspaceUI
description: >-
  Workspace-style application components (tabs, resizable panes, data grid,
  blocks) distributed through a shadcn registry. Neutral, dense, theme-driven.
style: shadcn/ui base-nova (Base UI primitives)
colors:
  # Light values. Dark values are listed under "Colors". Source of truth is
  # src/app/globals.css; design-tokens/*.json are generated from it.
  background: "#FFFFFF"
  foreground: "#0A0A0A"
  card: "#FFFFFF"
  card-foreground: "#0A0A0A"
  popover: "#FFFFFF"
  popover-foreground: "#0A0A0A"
  primary: "#171717"
  primary-foreground: "#FAFAFA"
  secondary: "#F5F5F5"
  secondary-foreground: "#171717"
  muted: "#F5F5F5"
  muted-foreground: "#737373"
  accent: "#F5F5F5"
  accent-foreground: "#171717"
  destructive: "#E7000B"
  success: "#009966"
  info: "#2378C2"
  warning: "#FE9A00"
  border: "#E5E5E5"
  input: "#E5E5E5"
  ring: "#A1A1A1"
typography:
  sans: { fontFamily: "Geist Variable", fallback: sans-serif }
  mono: { fontFamily: "Geist Mono Variable", fallback: monospace }
  ui: { fontSize: 14px, fontWeight: 500 }
  body: { fontSize: 14px, lineHeight: 1.75 }
rounded:
  base: 0.625rem # --radius; every other radius is derived from it
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 18px
  3xl: 22px
  4xl: 26px
spacing:
  unit: 4px # Tailwind default scale
components:
  button:
    {
      height: 32px,
      radius: lg,
      variants: [default, outline, secondary, ghost, destructive, link],
    }
  badge: { variants: [default, secondary, destructive, outline, ghost, link] }
  alert: { variants: [default, destructive, info] }
---

# WorkspaceUI design system

WorkspaceUI follows [shadcn/ui](https://ui.shadcn.com) conventions end to end:
the `base-nova` style on Base UI primitives, semantic CSS-variable tokens,
Tailwind v4, and composition through the shadcn component set. Anything here
that is not specific to this repo defers to the shadcn docs.

Distributed components (`src/registry/bases/base/workspaceui/`) ship as-is via
`npx shadcn add`. They must therefore look right under **any consumer's
theme**: use semantic tokens only, never hard-coded colors.

## Overview

A neutral, quiet, information-dense interface for workspace tooling: panes,
tabs, tables, and forms. Color is reserved for state. Chrome stays grayscale
so the consumer's brand colors (via `--primary`) carry the identity.

- Density over decoration: 14px UI text, 32px default controls.
- Borders and surface shifts separate regions; shadows are rare.
- Light and dark are first-class. Every component works in both with no
  `dark:` color overrides in app code.

## Colors

All colors are CSS variables in `src/app/globals.css` (`:root` and `.dark`),
declared in `oklch`, bridged to Tailwind through `@theme inline`. Use them as
Tailwind utilities: `bg-background`, `text-muted-foreground`, `border-border`.

| Token                            | Light                 | Dark                  | Use                               |
| -------------------------------- | --------------------- | --------------------- | --------------------------------- |
| `background` / `foreground`      | `#FFFFFF` / `#0A0A0A` | `#0A0A0A` / `#FAFAFA` | Page surface and default text     |
| `card`, `popover`                | `#FFFFFF`             | `#171717`             | Raised surfaces                   |
| `primary` / `primary-foreground` | `#171717` / `#FAFAFA` | `#E5E5E5` / `#171717` | Main action, selected state       |
| `secondary`, `muted`, `accent`   | `#F5F5F5`             | `#262626`             | Quiet fills, hover, selected rows |
| `muted-foreground`               | `#737373`             | `#A1A1A1`             | Secondary text, placeholders      |
| `border`                         | `#E5E5E5`             | `#FFFFFF1A`           | Dividers, outlines                |
| `input`                          | `#E5E5E5`             | `#FFFFFF26`           | Form control borders              |
| `ring`                           | `#A1A1A1`             | `#737373`             | Focus ring                        |
| `sidebar*`                       | see CSS               | see CSS               | Sidebar surface, accent, border   |
| `chart-1` … `chart-5`            | neutral ramp          | neutral ramp          | Data series                       |

### Status colors

Four status tokens carry meaning: `destructive`, `success`, `warning`, `info`.
Each is one base token; surfaces derive from it with opacity modifiers, the
way `destructive` is used throughout `components/ui`:

| Step    | Light             | Dark                   |
| ------- | ----------------- | ---------------------- |
| Surface | `bg-<s>/10`       | `dark:bg-<s>/20`       |
| Hover   | `hover:bg-<s>/20` | `dark:hover:bg-<s>/30` |
| Border  | `border-<s>/30`   | same                   |
| Ring    | `ring-<s>/20`     | `dark:ring-<s>/40`     |

Rules:

- **Never signal state by color alone.** Pair status color with an icon or
  text (Badge label, Alert title, field error message).
- No raw palette colors (`text-green-500`, `bg-red-100`) for status. Use
  `success` / `warning` / `info` / `destructive`, or a Badge variant.
- Adding a color means adding a CSS variable to `:root` and `.dark`, mapping
  it in `@theme inline`, and re-running `node scripts/export-figma-tokens.mjs`.
  If a distributed component or block uses it, also declare it in the
  `status-colors` item's `cssVars` in `registry.json` (and depend on that
  item) so consumers' themes get the variable on install.

## Typography

- **Sans**: Geist Variable (`--font-sans`). **Mono**: Geist Mono Variable
  (`--font-mono`) for code, IDs, and keyboard hints.
- UI text is `text-sm` (14px) at `font-medium` for controls and labels;
  `text-xs` for dense metadata and compact controls.
- Long-form docs use shadcn/typeset (`src/app/typeset.css`) via
  `.typeset-docs`: 14px body, 1.75 line height. There is no Tailwind
  Typography plugin.
- Numbers that users compare (counts, amounts, sizes, usage) use
  `tabular-nums`.

## Layout & spacing

- Tailwind's 4px scale. Layout spacing is `gap-*`; **never** `space-x-*` /
  `space-y-*`.
- Use `size-*` when width equals height (`size-8`, not `w-8 h-8`).
- Forms are `FieldGroup` + `Field`; related fields group in
  `FieldSet` + `FieldLegend`.
- Workspace panes are resizable columns with minimums (`20%` column, `30%`
  row) so no pane can be dragged to nothing.
- No inline `style` for design values. A runtime value (a computed width, a
  drag offset) goes through a CSS custom property that a utility reads:
  `<div className="w-(--progress)" style={{ "--progress": `${pct}%` }} />`.
  Only `transform` and `transition` stay inline, since dnd-kit and drag
  offsets produce them every frame.
- Truncate with the `truncate` utility, and give truncated text a way to be
  read in full (tooltip or title).

## Shapes

One knob: `--radius` (`0.625rem`). Every step (`sm` → `4xl`) is a multiple of
it, so changing the single variable reshapes the whole system.

- Controls (button, input, select trigger) use `rounded-lg`.
- Compact controls (`xs`, `sm`) use `min(var(--radius-md), 10–12px)`.
- Nested radii never exceed their parent's. A child inside a `rounded-lg`
  card is `rounded-md` or smaller.

## Elevation

Flat by default. Hierarchy comes from `card` vs `background` fills and
`border`. Overlays (Dialog, Sheet, Drawer, Popover, Dropdown, Tooltip) manage
their own stacking: **never set `z-index` on them**.

## Components

### Source of truth

- `src/components/ui/` — shadcn primitives. Owned by the shadcn CLI and
  overwritten on re-install; don't hand-edit for one-off needs.
- `src/registry/bases/base/workspaceui/` — distributed WorkspaceUI components,
  built from those primitives.
- `src/registry/bases/base/blocks/` — distributed blocks, composed from the
  two layers above.
- `src/components/site/` and `src/components/docs/` — this site's own chrome.
  Not distributed.

### Variants first

Reach for, in order: (1) built-in `variant` / `size`, (2) semantic tokens,
(3) a new CSS variable. `className` is for **layout only** (`mx-auto`,
`max-w-md`, `mt-4`), not for recoloring a component.

| Component | Variants                                              | Sizes                                                                |
| --------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `Button`  | default, outline, secondary, ghost, destructive, link | xs (24px), sm (28px), default (32px), lg (36px), icon, icon-xs/sm/lg |
| `Badge`   | default, secondary, destructive, outline, ghost, link | —                                                                    |
| `Alert`   | default, destructive, info                            | —                                                                    |

### Composition

- Items live inside their group: `SelectItem` in `SelectGroup`,
  `DropdownMenuItem` in `DropdownMenuGroup`, `CommandItem` in `CommandGroup`.
- `Dialog`, `Sheet`, `Drawer`, and `AlertDialog` always have a Title (visually
  hidden if the design has none).
- Callouts → `Alert`. Empty states → `Empty`. Loading → `Skeleton` that
  mirrors the final layout. Dividers → `Separator`. Status chips → `Badge`.
- `TabsTrigger` is always inside `TabsList`; `Avatar` always has an
  `AvatarFallback`.
- Buttons have no `isLoading` prop: compose `Spinner` and set `disabled`.
- Cards use the full structure: `CardHeader` / `CardTitle` /
  `CardDescription` / `CardContent` / `CardFooter`.

### Icons

Icon library is **Hugeicons** (`@hugeicons/react` +
`@hugeicons/core-free-icons`, per `components.json`). Never import
`lucide-react`.

- In a `Button`, mark position with `data-icon="inline-start"` /
  `"inline-end"`.
- Don't size icons inside shadcn components; the component sets the size.
- Pass icons as component references (`icon={CheckIcon}`), not string keys.

### Forms

- Every control has a real `<label>`; clicking it focuses the control.
- Set `type`, `inputmode`, and `autocomplete`. Inputs are ≥16px on mobile so
  iOS doesn't zoom.
- Don't pre-disable submit or block paste. Validate on submit, show the error
  next to the field, and focus the first invalid one.
- Invalid state uses `aria-invalid` (built into the primitives), which drives
  the destructive border and ring.

## Interaction & accessibility

- Everything is keyboard-operable. Focus is shown with the shared
  `focus-visible` ring (`ring-3 ring-ring/50`); sticky and overlay elements
  must never cover it.
- Hit targets are ≥24px, ≥44px on touch. The `xs` button (24px) is the floor;
  extend its hit area on touch surfaces.
- Navigation is `<a>` / `<Link>`, never a `div` or `button`. Icon-only controls
  carry an `aria-label`.
- Hover- or gesture-only affordances (drag, hover actions) always have a
  keyboard and tap path. Dragging a tab has the split/move menu; closing a tab
  has `Delete`.
- Interaction states raise contrast against the rest state: `hover`,
  `active`, and `focus` are never subtler than rest.
- Every view designs its **empty, loading, error, and dense** states, not just
  the happy path. Images carry explicit dimensions; layout shift is a bug.

## Motion

- Animate `transform` and `opacity` only. Never `transition: all`.
- Honor `prefers-reduced-motion`.
- Pressed controls nudge `translate-y-px`; overlays use the `tw-animate-css`
  enter/exit utilities that the primitives already include.
- Layout changes that move no focus (re-docking a pane) are announced through
  an `aria-live` region.

## Do / Don't

| Do                                            | Don't                                            |
| --------------------------------------------- | ------------------------------------------------ |
| `bg-primary text-primary-foreground`          | `bg-blue-500 text-white`                         |
| `text-muted-foreground`                       | `text-gray-600`                                  |
| `<Button variant="outline">`                  | `<Button className="border bg-transparent …">`   |
| `flex flex-col gap-4`                         | `space-y-4`                                      |
| `size-8`                                      | `w-8 h-8`                                        |
| `bg-background text-foreground`               | `bg-white dark:bg-gray-950`                      |
| `cn("base", cond && "x")`                     | Template-string class ternaries                  |
| `<Badge>Active</Badge>`                       | `<span className="text-green-500">Active</span>` |
| Semantic token + icon/text for status         | Color-only status                                |
| Overlay components with their built-in layers | `z-50` / `z-[999]` on overlays                   |

## Changing the system

1. Edit tokens in `src/app/globals.css` (`:root`, `.dark`, `@theme inline`).
2. Run `node scripts/export-figma-tokens.mjs` to refresh
   `design-tokens/*.tokens.json` for Figma.
3. Update the tables above if a token's role or value changed.
4. Add or change a component: follow the testing, registry, and docs steps in
   `CLAUDE.md` and `.claude/rules/`.
