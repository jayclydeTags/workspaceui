import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  hoursWorked,
  type AttendanceEntry,
  type AttendanceStatus,
} from "../data"

const STATUS_VARIANT: Record<
  AttendanceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  present: "default",
  late: "secondary",
  leave: "outline",
  absent: "destructive",
}

interface RowProps {
  entry: AttendanceEntry
  onEdit: (entry: AttendanceEntry) => void
  onDelete: (entry: AttendanceEntry) => void
}

function RowActions({ entry, onEdit, onDelete }: RowProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${entry.employee} on ${entry.date}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(entry)}>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(entry)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="capitalize">
      {status}
    </Badge>
  )
}

const Punches = ({ entry }: { entry: AttendanceEntry }) =>
  entry.clockIn ? (
    <>
      {entry.clockIn} – {entry.clockOut || "—"}
    </>
  ) : (
    <span className="text-muted-foreground">No punches</span>
  )

const Hours = ({ entry }: { entry: AttendanceEntry }) => {
  const h = hoursWorked(entry)
  return <>{h ? `${h.toFixed(1)}h` : "—"}</>
}

export function DataTable({
  entries,
  onEdit,
  onDelete,
}: {
  entries: AttendanceEntry[]
  onEdit: (entry: AttendanceEntry) => void
  onDelete: (entry: AttendanceEntry) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Employee</TableHead>
              <TableHead className="hidden @md:table-cell">Date</TableHead>
              <TableHead>Clock in / out</TableHead>
              <TableHead className="text-right">Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="px-6 font-medium">
                  {entry.employee}
                </TableCell>
                <TableCell className="hidden tabular-nums text-muted-foreground @md:table-cell">
                  {entry.date}
                </TableCell>
                <TableCell className="tabular-nums">
                  <Punches entry={entry} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <Hours entry={entry} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={entry.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    entry={entry}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {entry.employee}
                </span>
                <Badge variant="outline" className="text-[10px] tabular-nums">
                  {entry.date}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                <Punches entry={entry} /> · <Hours entry={entry} />
              </p>
              <div className="mt-1.5">
                <StatusBadge status={entry.status} />
              </div>
            </div>
            <RowActions entry={entry} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
