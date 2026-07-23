"use client"

import * as React from "react"
import { Info, ShieldAlert, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  relativeTime,
  type Notification,
  type NotificationSeverity,
} from "../data"

/** Shared severity encoding — icon + badge variant + label, never colour alone. */
export const SEVERITY_META: Record<
  NotificationSeverity,
  {
    label: string
    Icon: React.ComponentType<{ className?: string }>
    variant: React.ComponentProps<typeof Badge>["variant"]
  }
> = {
  info: { label: "Info", Icon: Info, variant: "secondary" },
  warning: { label: "Warning", Icon: TriangleAlert, variant: "outline" },
  critical: { label: "Critical", Icon: ShieldAlert, variant: "destructive" },
}

/**
 * Row contents only — the dropdown wraps this in a `DropdownMenuItem` (so the
 * menu keeps its arrow-key pattern) and the centre in a plain button.
 */
export function NotificationBody({
  item,
  truncate = false,
  unavailable = false,
}: {
  item: Notification
  /** Dropdown clamps the message to one line; the centre shows it in full. */
  truncate?: boolean
  unavailable?: boolean
}) {
  const { label, Icon, variant } = SEVERITY_META[item.severity]

  return (
    <>
      <span
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4"
        aria-hidden="true"
      >
        <Icon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <Badge variant={variant} className="shrink-0">
            {label}
          </Badge>
          {!item.read && (
            <Badge variant="outline" className="shrink-0 gap-1.5">
              <span
                className="size-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              Unread
            </Badge>
          )}
          <span className="ms-auto shrink-0 text-xs text-muted-foreground">
            {relativeTime(item.createdAt)}
          </span>
        </span>
        <span
          className={cn(
            "mt-1 block text-sm",
            truncate && "truncate",
            !item.read && "font-medium"
          )}
        >
          {item.message}
        </span>
        {unavailable && (
          <span className="mt-1 block text-xs text-destructive">
            This record is no longer available.
          </span>
        )}
      </span>
    </>
  )
}

export function NotificationItem({
  item,
  unavailable = false,
  onSelect,
}: {
  item: Notification
  unavailable?: boolean
  onSelect: (item: Notification) => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item)}
        className={cn(
          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
          !item.read && "bg-accent/40"
        )}
      >
        <NotificationBody item={item} unavailable={unavailable} />
      </button>
    </li>
  )
}
