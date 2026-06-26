# workspaceui

A shadcn-compatible component registry with workspace UI primitives.

## Components

| Name | Description |
|---|---|
| `workspace-tabs` | Chrome-style scrollable tab strip with closeable tabs, unread badges, overflow fade, and macOS-style curved active-tab connectors. |
| `workspace` | Self-contained workspace with tab-based panels: closing a panel's last tab collapses the panel; closing all panels reveals a configurable fallback. Exposes `useWorkspace` context and a `WorkspaceHandle` ref for programmatic control. |

## Installation

Components are installed individually via the shadcn CLI using the GitHub registry shorthand.

### `workspace-tabs`

```bash
npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs
```

### `workspace`

```bash
npx shadcn@latest add jayclydeTags/workspaceui/workspace
```

> `workspace` depends on `workspace-tabs` and the shadcn `resizable` component — the CLI installs them automatically.

## Usage

### WorkspaceTabs

```tsx
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"

const [activeId, setActiveId] = React.useState("tab-1")
const [tabs, setTabs] = React.useState([
  { id: "tab-1", title: "index.tsx" },
  { id: "tab-2", title: "App.tsx" },
])

<WorkspaceTabs
  tabs={tabs}
  activeTabId={activeId}
  onTabChange={setActiveId}
  onTabClose={(id) => setTabs((prev) => prev.filter((t) => t.id !== id))}
  onAddTab={() => { /* open new tab */ }}
>
  {/* panel content for the active tab */}
</WorkspaceTabs>
```

### Workspace

```tsx
import { Workspace, type WorkspacePaneDef } from "@/components/ui/workspace"

const panes: WorkspacePaneDef[] = [
  {
    id: "pane-1",
    tabs: [
      { id: "tab-1", title: "Dashboard" },
      { id: "tab-2", title: "Settings" },
    ],
  },
  {
    id: "pane-2",
    tabs: [{ id: "tab-3", title: "Terminal", pinned: true }],
  },
]

<Workspace
  panes={panes}
  renderTab={(paneId, tabId) => <div>Content for {tabId}</div>}
  fallback={<div>Open a file to get started.</div>}
/>
```

## Development

```bash
pnpm install
pnpm dev    # start the Vite dev server
```

## Adding shadcn components

```bash
npx shadcn@latest add button
```

This places UI components in `src/components/ui/`.
