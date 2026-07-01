# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # start docs site (react-router dev)
pnpm build            # build docs site (tsc + react-router build → build/client/)
pnpm preview          # serve build/client/
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

```
workspaceui/
├── registry.json             # shadcn registry manifest (points to src/registry/bases/base/workspaceui/)
├── react-router.config.ts    # appDirectory: src/app, ssr: false (SPA mode)
├── src/
│   ├── app/
│   │   ├── root.tsx           # document shell (replaces index.html/main.tsx), wraps FumaProvider
│   │   ├── routes.ts          # flatRoutes() — @react-router/fs-routes config
│   │   └── routes/            # flat-file routes: _home.tsx, docs.tsx+docs.$.tsx, blocks.tsx+children
│   ├── content/
│   │   └── docs/              # fumadocs mdx content
│   ├── registry/
│   │   └── bases/base/
│   │       ├── workspaceui/   # Distributable components (source of truth)
│   │       │   ├── workspace-tabs.tsx
│   │       │   ├── workspace.tsx
│   │       │   ├── blocks/
│   │       │   └── __tests__/
│   │       └── examples/      # Live demo components (registered in component-preview.tsx)
│   ├── index.css             # Tailwind v4 + theme tokens
│   ├── components/
│   │   ├── ui/                # shadcn UI primitives
│   │   ├── header.tsx         # Docs site header
│   │   ├── sidebar-nav.tsx
│   │   ├── code-block.tsx     # Shiki syntax highlighting
│   │   ├── component-preview.tsx
│   │   ├── component-preview-shell.tsx
│   │   ├── copy-button.tsx
│   │   ├── props-table.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── utils.ts          # cn() helper
│   │   ├── nav.ts            # Sidebar navigation config
│   │   └── use-document-title.ts
│   └── test/setup.ts         # Vitest setup (ResizeObserver polyfill, pointer capture mocks)
```

## Registry distribution model

Components live in `src/registry/bases/base/workspaceui/` and are distributed via `registry.json` at the repo root using the shadcn CLI's [GitHub registry shorthand](https://ui.shadcn.com/docs/registry/github) — no build step, no Vercel endpoint, no `components.json` registries config needed.

```bash
npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs
npx shadcn@latest add jayclydeTags/workspaceui/workspace
```

The repo must be public and have `registry.json` at its root; the CLI resolves items from it directly. Within `registry.json`, `registryDependencies` that point at sibling items in this same repo must use the full `jayclydeTags/workspaceui/<item>` address (not the bare name) — bare names resolve against the consumer's default `@shadcn` registry and 404. Plain shadcn primitives (`utils`, `resizable`, `sidebar`, `breadcrumb`, etc.) stay unprefixed. `src/registry/__tests__/registry.test.ts` validates both of these rules against every item automatically — see [`.claude/rules/component-testing.md`](.claude/rules/component-testing.md).

`bases/base/` mirrors shadcn's own multi-base registry convention (`apps/v4` on shadcn/ui). There is currently one base; don't add a second `bases/<name>/` directory speculatively.

## Path aliases

| Alias | Resolves to |
|---|---|
| `@/*` | `./src/*` |

Components import each other via `@/components/workspaceui/...`.

## Component architecture

### workspace-tabs.tsx
- Props: `tabs: WorkspaceTab[]`, `activeTabId`, `onTabChange`, `onTabClose?`, `onAddTab?`
- `WorkspaceTab`: `{ id, title, icon?, badge?, pinned? }`
- Renders macOS-style curved tab connectors via `LeftConnector`/`RightConnector` (SVG clip-path)
- Exposes `onTabDragStart`/`tabDropInsertIndex` for cross-pane drag support consumed by `workspace.tsx`

### workspace.tsx
- Column-based layout using `react-resizable-panels`; each column holds one top pane + optional bottom pane
- Two contexts:
  - **`WorkspaceContext`** — pane/tab state and methods (`openTabInPane`, `closeTab`, `activateTab`, `updateTab`, `openPane`, `closePane`). Access via `useWorkspace()`.
  - **`WorkspaceDragContext`** — drag session tracking, snap zones, drop-target state
- **`WorkspaceHandle`** ref — imperative API (same methods as context minus read-only state); attach via `ref` prop for programmatic control from outside the component
- `renderTabContent(paneId, tabId)` — called on every render for the active tab in each pane; keep it fast
- Fallback content shown when all panes are closed (configurable via `fallback` prop)
- Constants: `MIN_COL_SIZE = 20%`, `MIN_ROW_SIZE = 30%`

## Documentation

Every component in `src/registry/bases/base/workspaceui/` must have a matching fumadocs page:
- `src/content/docs/components/<component>.mdx` — install (CLI + manual `<ComponentSource>`), usage, and a `<TypeTable>` API reference
- A live demo in `src/registry/bases/base/examples/<component>-live.tsx`, registered in `previewComponents` in `src/components/component-preview.tsx`, and referenced via `<ComponentPreview name="<component>" code={...} />` in the mdx
- A sidebar entry in the `Components` section of **both** `src/lib/nav.ts` and `src/lib/page-tree.ts` (`page-tree.ts` is what the fumadocs sidebar actually renders — `nav.ts` alone won't show the page)
- A `registry.json` entry pointing at the component file

Use `src/content/docs/components/workspace-panel.mdx` and `src/registry/bases/base/examples/workspace-panel-single.tsx` as the reference pattern.

## Testing

Vitest with jsdom. `src/test/setup.ts` provides:
- `ResizeObserver` polyfill (required by `react-resizable-panels`)
- `setPointerCapture`/`releasePointerCapture` mocks (required by drag handlers)

Tests live in `src/registry/bases/base/workspaceui/__tests__/`.

New component or block: see [`.claude/rules/component-testing.md`](.claude/rules/component-testing.md) — needs both a component-level test and a `registry.json` entry (validated automatically by `src/registry/__tests__/registry.test.ts`).

## Tooling

- **TypeScript ~6**, strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals/Params`
- **ESLint** flat config — `typescript-eslint` + `react-hooks` + `react-refresh`
- **Prettier** — double quotes, trailing commas (es5), `prettier-plugin-tailwindcss` with `cn` and `cva` listed as Tailwind class functions so class sorting works inside those helpers
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no PostCSS config needed)
