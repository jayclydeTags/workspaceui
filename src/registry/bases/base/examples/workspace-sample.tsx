"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Home,
  FolderOpen,
  Terminal,
  Inbox,
  Bell,
  Plus,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Workspace,
  useWorkspace,
  type WorkspaceHandle,
} from "@/registry/bases/base/workspaceui/workspace"

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      {children}
    </div>
  )
}

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// Single pane, multiple tabs — closable, draggable, no split by default.
export function WorkspaceTabsDemo() {
  const content: Record<string, React.ReactNode> = {
    home: <Centered icon={<Home />} label="Home" />,
    files: <Centered icon={<FolderOpen />} label="Files" />,
    terminal: <Centered icon={<Terminal />} label="Terminal" />,
  }
  return (
    <PreviewFrame>
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [
              { id: "home", title: "Home", icon: <Home className="size-3.5" />, pinned: true },
              { id: "files", title: "Files", icon: <FolderOpen className="size-3.5" /> },
              { id: "terminal", title: "Terminal", icon: <Terminal className="size-3.5" /> },
            ],
          },
        ]}
        renderTabContent={(_p, tabId) => content[tabId]}
      />
    </PreviewFrame>
  )
}

// Two side-by-side panes — drag a tab across the divider to transfer it.
export function WorkspaceSplitDemo() {
  const content: Record<string, React.ReactNode> = {
    dashboard: <Centered icon={<LayoutDashboard />} label="Dashboard" />,
    docs: <Centered icon={<FileText />} label="Documentation" />,
    settings: <Centered icon={<Settings />} label="Settings" />,
  }
  return (
    <PreviewFrame>
      <Workspace
        initialPanes={[
          {
            id: "left",
            defaultSize: 60,
            tabs: [
              { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard className="size-3.5" />, pinned: true },
              { id: "docs", title: "Documentation", icon: <FileText className="size-3.5" /> },
            ],
          },
          {
            id: "right",
            defaultSize: 40,
            tabs: [{ id: "settings", title: "Settings", icon: <Settings className="size-3.5" />, pinned: true }],
          },
        ]}
        renderTabContent={(_p, tabId) => content[tabId]}
      />
    </PreviewFrame>
  )
}

// Numeric badges on tabs.
export function WorkspaceBadgesDemo() {
  const content: Record<string, React.ReactNode> = {
    inbox: <Centered icon={<Inbox />} label="Inbox" />,
    chat: <Centered icon={<MessageSquare />} label="Chat" />,
    alerts: <Centered icon={<Bell />} label="Alerts" />,
  }
  return (
    <PreviewFrame>
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [
              { id: "inbox", title: "Inbox", icon: <Inbox className="size-3.5" />, badge: 12, pinned: true },
              { id: "chat", title: "Chat", icon: <MessageSquare className="size-3.5" />, badge: 3 },
              { id: "alerts", title: "Alerts", icon: <Bell className="size-3.5" /> },
            ],
          },
        ]}
        renderTabContent={(_p, tabId) => content[tabId]}
      />
    </PreviewFrame>
  )
}

// "+" button in the tab strip via onAddTab — opens a new numbered tab through the ref.
export function WorkspaceAddTabDemo() {
  const workspace = React.useRef<WorkspaceHandle>(null)
  const nextId = React.useRef(1)
  return (
    <PreviewFrame>
      <Workspace
        ref={workspace}
        initialPanes={[
          {
            id: "main",
            tabs: [{ id: "start", title: "Start", icon: <Home className="size-3.5" />, pinned: true }],
            onAddTab: () => {
              const n = nextId.current++
              workspace.current?.openTabInPane("main", {
                id: `tab-${n}`,
                title: `Untitled ${n}`,
                icon: <FileText className="size-3.5" />,
              })
            },
          },
        ]}
        renderTabContent={(_p, tabId) =>
          tabId === "start" ? (
            <Centered icon={<Plus />} label="Press + to open a tab" />
          ) : (
            <Centered icon={<FileText />} label={tabId} />
          )
        }
      />
    </PreviewFrame>
  )
}

// Programmatic control from outside — a sidebar opens/focuses tabs via the ref.
export function WorkspaceProgrammaticDemo() {
  const workspace = React.useRef<WorkspaceHandle>(null)
  const items = [
    { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { id: "documents", title: "Documents", icon: <FileText className="size-4" /> },
    { id: "settings", title: "Settings", icon: <Settings className="size-4" /> },
  ]
  return (
    <PreviewFrame>
      <div className="flex h-full">
        <nav className="flex w-44 shrink-0 flex-col gap-1 border-r border-border bg-muted/30 p-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                workspace.current?.openTabInPane("main", {
                  id: item.id,
                  title: item.title,
                  icon: React.cloneElement(item.icon as React.ReactElement, {
                    className: "size-3.5",
                  } as { className: string }),
                })
              }
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {item.icon}
              {item.title}
            </button>
          ))}
        </nav>
        <Workspace
          ref={workspace}
          className="flex-1"
          initialPanes={[
            {
              id: "main",
              tabs: [
                { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard className="size-3.5" />, pinned: true },
              ],
            },
          ]}
          renderTabContent={(_p, tabId) => <Centered icon={<FileText />} label={tabId} />}
        />
      </div>
    </PreviewFrame>
  )
}

// Content reaches the workspace via useWorkspace() — no ref needed from inside a pane.
function OverviewPanel() {
  const { openTabInPane } = useWorkspace()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      <LayoutDashboard className="size-8 text-muted-foreground/40" />
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          openTabInPane("main", {
            id: "details",
            title: "Details",
            icon: <FileText className="size-3.5" />,
          })
        }
      >
        Open details tab
      </Button>
    </div>
  )
}

export function WorkspaceContextDemo() {
  return (
    <PreviewFrame>
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [{ id: "overview", title: "Overview", icon: <LayoutDashboard className="size-3.5" />, pinned: true }],
          },
        ]}
        renderTabContent={(_p, tabId) =>
          tabId === "overview" ? <OverviewPanel /> : <Centered icon={<FileText />} label={tabId} />
        }
      />
    </PreviewFrame>
  )
}

// Custom fallback — close the single tab to reveal it.
export function WorkspaceFallbackDemo() {
  return (
    <PreviewFrame>
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [{ id: "scratch", title: "Scratch", icon: <FileText className="size-3.5" /> }],
          },
        ]}
        renderTabContent={(_p, tabId) => <Centered icon={<FileText />} label={tabId} />}
        fallback={
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Inbox className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No panels open</p>
            <p className="text-xs text-muted-foreground/70">Close the tab above to land here.</p>
          </div>
        }
      />
    </PreviewFrame>
  )
}
