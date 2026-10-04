"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  File01Icon,
  Setting06Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Workspace,
  type WorkspaceHandle,
} from "@/registry/bases/base/workspaceui/workspace"

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// Programmatic control from outside — a sidebar opens/focuses tabs via the ref.
export function WorkspaceProgrammaticDemo() {
  const workspace = React.useRef<WorkspaceHandle>(null)
  const items = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
    },
    {
      id: "documents",
      title: "Documents",
      icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
    },
    {
      id: "settings",
      title: "Settings",
      icon: <HugeiconsIcon icon={Setting06Icon} strokeWidth={2} />,
    },
  ]
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <div className="flex h-full">
        <nav className="flex w-44 shrink-0 flex-col gap-1 border-r border-border bg-muted/30 p-2">
          {items.map((item) => (
            <Button
              key={item.id}
              className="w-full justify-start"
              onClick={() =>
                workspace.current?.openTabInPane("main", {
                  id: item.id,
                  title: item.title,
                  icon: React.cloneElement(
                    item.icon as React.ReactElement,
                    {
                      className: "size-3.5",
                    } as { className: string }
                  ),
                })
              }
            >
              {React.cloneElement(
                item.icon as React.ReactElement,
                { "data-icon": "inline-start" } as object
              )}
              {item.title}
            </Button>
          ))}
        </nav>
        <Workspace
          ref={workspace}
          className="flex-1"
          initialPanes={[
            {
              id: "main",
              tabs: [
                {
                  id: "dashboard",
                  title: "Dashboard",
                  icon: (
                    <HugeiconsIcon
                      icon={DashboardSquare01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  ),
                  pinned: true,
                },
              ],
            },
          ]}
          renderTabContent={(_p, tabId) => (
            <Centered
              icon={<HugeiconsIcon icon={File01Icon} strokeWidth={2} />}
              label={tabId}
            />
          )}
        />
      </div>
    </div>
  )
}
