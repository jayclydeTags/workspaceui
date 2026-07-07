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
import { formatCurrency, totalDebits, type JournalEntry } from "../data"

function RowActions({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry
  onEdit: (entry: JournalEntry) => void
  onDelete: (entry: JournalEntry) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${entry.reference}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(entry)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(entry)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: JournalEntry["status"] }) {
  return (
    <Badge
      variant={status === "posted" ? "secondary" : "outline"}
      className="capitalize"
    >
      {status}
    </Badge>
  )
}

export function DataTable({
  entries,
  onEdit,
  onDelete,
}: {
  entries: JournalEntry[]
  onEdit: (entry: JournalEntry) => void
  onDelete: (entry: JournalEntry) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Reference</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead className="hidden @md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="px-6 font-medium">
                  {entry.reference}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {entry.memo}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {entry.date}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalDebits(entry.lines))}
                </TableCell>
                <TableCell>
                  <StatusBadge status={entry.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions entry={entry} onEdit={onEdit} onDelete={onDelete} />
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
                  {entry.reference}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {entry.memo} · {formatCurrency(totalDebits(entry.lines))}
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
