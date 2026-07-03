import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ActivityEntry, ActionType, StatusType } from "../data"

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return date.toLocaleDateString()
}

const STATUS_VARIANT: Record<StatusType, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  failed:  "destructive",
  pending: "secondary",
}

const ACTION_VARIANT: Record<ActionType, "default" | "secondary" | "destructive" | "outline"> = {
  created:  "default",
  updated:  "secondary",
  deleted:  "destructive",
  viewed:   "outline",
  shared:   "secondary",
  exported: "outline",
}

// ── DataTable ──────────────────────────────────────────────────────────────

export function DataTable({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No matching events</EmptyTitle>
          <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="hidden @md:table-cell">Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="px-6">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7 text-[10px]">
                      <AvatarFallback>{e.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{e.user}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={ACTION_VARIANT[e.action]} className="capitalize text-[11px]">
                    {e.action}
                  </Badge>
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  <p className="max-w-[200px] truncate">{e.resource}</p>
                  <p className="text-xs text-muted-foreground">{e.resourceType}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[e.status]} className="capitalize text-[11px]">
                    {e.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6 text-right text-xs text-muted-foreground">
                  {formatTime(e.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {entries.map((e) => (
          <li key={e.id} className="flex gap-3 px-4 py-3">
            <Avatar className="mt-0.5 size-8 text-xs">
              <AvatarFallback>{e.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{e.user}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatTime(e.timestamp)}</span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs">
                <Badge variant={ACTION_VARIANT[e.action]} className="capitalize text-[10px]">
                  {e.action}
                </Badge>
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
