import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/registry/bases/base/workspaceui/status-badge"
import { activityUser, initials, type ActivityEntry } from "../data"
import { ACTION_VARIANT, STATUS_VARIANT, formatTime } from "./columns"

// Read-only: cells render through their column's `cell`, never an editor.
export function DataTable({ table }: { table: TanstackTable<ActivityEntry> }) {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No matching events</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search or filters.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      {/* Table — wide pane (≥ @sm). The scroll has to live on Table's own
          container, or the sticky header sticks to a box that never scrolls. */}
      <div className="hidden min-h-0 flex-1 overflow-hidden @sm:block [&>[data-slot=table-container]]:h-full">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header, i) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      i === 0 && "px-6",
                      i === group.headers.length - 1 && "pr-6 text-right"
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const cells = row.getVisibleCells()
              return (
                <TableRow key={row.id}>
                  {cells.map((cell, i) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        i === 0 && "px-6",
                        i === cells.length - 1 &&
                          "pr-6 text-right text-xs text-muted-foreground"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {rows.map(({ id, original: e }) => {
          const name = activityUser(e.userId)?.name ?? "Unknown"
          return (
            <li key={id} className="flex gap-3 px-4 py-3">
              <Avatar className="mt-0.5 size-8 text-xs">
                <AvatarFallback>{initials(name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{name}</span>
                  <span
                    className="shrink-0 text-xs text-muted-foreground"
                    suppressHydrationWarning
                  >
                    {formatTime(e.timestamp)}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs">
                  <StatusBadge
                    status={e.action}
                    variantMap={ACTION_VARIANT}
                    className="text-[10px] capitalize"
                  />
                  <span className="text-muted-foreground">·</span>
                  <span className="truncate text-muted-foreground">
                    {e.resource}
                  </span>
                </div>
                <div className="mt-1.5">
                  <StatusBadge
                    status={e.status}
                    variantMap={STATUS_VARIANT}
                    className="text-[10px] capitalize"
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
