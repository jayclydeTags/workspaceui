"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  EmptyContent,
  PlaceholderContent,
} from "@/registry/bases/base/blocks/dashboard-02/components/dashboard-content"
import {
  IconRail,
  NAV_ITEMS,
  SETTINGS_ITEM,
} from "@/registry/bases/base/blocks/dashboard-02/components/icon-rail"
import { TopBar } from "@/registry/bases/base/blocks/dashboard-02/components/top-bar"

// ponytail: CONTENT at module level avoids re-creating ReactNodes on each render
const CONTENT: Record<string, React.ReactNode> = {
  home: <EmptyContent />,
  inbox: <PlaceholderContent Icon={NAV_ITEMS[1].Icon} title="Inbox" />,
  tasks: <PlaceholderContent Icon={NAV_ITEMS[2].Icon} title="Tasks" />,
  calendar: <PlaceholderContent Icon={NAV_ITEMS[3].Icon} title="Calendar" />,
  settings: <PlaceholderContent Icon={SETTINGS_ITEM.Icon} title="Settings" />,
}

export function Dashboard02({ className }: { className?: string }) {
  const [activeId, setActiveId] = React.useState<string>(NAV_ITEMS[0].id)

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <IconRail
          activeId={activeId}
          onNavClick={(item) => setActiveId(item.id)}
        />
        <div className="min-h-0 flex-1">
          {CONTENT[activeId] ?? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {activeId}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
