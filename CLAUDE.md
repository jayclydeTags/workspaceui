# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # start docs site
pnpm build            # build docs site (tsc + vite build → dist/)
pnpm preview          # serve dist/
pnpm lint             # ESLint
pnpm format           # Prettier (writes in place)
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run (single pass)
pnpm test:watch       # vitest interactive
pnpm test:coverage    # vitest run --coverage
```

### Running a single test file
```bash
pnpm vitest run src/components/workspaceui/__tests__/workspace-tabs.test.tsx
```

## Project structure

```
workspaceui/
├── registry.json             # shadcn registry manifest (points to src/components/workspaceui/)
├── src/
│   ├── app.tsx               # BrowserRouter + routes (docs site entry)
│   ├── main.tsx
│   ├── index.css             # Tailwind v4 + theme tokens
│   ├── components/
│   │   ├── workspaceui/      # Distributable components (source of truth)
│   │   │   ├── workspace-tabs.tsx
│   │   │   ├── workspace.tsx
│   │   │   └── __tests__/
│   │   ├── ui/               # shadcn UI primitives
│   │   ├── header.tsx        # Docs site header
│   │   ├── sidebar-nav.tsx
│   │   ├── code-block.tsx    # Shiki syntax highlighting
│   │   ├── component-preview.tsx
│   │   ├── component-preview-shell.tsx
│   │   ├── copy-button.tsx
│   │   ├── props-table.tsx
│   │   ├── theme-toggle.tsx
│   │   └── previews/         # Live demo components
│   ├── layouts/
│   │   └── docs-layout.tsx   # Sidebar + main layout
│   ├── lib/
│   │   ├── utils.ts          # cn() helper
│   │   ├── nav.ts            # Sidebar navigation config
│   │   └── use-document-title.ts
│   ├── pages/
│   │   ├── home.tsx          # Landing page
│   │   └── docs/
│   │       ├── blocks.tsx
│   │       ├── getting-started/
│   │       └── components/
│   └── test/setup.ts         # Vitest setup (ResizeObserver polyfill, pointer capture mocks)
```

## Registry distribution model

Components live in `src/components/workspaceui/` and are distributed via `registry.json` at the repo root — no build step, no Vercel endpoint.

The shadcn CLI has no "user/repo/item" GitHub shorthand, so consumers must register this repo's raw `registry.json` as a named registry in their project's `components.json`:

```json
{
  "registries": {
    "@workspaceui": "https://raw.githubusercontent.com/jayclydeTags/workspaceui/main/registry.json"
  }
}
```

Then install components with the namespace prefix:

```bash
npx shadcn@latest add @workspaceui/workspace-tabs
npx shadcn@latest add @workspaceui/workspace
```

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

Every component in `src/components/workspaceui/` must have a matching fumadocs page:
- `content/docs/components/<component>.mdx` — install (CLI + manual `<ComponentSource>`), usage, and a `<TypeTable>` API reference
- A live demo in `src/components/previews/<component>-live.tsx`, registered in `previewComponents` in `src/components/component-preview.tsx`, and referenced via `<ComponentPreview name="<component>" code={...} />` in the mdx
- A sidebar entry in the `Components` section of `src/lib/nav.ts`
- A `registry.json` entry pointing at the component file

Use `content/docs/components/workspace-panel.mdx` and `src/components/previews/workspace-panel-single.tsx` as the reference pattern.

## Testing

Vitest with jsdom. `src/test/setup.ts` provides:
- `ResizeObserver` polyfill (required by `react-resizable-panels`)
- `setPointerCapture`/`releasePointerCapture` mocks (required by drag handlers)

Tests live in `src/components/workspaceui/__tests__/`.

## Tooling

- **TypeScript ~6**, strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals/Params`
- **ESLint** flat config — `typescript-eslint` + `react-hooks` + `react-refresh`
- **Prettier** — double quotes, trailing commas (es5), `prettier-plugin-tailwindcss` with `cn` and `cva` listed as Tailwind class functions so class sorting works inside those helpers
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no PostCSS config needed)
