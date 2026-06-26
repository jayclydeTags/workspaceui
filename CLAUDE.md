# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root app (component registry + demo)
```bash
pnpm dev              # start Vite dev server
pnpm build            # tsc -b && vite build
pnpm lint             # ESLint
pnpm format           # Prettier (writes in place)
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run (single pass)
pnpm test:watch       # vitest interactive
pnpm test:coverage    # vitest run --coverage
```

### Running a single test file
```bash
pnpm vitest run registry/ui/__tests__/workspace-tabs.test.tsx
```

### Docs site
```bash
pnpm --filter docs dev      # runs gen-registry.mjs then vite dev
pnpm --filter docs build    # runs gen-registry.mjs then tsc -b && vite build
pnpm --filter docs preview  # serve dist/
```

## Monorepo structure

```
workspaceui/
├── registry/ui/          # Source-of-truth for distributable components
│   ├── workspace-tabs.tsx
│   ├── workspace.tsx
│   └── __tests__/
├── src/                  # Root demo app (Vite + React)
│   ├── App.tsx           # Demo workspace with multiple panes/tabs
│   ├── components/ui/    # shadcn UI primitives
│   ├── pages/            # Demo page components (Dashboard, Inbox, etc.)
│   ├── hooks/
│   ├── lib/utils.ts      # cn() helper
│   └── test/setup.ts     # Vitest setup (ResizeObserver polyfill, pointer capture mocks)
└── docs/                 # Separate pnpm package — docs site (Vite SPA)
    ├── src/              # React Router v7 app
    ├── scripts/gen-registry.mjs
    └── public/r/         # Generated static JSON served at /r/*.json (do not edit)
```

## Registry distribution model

Components live in `registry/ui/` and are distributed via the shadcn CLI using GitHub registry shorthand:

```bash
npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs
npx shadcn@latest add jayclydeTags/workspaceui/workspace
```

`docs/scripts/gen-registry.mjs` runs automatically (via `predev`/`prebuild` hooks) and generates `docs/public/r/<name>.json` — static JSON following the shadcn registry schema. The docs site imports components directly from the root `registry/ui/` via the `@/registry/*` alias (no local copy in `docs/`).

**When modifying a registry component**, the metadata in `gen-registry.mjs` (dependencies, registryDependencies, description) must stay in sync with the component source.

## Path aliases

Both the root app and the docs site use the same two aliases:

| Alias | Resolves to |
|---|---|
| `@/*` | `./src/*` |
| `@/registry/*` | `./registry/*` |

The `@/registry/*` alias is intentional: preview components import registry files using the same path that shadcn rewrites on install (`@/components/ui/workspace-tabs`), keeping demos realistic.

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

## Testing

Vitest with jsdom. `src/test/setup.ts` provides:
- `ResizeObserver` polyfill (required by `react-resizable-panels`)
- `setPointerCapture`/`releasePointerCapture` mocks (required by drag handlers)

Tests live in `registry/ui/__tests__/` alongside the components they cover.

## Tooling

- **TypeScript ~6**, strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals/Params`
- **ESLint** flat config — `typescript-eslint` + `react-hooks` + `react-refresh`
- **Prettier** — double quotes, trailing commas (es5), `prettier-plugin-tailwindcss` with `cn` and `cva` listed as Tailwind class functions so class sorting works inside those helpers
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no PostCSS config needed)
