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
  STATE_LABEL,
  progress,
  state,
  type Milestone,
  type MilestoneState,
} from "../data"

const STATE_VARIANT: Record<
  MilestoneState,
  "default" | "secondary" | "outline" | "destructive"
> = {
  completed: "default",
  overdue: "destructive",
  "at-risk": "secondary",
  "on-track": "outline",
}

interface RowProps {
  milestone: Milestone
  onEdit: (milestone: Milestone) => void
  onToggleComplete: (milestone: Milestone) => void
  onDelete: (milestone: Milestone) => void
}

function RowActions({
  milestone,
  onEdit,
  onToggleComplete,
  onDelete,
}: RowProps) {
  const done = milestone.completedOn !== ""
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${milestone.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(milestone)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleComplete(milestone)}>
          {done ? "Reopen" : "Mark complete"}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(milestone)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StateBadge({ milestone }: { milestone: Milestone }) {
  const s = state(milestone)
  return <Badge variant={STATE_VARIANT[s]}>{STATE_LABEL[s]}</Badge>
}

/** ponytail: a bare div bar — the shadcn `progress` primitive isn't installed. */
function Progress({ milestone }: { milestone: Milestone }) {
  const pct = progress(milestone)
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="tabular-nums">
        {milestone.tasksDone}/{milestone.tasksTotal}
      </span>
    </span>
  )
}

export function DataTable({
  milestones,
  onEdit,
  onToggleComplete,
  onDelete,
}: {
  milestones: Milestone[]
  onEdit: (milestone: Milestone) => void
  onToggleComplete: (milestone: Milestone) => void
  onDelete: (milestone: Milestone) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Milestone</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="hidden @md:table-cell">Owner</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {milestones.map((milestone) => (
              <TableRow key={milestone.id}>
                <TableCell className="px-6 font-medium">
                  {milestone.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {milestone.project}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {milestone.owner}
                </TableCell>
                <TableCell className="tabular-nums">{milestone.due}</TableCell>
                <TableCell>
                  <Progress milestone={milestone} />
                </TableCell>
                <TableCell>
                  <StateBadge milestone={milestone} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    milestone={milestone}
                    onEdit={onEdit}
                    onToggleComplete={onToggleComplete}
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
        {milestones.map((milestone) => (
          <li key={milestone.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {milestone.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {milestone.project}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {milestone.owner} · due {milestone.due}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <StateBadge milestone={milestone} />
                <Progress milestone={milestone} />
              </div>
            </div>
            <RowActions
              milestone={milestone}
              onEdit={onEdit}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
