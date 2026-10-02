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
├── source.config.ts          # fumadocs-mdx config (docs/meta collections)
├── postcss.config.mjs        # @tailwindcss/postcss
├── vitest.config.ts          # standalone; fumadocs() + react() plugins, jsdom
├── src/
│   ├── app/                  # App Router
│   │   ├── layout.tsx        # root: <html>/<body> + next-themes ThemeProvider + <SiteHeader/>
│   │   ├── globals.css       # Tailwind v4 + theme tokens (was src/index.css)
│   │   ├── (marketing)/      # home: page.tsx (no layout — SiteHeader is global now)
│   │   ├── docs/             # layout.tsx (sidebar + content, hand-built) + [[...slug]]/page.tsx
│   │   ├── blocks/
│   │   │   ├── (browse)/     # layout (sidebar only — SiteHeader is global), page.tsx (gallery), [slug]/page.tsx
│   │   │   └── preview/[slug]/page.tsx   # bare iframe target — escapes (browse) chrome
│   │   └── api/search/route.ts           # createSearchAPI advanced → staticGET (out/api/search)
│   ├── content/docs/         # fumadocs mdx content
│   ├── blocks/               # Copy-only blocks (e.g. navbars): in the gallery with Preview + Code, not in registry.json — manifest in lib/copy-blocks.ts
│   ├── registry/bases/base/
│   │   ├── workspaceui/      # Distributable components (source of truth) + __tests__/
│   │   ├── blocks/           # Distributable blocks — each its own folder: page.tsx, components/, data.ts
│   │   └── examples/         # Live demo components (registered in component-preview.tsx)
│   ├── components/
│   │   ├── ui/               # shadcn primitives (shadcn-owned; overwritten on re-install)
│   │   ├── site/             # app chrome shared by every route: site-header, search-dialog,
│   │   │                     #   sidebar-nav, blocks-sidebar-nav, theme-provider, theme-toggle,
│   │   │                     #   workspaceui-logo, github-icon
│   │   └── docs/             # docs/blocks-gallery rendering: docs-toc, docs-pager, docs-page-actions,
│   │                         #   mdx-heading, mdx-accordion, callout, steps, files, codeblock,
│   │                         #   dynamic-codeblock, component-preview{,-shell}, component-source
│   │                         #   (fs reads), component-tree, block-preview, copy-button, …
│   ├── lib/
│   │   ├── source.ts         # fumadocs loader() over .source — content/page data for docs/[[...slug]]
│   │   ├── nav.ts            # nav + blocksNav config — drives SidebarNav (docs + blocks) and search
│   │   ├── blocks.ts         # /blocks gallery data (slug→Component)
│   │   ├── block-files.ts    # per-block source-file manifest for the Code tab (fs-read paths)
│   │   ├── mdx-components.tsx # MDX component map (custom typography, no fumadocs-ui)
│   │   └── utils.ts          # cn() helper
│   └── test/setup.ts         # Vitest setup (ResizeObserver polyfill, pointer capture mocks)
```

### UI architecture: no fumadocs-ui

The docs/marketing/blocks chrome is hand-built on **fumadocs-core** (headless:
`source`/page-tree, `search/client`+`search/server`, `toc`, `highlight`) and the
project's own shadcn/ui primitives (`src/components/ui/*`) — not
`fumadocs-ui`'s pre-built `HomeLayout`/`DocsLayout`/`DocsPage`/`RootProvider`/
`DynamicCodeBlock` components, which this repo doesn't depend on at all.

- **`SiteHeader`** (`src/components/site/site-header.tsx`) is mounted once in the
  root layout and shared by every route (marketing, docs, blocks) — it's not
  per-route-group chrome.
- **Docs sidebar** reuses `SidebarNav` (`src/components/site/sidebar-nav.tsx`), the
  same hand-rolled component the blocks gallery already used — fed by the
  hand-maintained `nav` config in `src/lib/nav.ts`, not fumadocs'
  `source.pageTree`.
- **Search** (`src/components/site/search-dialog.tsx`) is a shadcn `Command`
  dialog wired to fumadocs-core's headless `useDocsSearch` hook against the
  existing static `/api/search` index.
- **TOC** (`src/components/docs/docs-toc.tsx`) uses fumadocs-core's headless
  `AnchorProvider`/`TOCItem`/`useActiveAnchor` (scrollspy) over `page.data.toc`.
- **Code blocks**: `src/components/docs/dynamic-codeblock.tsx` reimplements
  fumadocs-ui's `DynamicCodeBlock` directly on fumadocs-core's
  `highlight/shiki/react` + the already-vendored `CodeBlock`/`Pre` in
  `src/components/docs/codeblock.tsx`.
- **Typography**: `src/lib/mdx-components.tsx` hand-styles MDX elements
  (headings via `mdx-heading.tsx`, tables, lists, code, etc.) instead of using
  fumadocs-ui's typography preset — there's no Tailwind Typography plugin.
- `globals.css` inlines the small pieces still needed from fumadocs' CSS
  (the `--color-fd-*` → shadcn-token bridge, the `fd-scroll-container` and
  `prose-no-margin` utilities) since the vendored `codeblock.tsx`/`tabs.tsx`/
  `accordion.tsx`/`type-table.tsx` still reference those classes.

### Next.js rendering notes

- **Server vs client**: pages/layouts are React Server Components by default;
  anything with hooks, state, or event handlers needs `"use client"` at the top
  (all the interactive `components/`, `examples/`, and `blocks/` are marked).
  A function prop (e.g. `renderTabContent`) can't cross a server→client boundary,
  so any component that passes one must itself be a client component. This is
  also why `mdx-components.tsx` stays a plain (non-`"use client"`) module even
  though some of its entries render client components — one entry
  (`ComponentSource`) reads files with Node's `fs` at build time, so the map
  itself can't force a client boundary; only `mdx-heading.tsx` (the copy-link
  button) is marked `"use client"`.
- **Reading source at build time**: `?raw` imports are unsupported under
  Turbopack. `component-source.tsx` and `blocks/(browse)/[slug]/page.tsx` read
  registry files with `fs.readFileSync(join(process.cwd(), …))` at build instead.
- **`.source`** is generated by fumadocs-mdx (createMDX at `next build`, the
  fumadocs vite plugin at `pnpm test`) — gitignored, self-heals per tool.
- **Search**: `app/api/search/route.ts` uses `createSearchAPI("advanced")`, not
  `"simple"` — fumadocs-core 16.10.7's orama-static client mis-dispatches the
  simple index (passes the DB wrapper, not `db.db`) so simple static search
  returns nothing. Advanced merges docs pages + the blocks gallery.

## Registry distribution model

Components live in `src/registry/bases/base/workspaceui/` and are distributed via `registry.json` at the repo root using the shadcn CLI's [GitHub registry shorthand](https://ui.shadcn.com/docs/registry/github) — no build step, no Vercel endpoint, no `components.json` registries config needed.

```bash
npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs
npx shadcn@latest add jayclydeTags/workspaceui/workspace
```

The repo must be public and have `registry.json` at its root; the CLI resolves items from it directly. Within `registry.json`, `registryDependencies` that point at sibling items in this same repo must use the full `jayclydeTags/workspaceui/<item>` address (not the bare name) — bare names resolve against the consumer's default `@shadcn` registry and 404. Plain shadcn primitives (`utils`, `resizable`, `sidebar`, `breadcrumb`, etc.) stay unprefixed. `src/registry/__tests__/registry.test.ts` validates both of these rules against every item automatically — see [`.claude/rules/component-testing.md`](.claude/rules/component-testing.md).

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
- Close is `Delete`/`Backspace` on the focused tab: the close affordance is a `tabIndex={-1}` div, since a button can't nest inside Base UI's tab button

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

Every component in `src/registry/bases/base/workspaceui/` must have a matching fumadocs page:

- `src/content/docs/components/<component>.mdx` — install (CLI + manual `<ComponentSource>`), usage, and a `<TypeTable>` API reference
- A live demo in `src/registry/bases/base/examples/<component>-live.tsx`, registered in `previewComponents` in `src/components/docs/component-preview.tsx`, and referenced via `<ComponentPreview name="<component>" code={...} />` in the mdx
- The component's name added to the `pages` array in `src/content/docs/components/meta.json` (validated by `registry-docs.test.ts`), **and** a sidebar entry in the `Components` section of `src/lib/nav.ts` (this is what actually renders the docs sidebar — see "UI architecture" above)
- A `registry.json` entry pointing at the component file

Use `src/content/docs/components/workspace.mdx` and `src/registry/bases/base/examples/workspace-live.tsx` as the reference pattern.

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
