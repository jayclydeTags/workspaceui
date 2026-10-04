"use client"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"
import type { WorkspaceTab } from "@/registry/bases/base/workspaceui/workspace-tabs"
import { defineStory } from "@/components/studio/studio"

const TITLES = ["Dashboard", "Documentation", "Settings", "Reports", "Activity"]

interface Args {
  layout: "single" | "split"
  tabs: number
  pinFirst: boolean
  badges: boolean
  dirty: boolean
}

function makeTabs(args: Args, offset: number, count: number): WorkspaceTab[] {
  return TITLES.slice(offset, offset + count).map((title, i) => ({
    id: title.toLowerCase(),
    title,
    pinned: args.pinFirst && i === 0 ? true : undefined,
    badge: args.badges && i === 1 ? 3 : undefined,
    dirty: args.dirty && i === 2 ? true : undefined,
  }))
}

function Preview(args: Args) {
  const total = Math.min(Math.max(args.tabs, 1), TITLES.length)
  const panes =
    args.layout === "split" && total > 1
      ? [
          {
            id: "pane-a",
            tabs: makeTabs(args, 0, Math.ceil(total / 2)),
            defaultSize: 60,
            minSize: 30,
          },
          {
            id: "pane-b",
            tabs: makeTabs(args, Math.ceil(total / 2), Math.floor(total / 2)),
            defaultSize: 40,
            minSize: 30,
          },
        ]
      : [{ id: "pane-a", tabs: makeTabs(args, 0, total) }]

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border bg-background">
      {/* initialPanes is read once, so a control change remounts the workspace. */}
      <Workspace
        key={JSON.stringify(args)}
        initialPanes={panes}
        renderTabContent={(_paneId, tabId) => (
          <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
            {TITLES.find((t) => t.toLowerCase() === tabId)}
          </div>
        )}
      />
    </div>
  )
}

export default defineStory<Args>({
  args: {
    layout: "split",
    tabs: 4,
    pinFirst: true,
    badges: true,
    dirty: false,
  },
  controls: {
    layout: {
      group: "style",
      type: "select",
      options: ["single", "split"],
      description:
        "One pane, or two side by side. Tabs are draggable between panes.",
    },
    tabs: { type: "number", min: 1, max: TITLES.length },
    pinFirst: {
      type: "boolean",
      label: "Pin first tab",
      description: "Pinned tabs have no close button.",
    },
    badges: {
      type: "boolean",
      description: "Numeric badge on the second tab.",
    },
    dirty: {
      type: "boolean",
      description: "Unsaved-changes dot on the third tab.",
    },
  },
  preview: Preview,
})
