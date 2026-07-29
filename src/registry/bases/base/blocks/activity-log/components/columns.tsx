import type { ColumnDef } from "@tanstack/react-table"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { dataGridFilterFn } from "@/registry/bases/base/workspaceui/data-filter"
import {
  ACTIVITY_USERS,
  activityUser,
  initials,
  type ActionType,
  type ActivityEntry,
  type StatusType,
} from "../data"

// Date.now() ticks between the server render and client hydration passes, so
// its output legitimately differs — the cell suppresses the warning.
export function formatTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return date.toLocaleDateString()
}

export const STATUS_VARIANT: Record<
  StatusType,
  "default" | "secondary" | "destructive" | "outline"
> = {
  success: "default",
  failed: "destructive",
  pending: "secondary",
}

export const ACTION_VARIANT: Record<
  ActionType,
  "default" | "secondary" | "destructive" | "outline"
> = {
  created: "default",
  updated: "secondary",
  deleted: "destructive",
  viewed: "outline",
  shared: "secondary",
  exported: "outline",
}

// meta.type is what DataFilter/DataSearch read to offer operators and resolve
// labels. Nothing here is editable — the table renders these cells itself.
export const columns: ColumnDef<ActivityEntry>[] = [
  {
    accessorKey: "userId",
    header: "User",
    filterFn: dataGridFilterFn,
    meta: { type: "user", users: ACTIVITY_USERS },
    cell: ({ getValue }) => {
      const name = activityUser(getValue<string>())?.name ?? "Unknown"
      return (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7 text-[10px]">
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    filterFn: dataGridFilterFn,
    meta: {
      type: "select",
      options: [
        { value: "created", label: "Created" },
        { value: "updated", label: "Updated" },
        { value: "deleted", label: "Deleted" },
        { value: "viewed", label: "Viewed" },
        { value: "shared", label: "Shared" },
        { value: "exported", label: "Exported" },
      ],
    },
    cell: ({ getValue }) => {
      const action = getValue<ActionType>()
      return (
        <Badge
          variant={ACTION_VARIANT[action]}
          className="text-[11px] capitalize"
        >
          {action}
        </Badge>
      )
    },
  },
  {
    accessorKey: "resource",
    header: "Resource",
    filterFn: dataGridFilterFn,
    meta: { type: "text" },
    cell: ({ getValue }) => (
      <p className="max-w-[200px] truncate">{getValue<string>()}</p>
    ),
  },
  {
    accessorKey: "resourceType",
    header: "Type",
    filterFn: dataGridFilterFn,
    meta: { type: "text" },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: dataGridFilterFn,
    meta: {
      type: "select",
      options: [
        { value: "success", label: "Success" },
        { value: "failed", label: "Failed" },
        { value: "pending", label: "Pending" },
      ],
    },
    cell: ({ getValue }) => {
      const status = getValue<StatusType>()
      return (
        <Badge
          variant={STATUS_VARIANT[status]}
          className="text-[11px] capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ getValue }) => (
      <span suppressHydrationWarning>{formatTime(getValue<Date>())}</span>
    ),
  },
]
