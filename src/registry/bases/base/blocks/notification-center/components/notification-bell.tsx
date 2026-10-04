"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  BellIcon,
  BellRingIcon,
  TickDouble02Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
        render={<Button variant="ghost" size="icon" className="relative" />}
      >
        {unread > 0 ? (
          <HugeiconsIcon icon={BellRingIcon} strokeWidth={2} />
        ) : (
          <HugeiconsIcon icon={BellIcon} strokeWidth={2} />
        )}
        {unread > 0 && (
          <Badge className="absolute -inset-e-1 -top-1 h-4 min-w-4 justify-center">
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
            <HugeiconsIcon
              icon={TickDouble02Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator className="my-0" />

        {recent.length === 0 ? (
          <Empty className="py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={BellRingIcon} strokeWidth={2} />
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
        <DropdownMenuItem onClick={onViewAll} className="justify-center py-2">
          <span className="text-sm font-medium">View all</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
