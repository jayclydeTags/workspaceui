"use client"

import * as React from "react"
import { Inbox, Bell, MessageSquare } from "lucide-react"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
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
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [
              {
                id: "inbox",
                title: "Inbox",
                icon: <Inbox className="size-3.5" />,
                badge: 12,
                pinned: true,
              },
              {
                id: "chat",
                title: "Chat",
                icon: <MessageSquare className="size-3.5" />,
                badge: 3,
              },
              {
                id: "alerts",
                title: "Alerts",
                icon: <Bell className="size-3.5" />,
              },
            ],
          },
        ]}
        renderTabContent={(_p, tabId) => content[tabId]}
      />
    </div>
  )
}
