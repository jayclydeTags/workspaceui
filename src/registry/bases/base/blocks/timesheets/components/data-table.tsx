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
import { isLocked, type EntryStatus, type TimeEntry } from "../data"

const STATUS_VARIANT: Record<EntryStatus, "default" | "secondary" | "outline"> =
  {
    approved: "default",
    submitted: "secondary",
    draft: "outline",
  }

interface RowProps {
  entry: TimeEntry
  onEdit: (entry: TimeEntry) => void
  onAdvance: (entry: TimeEntry) => void
  onDelete: (entry: TimeEntry) => void
}

/** A draft can be edited, submitted, or deleted; a submitted entry only approved. */
function RowActions({ entry, onEdit, onAdvance, onDelete }: RowProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${entry.task}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {entry.status === "draft" && (
          <>
            <DropdownMenuItem onClick={() => onEdit(entry)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAdvance(entry)}>
              Submit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(entry)}>
              Delete
            </DropdownMenuItem>
          </>
        )}
        {entry.status === "submitted" && (
          <DropdownMenuItem onClick={() => onAdvance(entry)}>
            Approve
          </DropdownMenuItem>
        )}
        {entry.status === "approved" && (
          <DropdownMenuItem disabled>Locked</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Hours = ({ entry }: { entry: TimeEntry }) => (
  <>
    {entry.hours.toFixed(1)}h{" "}
    {!entry.billable && (
      <span className="text-muted-foreground">· non-billable</span>
    )}
  </>
)

export function DataTable({
  entries,
  onEdit,
  onAdvance,
  onDelete,
}: {
  entries: TimeEntry[]
  onEdit: (entry: TimeEntry) => void
  onAdvance: (entry: TimeEntry) => void
  onDelete: (entry: TimeEntry) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Member</TableHead>
              <TableHead className="hidden @md:table-cell">Project</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} data-locked={isLocked(entry) || undefined}>
                <TableCell className="px-6 font-medium">{entry.member}</TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {entry.project}
                </TableCell>
                <TableCell>{entry.task}</TableCell>
                <TableCell className="tabular-nums">{entry.date}</TableCell>
                <TableCell className="text-right tabular-nums">
                  <Hours entry={entry} />
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[entry.status]}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    entry={entry}
                    onEdit={onEdit}
                    onAdvance={onAdvance}
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
                  {entry.member}
                </span>
                <Badge variant={STATUS_VARIANT[entry.status]} className="text-[10px]">
                  {entry.status}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {entry.task} · {entry.date} · <Hours entry={entry} />
              </p>
            </div>
            <RowActions
              entry={entry}
              onEdit={onEdit}
              onAdvance={onAdvance}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
