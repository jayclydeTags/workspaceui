"use client"

import * as React from "react"
import {
  AtSign,
  BellRing,
  CheckCheck,
  MessageSquare,
  Settings2,
  ShieldCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { NOTIFICATIONS, type NotificationType } from "./data"

const TYPE_ICON: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  mention: AtSign,
  comment: MessageSquare,
  approval: ShieldCheck,
  system: Settings2,
}

export function NotificationsInbox01() {
  const [items, setItems] = React.useState(NOTIFICATIONS)

  const unreadCount = items.filter((n) => !n.read).length

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  function renderList(list: typeof items) {
    if (list.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BellRing />
            </EmptyMedia>
            <EmptyTitle>No unread notifications</EmptyTitle>
            <EmptyDescription>You&apos;re all caught up.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )
    }
    return (
      <ul className="divide-y">
        {list.map((n) => {
          const Icon = TYPE_ICON[n.type]
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                  !n.read && "bg-accent/40"
                )}
              >
                <span
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4"
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        !n.read && "font-medium"
                      )}
                    >
                      {n.title}
                    </span>
                    {!n.read && (
                      <span
                        className="size-2 shrink-0 rounded-full bg-primary"
                        aria-label="Unread"
                      />
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                    {n.body}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {n.time}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <Page
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      className="@container overflow-hidden"
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck data-icon="inline-start" />
          Mark all read
        </Button>
      }
    >
      <Tabs
        defaultValue="all"
        className="flex h-full min-h-0 flex-col gap-0"
      >
        <div className="border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="gap-1.5">
              Unread
              {unreadCount > 0 && (
                <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="min-h-0 flex-1 overflow-auto">
          {renderList(items)}
        </TabsContent>
        <TabsContent value="unread" className="min-h-0 flex-1 overflow-auto">
          {renderList(items.filter((n) => !n.read))}
        </TabsContent>
      </Tabs>
    </Page>
  )
}
