# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Dev / build (root delegates to docs)
```bash
pnpm dev              # start docs site (delegates to pnpm --filter docs dev)
pnpm build            # build docs site (delegates to pnpm --filter docs build)
pnpm preview          # serve docs dist/
```

### Tests & tooling (run from root)
```bash
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
    └── src/              # React Router v7 app
```

## Registry distribution model

Components live in `registry/ui/` and are distributed via the shadcn GitHub registry shorthand:

```bash
npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs
npx shadcn@latest add jayclydeTags/workspaceui/workspace
```

The shadcn CLI resolves this directly from `registry.json` at the repo root — no build step, no Vercel endpoint. The docs site is for documentation only; it imports components via `@/registry/*` (alias to root `registry/ui/`).

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
