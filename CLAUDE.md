# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # start docs site (next dev)
pnpm build            # static export (next build → out/)
pnpm preview          # serve out/ (npx serve out)
pnpm lint             # ESLint
pnpm format           # Prettier (writes in place)
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run (single pass)
pnpm test:watch       # vitest interactive
pnpm test:coverage    # vitest run --coverage
```

### Running a single test file

```bash
pnpm vitest run src/registry/bases/base/workspaceui/__tests__/workspace-tabs.test.tsx
```

## Project structure

Next.js App Router, **static export** (`output: "export"` → `out/`). No server
runtime; matches the old React Router SPA behavior.

```
workspaceui/
├── registry.json             # shadcn registry manifest (points to src/registry/bases/base/workspaceui/)
├── next.config.ts            # createMDX() wrapper + output:"export", images.unoptimized
├── source.config.ts          # fumadocs-mdx config (docs/meta collections; mdx is read for frontmatter + API tables, never rendered)
├── postcss.config.mjs        # @tailwindcss/postcss
├── vitest.config.ts          # standalone; fumadocs() + react() plugins, jsdom
├── src/
│   ├── app/                  # App Router
│   │   ├── layout.tsx        # root: <html>/<body> + next-themes ThemeProvider + <SiteHeader/>
│   │   ├── globals.css       # Tailwind v4 + theme tokens (was src/index.css)
│   │   ├── (marketing)/      # home: page.tsx (no layout — SiteHeader is global now)
│   │   ├── components/       # layout.tsx (sidebar) + page.tsx (redirects to the first component; there is no catalog) + [slug]/page.tsx (the studio: canvas + inspector)
│   │   ├── blocks/
│   │   │   ├── (browse)/     # layout (sidebar only — SiteHeader is global), page.tsx (redirects to the first block; there is no gallery), [slug]/page.tsx (the canvas: BlockPreview)
│   │   │   └── preview/[slug]/page.tsx   # bare iframe target — escapes (browse) chrome
│   │   └── api/search/route.ts           # createSearchAPI advanced → staticGET (out/api/search)
│   ├── content/docs/         # fumadocs mdx, one file per component: frontmatter + "## API Reference" tables feed /components/<slug>
│   ├── stories/              # One file per component: playground args + hand-authored controls (see "Component studio")
│   ├── blocks/               # Copy-only blocks (e.g. navbars): in the gallery with Preview + Code, not in registry.json — manifest in lib/copy-blocks.ts
│   ├── registry/bases/base/
│   │   ├── workspaceui/      # Distributable components (source of truth) + __tests__/
│   │   ├── blocks/           # Distributable blocks — each its own folder: page.tsx, components/, data.ts
│   │   └── examples/         # Live demo components (auto-registered by components/docs/component-preview.tsx)
│   ├── components/
│   │   ├── ui/               # shadcn primitives (shadcn-owned; overwritten on re-install)
│   │   ├── studio/           # Component page UI: studio (provider + layout), canvas, inspector, api-reference, controls, toolbar (shared with blocks)
│   │   ├── site/             # app chrome shared by every route: site-header, search-dialog,
│   │   │                     #   sidebar-nav, blocks-sidebar-nav, theme-provider, theme-toggle,
│   │   │                     #   workspaceui-logo, github-icon
│   │   └── docs/             # block-preview (the /blocks canvas), component-preview (example demos),
│   │                         #   dynamic-codeblock + codeblock (shiki code blocks), copy-button
│   ├── lib/
│   │   ├── source.ts         # fumadocs loader() over .source — component page frontmatter
│   │   ├── nav.ts            # NavSection/NavItem types for the sidebars
│   │   ├── component-pages.ts    # Server-only: component pages/sidebar generated from the mdx via `source`
│   │   ├── component-examples.ts # Pure: <ComponentPreview> examples parsed from an mdx, and pageHref()
│   │   ├── story-registry.tsx    # Maps slug → story studio (dynamic import of src/stories/<slug>.tsx)
│   │   ├── blocks.ts         # /blocks preview data (slug→Component)
│   │   ├── block-files.ts    # per-block source-file manifest for the Code tab (fs-read paths)
│   │   ├── api-reference.ts  # Pure: parses an mdx's "## API Reference" section into data for the inspector
│   │   └── utils.ts          # cn() helper
│   └── test/setup.ts         # Vitest setup (ResizeObserver polyfill, pointer capture mocks)
```

### UI architecture: no fumadocs-ui

The site chrome is hand-built on **fumadocs-core** (headless: `source`,
`search/client`+`search/server`, `highlight`) and the project's own shadcn/ui
primitives (`src/components/ui/*`) — not `fumadocs-ui`'s pre-built layouts or
components, which this repo doesn't depend on at all. There is no `/docs`
section: the site is the home page, `/components` and `/blocks`.

- **`SiteHeader`** (`src/components/site/site-header.tsx`) is mounted once in the
  root layout and shared by every route — it's not per-route-group chrome.
- **Sidebars** reuse `SidebarNav` (`src/components/site/sidebar-nav.tsx`). The
  components sidebar is generated from the mdx pages by `getComponentsNav()`
  (`src/lib/component-pages.ts`), not fumadocs' `source.pageTree`; the blocks
  sidebar comes from `getBlocksNav()` (`src/lib/block-taxonomy.ts`).
- **Search** (`src/components/site/search-dialog.tsx`) is a shadcn `Command`
  dialog wired to fumadocs-core's headless `useDocsSearch` hook against the
  static `/api/search` index (component pages + blocks).
- **Code blocks**: `src/components/docs/dynamic-codeblock.tsx` reimplements
  fumadocs-ui's `DynamicCodeBlock` directly on fumadocs-core's
  `highlight/shiki/react` + the vendored `CodeBlock`/`Pre` in
  `src/components/docs/codeblock.tsx`.
- `globals.css` inlines the small pieces still needed from fumadocs' CSS
  (the `--color-fd-*` → shadcn-token bridge and the `fd-scroll-container`
  utility) since the vendored `codeblock.tsx` still references those classes.

### Component studio (`/components/<slug>`)

Component pages are a three-column layout, Storybook style:
`[sidebar] [canvas] [inspector]`. The sidebar is the route layout
(`app/components/layout.tsx`, `SidebarNav` over `getComponentsNav()`); the page
renders `Studio` (`components/studio/studio.tsx`), which owns the canvas and
inspector as one resizable pair (stacked below `lg`).

- **Canvas**: a scrollable dot-grid surface (`canvas-dots` in `globals.css`)
  with no card frame and no section labels: just the component, centered, driven
  live by the inspector's controls (props and variations). The toolbar has
  prev/next arrows (links to the neighbouring components, in sidebar order), the
  component name, width presets (they cap the stage), a reload button and a
  "Component info" toggle that hides/shows the inspector (shown by default; the
  canvas stays mounted either way).
- **Inspector**: one scrolling panel, no tabs. In order: component name,
  description, **Props** (non-style controls), **Variations** (controls marked
  `group: "style"`; they configure the one component on the canvas), **Installation** (the `shadcn add` command, with copy), and
  the **API reference** — the mdx's `## API Reference` section parsed into data
  by `lib/api-reference.ts` and laid out as one stacked entry per prop. None of
  the mdx's other content (usage, examples, install tabs) is shown on this page.
- **Stories** live in `src/stories/<slug>.tsx` and default-export
  `defineStory<Args>({ args, controls, preview })`. `preview` is a real
  component (so it may use hooks); `controls` is hand-authored
  per prop (`text`/`number`/`numbers`/`boolean`/`select`). Mark a variation
  (size, variant, a state like `disabled`) with `group: "style"` and make it a
  `select` or `boolean`.
- **No story** (currently `data-filter` and `data-grid-types`): there's no
  playground, so the mdx's `<ComponentPreview>` examples go on the canvas as
  labelled sections, and the inspector has no controls.
- Because the inspector reads the mdx, a component's `## API Reference` heading
  and markdown tables are load-bearing; keep that shape.
- Portaled UI (Select popups, dialogs) renders outside the canvas sections.
- `/components` itself is not a page: it redirects to the first component in the
  sidebar (a client-side redirect in the static export).
- Old `/docs/components/*` URLs 404 in the static export; `vercel.json`
  redirects them to `/components/*`.

### Blocks (`/blocks/<slug>`)

Same idea as the component studio, without the inspector: `[sidebar] [canvas]`.
`/blocks` redirects to the first block in the sidebar (`getBlockPages()` in
`lib/block-taxonomy.ts`, which is also what the prev/next arrows walk). The
canvas is `BlockPreview`: a toolbar shared with the component canvas
(`components/studio/toolbar.tsx` — prev/next links + tooltips), a Preview/Code
tab, width presets, fullscreen, reload and the install command, over a dot-grid
surface holding the iframe preview. The sidebar opens the group containing the
current page on landing.

### Next.js rendering notes

- **Server vs client**: pages/layouts are React Server Components by default;
  anything with hooks, state, or event handlers needs `"use client"` at the top
  (all the interactive `components/`, `examples/`, and `blocks/` are marked).
  A function prop (e.g. `renderTabContent`) can't cross a server→client boundary,
  so any component that passes one must itself be a client component.
- **Reading source at build time**: `?raw` imports are unsupported under
  Turbopack. `lib/api-reference.ts`, `lib/component-examples.ts` and
  `blocks/(browse)/[slug]/page.tsx` read mdx and registry files with `fs.readFileSync(join(process.cwd(), …))` at build instead.
- **`.source`** is generated by fumadocs-mdx (createMDX at `next build`, the
  fumadocs vite plugin at `pnpm test`) — gitignored, self-heals per tool.
- **Search**: `app/api/search/route.ts` uses `createSearchAPI("advanced")`, not
  `"simple"` — fumadocs-core 16.10.7's orama-static client mis-dispatches the
  simple index (passes the DB wrapper, not `db.db`) so simple static search
  returns nothing. Advanced merges component pages + blocks.

## Registry distribution model

Components live in `src/registry/bases/base/workspaceui/` and are distributed via `registry.json` at the repo root using the shadcn CLI's [GitHub registry shorthand](https://ui.shadcn.com/docs/registry/github) — no build step, no Vercel endpoint, no `components.json` registries config needed.

```bash
npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs
npx shadcn@latest add jayclydeTags/workspaceui/workspace
```

The repo must be public and have `registry.json` at its root; the CLI resolves items from it directly. Within `registry.json`, `registryDependencies` that point at sibling items in this same repo must use the full `jayclydeTags/workspaceui/<item>` address (not the bare name) — bare names resolve against the consumer's default `@shadcn` registry and 404. Plain shadcn primitives (`utils`, `resizable`, `sidebar`, `breadcrumb`, etc.) stay unprefixed. `src/registry/__tests__/registry.test.ts` validates both of these rules against every item automatically — see [`.claude/rules/component-testing.md`](.claude/rules/component-testing.md).

**Theme tokens outside a stock shadcn theme.** `success` and `warning` are not in a consumer's default theme, so the `status-colors` item (`registry:theme`, no files, just `cssVars`) supplies them. Any item whose shipped files use `text-`/`bg-`/`border-…-success|warning` must list `jayclydeTags/workspaceui/status-colors` in `registryDependencies` (directly or via a sibling); `registry.test.ts` fails otherwise. A new shared token follows the same pattern: add it to `globals.css`, to `status-colors`' `cssVars` (`theme` + `light` + `dark`), and extend the test's utility regex.

`bases/base/` mirrors shadcn's own multi-base registry convention (`apps/v4` on shadcn/ui). There is currently one base; don't add a second `bases/<name>/` directory speculatively.

### Comment hygiene in distributed components

Files under `src/registry/bases/base/` ship as-is via `npx shadcn add` — the
consumer only gets that one file, never the rest of this repo. Comments in
these files must only contain what a consumer needs to understand or maintain
the code they now own:

- No references to paths outside the shipped file (`docs/`, other repo files,
  issue numbers, PR links) — a consumer can't follow them and they read as
  dead pointers.
- No internal process markers (`ponytail:`, "see docs/...", changelog-style
  notes referencing "this refactor"/"now"/"previously").
- Deferred work, known limitations, and future-improvement notes belong in
  `docs/<component>-notes.md` (top-level `docs/`, not
  `src/content/docs/components/*.mdx` — those are the public fumadocs pages),
  not inline in the component.
- Keep only genuinely load-bearing invariants (a hidden constraint, a subtle
  ordering requirement, why a ref instead of state) — tightened to one line.

When adding a `ponytail:` shortcut-with-known-ceiling comment to one of these
files during development, move its explanation to `docs/<component>-notes.md`
before shipping rather than leaving it inline.

## Path aliases

| Alias | Resolves to |
| ----- | ----------- |
| `@/*` | `./src/*`   |

Components import each other via `@/components/workspaceui/...`. Docs-site components live under `@/components/site/*` (app chrome) and `@/components/docs/*` (docs/gallery rendering); shadcn primitives stay in `@/components/ui/*`.

## Component architecture

### workspace-tabs.tsx

- Props: `tabs: WorkspaceTab[]`, `activeTabId`, `onTabChange`, `onTabClose?`, `onAddTab?`, `paneId?`
- `WorkspaceTab`: `{ id, title, icon?, badge?, pinned?, dirty? }`
- Base UI `Tabs.Root/List/Tab/Panel` owns the a11y engine (roving focus, Home/End/Arrow, tab/tablist/tabpanel wiring); styling, drag, badge, and close are ours
- Drag and the keyboard split/move menu both come from `useWorkspaceDragOptional()` — the component still renders standalone when that context is absent
- Close is `Delete`/`Backspace` on the focused tab: the close affordance is a real icon `Button` (`tabIndex={-1}`) rendered as a sibling of the tab — a button can't nest inside Base UI's tab button — inside a `role="presentation"` wrapper

### workspace.tsx

- Column-based layout using `react-resizable-panels`; each column holds one top pane + optional bottom pane
- Two contexts:
  - **`WorkspaceContext`** — pane/tab state and methods (`openTabInPane`, `closeTab`, `activateTab`, `updateTab`, `openPane`, `closePane`). Access via `useWorkspace()`.
  - **`WorkspaceDragContext`** (`workspace-context.tsx`) — drag session tracking, snap zones, drop-target state, plus the keyboard equivalents (`paneTargets`, `splitTab`, `moveTab`) that the tab menu calls. Those wrap the same mutations the drop handler uses, so pointer and keyboard can't drift apart. `startDrag` takes the pointerdown event and owns pointer capture, so an Escape-cancel can release it.
- Layout changes are announced through an `aria-live` region — rearranging panes moves no focus and changes no visible text
- **`WorkspaceHandle`** ref — imperative API (same methods as context minus read-only state); attach via `ref` prop for programmatic control from outside the component
- `renderTabContent(paneId, tabId)` — called on every render for the active tab in each pane; keep it fast
- Fallback content shown when all panes are closed (configurable via `fallback` prop)
- Constants: `MIN_COL_SIZE = 20%`, `MIN_ROW_SIZE = 30%`

## Documentation

Every component in `src/registry/bases/base/workspaceui/` must have a matching page, which is an mdx file the site only partly reads:

- `src/content/docs/components/<component>.mdx` — the frontmatter (`title`, `description`) and the `## API Reference` markdown tables (one `| Prop | Type | Default | Description |` table per type) are what the page shows. The rest of the body is never rendered
- A live demo in `src/registry/bases/base/examples/<component>.tsx` (any file there is picked up automatically), referenced via `<ComponentPreview name="<component>" />` in the mdx. It only appears on the canvas for a component with no story
- The component's name added to the `pages` array in `src/content/docs/components/meta.json` (validated by `registry-docs.test.ts`). The sidebar and `/components/<slug>` route are generated from the mdx, so there is no nav entry to add
- A story in `src/stories/<component>.tsx` (see "Component studio") when the component has props worth playing with. The `## API Reference` markdown tables in the mdx are what the studio's inspector shows. `src/stories/__tests__/stories.test.tsx` checks every story: it has a docs page, each control maps to an arg, selects include their initial value, and the preview renders
- A `registry.json` entry pointing at the component file

Use `src/content/docs/components/metric-card.mdx`, `src/registry/bases/base/examples/metric-card.tsx` and `src/stories/metric-card.tsx` as the reference pattern.

## Testing

Vitest with jsdom. `src/test/setup.ts` provides:

- `ResizeObserver` stub (required by `react-resizable-panels`). Stateful: it records observed elements per observer instance, and the exported `resizeTo(el, width)` helper synchronously fires that width at every observer watching `el` — the only way to reach a container-width branch, since jsdom never resizes anything. It deliberately does _not_ fake the element's box; that's `stubLayout()`'s job (below).
- `setPointerCapture`/`releasePointerCapture`/`hasPointerCapture` mocks (required by drag handlers). Stateful, not no-ops, so capture round-trips are observable — the Escape-cancel path asserts capture is released.

jsdom has no layout: every element reports a 0×0 box at (0, 0). Single-pane UI
still works, but once two panes are on screen userEvent can't hit-test a click
and silently drops it. Tests needing a menu in a multi-pane workspace must run
under `stubLayout()` in `__tests__/workspace.test.tsx`, which hands out one
stable non-zero box per element. It's scoped rather than global on purpose: the
drag tests depend on unmocked elements reading as 0×0, and `mockRect()` spies
still win over it (own property vs. prototype).

Component tests live in `src/registry/bases/base/workspaceui/__tests__/`; the
shared test setup has its own tests in `src/test/__tests__/`.

New component or block, or a prop change on an existing one: see [`.claude/rules/component-testing.md`](.claude/rules/component-testing.md) — needs a component-level test, a `registry.json` entry, and doc/sidebar entries (the latter two are validated automatically by `src/registry/__tests__/registry.test.ts` and `registry-docs.test.ts`).

New block: before building it, invoke the `shadcn` skill for component context — see [`.claude/rules/block-creation.md`](.claude/rules/block-creation.md).

## Tooling

- **Next.js 16** App Router (Turbopack), static export (`output: "export"`)
- **TypeScript ~6**, strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals/Params`
- **ESLint** flat config — `typescript-eslint` + `react-hooks` (generated dirs `.next`/`.source`/`out` ignored)
- **@shadcn/lint** — all six rules (`no-restyle`, `no-raw-colors`, `no-arbitrary-values`, `no-inline-styles`, `no-unknown-classes`, `require-static-classes`) are `error` in `eslint.config.js` and clean. `components/ui/**`, `registry/bases/base/workspaceui/**` (our own component directory; `no-restyle` off there), the docs code-block widgets and `__tests__/**` are exempted. `no-restyle` is `allow: ["layout"]` plus the named `restyleContracts` list at the top of `eslint.config.js` (shadcn's documented contracts, plus treatments the stock components have no variant for: Card tints, filled sidebar action, segmented ToggleGroup, table gutters, avatar shape, compact Input text, …). To restyle a component, use a variant, put the style on the content inside it, or add a contract only when a named treatment recurs. `pnpm lint` runs with `--max-warnings 0`, so any new finding fails it. Intentional one-off exceptions: `// eslint-disable-next-line shadcn/<rule> -- <reason>`
- **Prettier** — double quotes, trailing commas (es5), `prettier-plugin-tailwindcss` with `cn` and `cva` listed as Tailwind class functions so class sorting works inside those helpers
- **Tailwind CSS v4** via `@tailwindcss/postcss` (`postcss.config.mjs`)
- **Vitest** still runs on Vite (`vitest.config.ts`) — Vite/`@vitejs/plugin-react`/the fumadocs vite plugin are kept as devDeps for tests only

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, managed via the `gh` CLI. External PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical triage roles use their default label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
