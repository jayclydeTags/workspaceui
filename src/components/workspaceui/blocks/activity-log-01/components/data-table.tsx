import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { ActivityEntry, ActionType, StatusType } from "../data"

// ── Helpers ────────────────────────────────────────────────────────────────

export function formatTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return date.toLocaleDateString()
}

export const STATUS_VARIANT: Record<StatusType, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  failed:  "destructive",
  pending: "secondary",
}

export const ACTION_CLASS: Record<ActionType, string> = {
  created:  "text-emerald-600 dark:text-emerald-400",
  updated:  "text-blue-600 dark:text-blue-400",
  deleted:  "text-red-600 dark:text-red-400",
  viewed:   "text-muted-foreground",
  shared:   "text-violet-600 dark:text-violet-400",
  exported: "text-amber-600 dark:text-amber-400",
}

// ── DataTable ──────────────────────────────────────────────────────────────

export function DataTable({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No matching events
      </div>
    )
  }

  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-border bg-background">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-6 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Action</th>
              <th className="hidden px-4 py-2.5 font-medium @md:table-cell">Resource</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="pr-6 py-2.5 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((e) => (
              <tr key={e.id} className="hover:bg-muted/40">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={e.initials} />
                    <span className="font-medium">{e.user}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("capitalize", ACTION_CLASS[e.action])}>{e.action}</span>
                </td>
                <td className="hidden px-4 py-3 @md:table-cell">
                  <p className="max-w-[200px] truncate">{e.resource}</p>
                  <p className="text-xs text-muted-foreground">{e.resourceType}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[e.status]} className="capitalize text-[11px]">
                    {e.status}
                  </Badge>
                </td>
                <td className="pr-6 py-3 text-right text-xs text-muted-foreground">
                  {formatTime(e.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {entries.map((e) => (
          <li key={e.id} className="flex gap-3 px-4 py-3">
            <Avatar initials={e.initials} className="mt-0.5 size-8 text-xs" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{e.user}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatTime(e.timestamp)}</span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs">
                <span className={cn("capitalize", ACTION_CLASS[e.action])}>{e.action}</span>
                <span className="text-muted-foreground">·</span>
                <span className="truncate text-muted-foreground">{e.resource}</span>
              </div>
              <div className="mt-1.5">
                <Badge variant={STATUS_VARIANT[e.status]} className="capitalize text-[10px]">
                  {e.status}
                </Badge>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground",
        className,
      )}
    >
      {initials}
    </div>
  )
}
