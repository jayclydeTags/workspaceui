"use client"

import { Bell, BellRing, CheckCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { Notification } from "../data"
import { NotificationBody } from "./notification-item"

/** Most recent items shown in the dropdown (FR-04). */
const RECENT_COUNT = 5

export function NotificationBell({
  items,
  unavailableId,
  onSelect,
  onMarkAllRead,
  onViewAll,
}: {
  items: Notification[]
  unavailableId?: string | null
  onSelect: (item: Notification) => void
  onMarkAllRead: () => void
  onViewAll?: () => void
}) {
  const unread = items.filter((n) => !n.read).length
  const recent = items.slice(0, RECENT_COUNT)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
        }
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative"
        )}
      >
        {unread > 0 ? <BellRing /> : <Bell />}
        {unread > 0 && (
          <Badge className="absolute -inset-e-1 -top-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
            {unread > 9 ? "9+" : unread}
          </Badge>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-w-[calc(100vw-2rem)] p-0"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="text-sm font-medium">Notifications</span>
          <Button
            variant="ghost"
            size="xs"
            disabled={unread === 0}
            onClick={onMarkAllRead}
          >
            <CheckCheck data-icon="inline-start" />
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator className="my-0" />

        {recent.length === 0 ? (
          <Empty className="py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BellRing />
              </EmptyMedia>
              <EmptyTitle>You&apos;re all caught up</EmptyTitle>
              <EmptyDescription>New alerts will show up here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DropdownMenuGroup className="max-h-96 overflow-auto">
            {recent.map((n) => (
              <DropdownMenuItem
                key={n.id}
                closeOnClick={false}
                onClick={() => onSelect(n)}
                className={cn(
                  "items-start gap-3 px-3 py-2",
                  !n.read && "bg-accent/40"
                )}
              >
                <NotificationBody
                  item={n}
                  truncate
                  unavailable={unavailableId === n.id}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem
          onClick={onViewAll}
          className="justify-center py-2 text-sm font-medium"
        >
          View all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
