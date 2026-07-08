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
import { isOverdue, type Project, type ProjectStatus } from "../data"

const STATUS_VARIANT: Record<
  ProjectStatus,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  planning: "outline",
  "on-hold": "secondary",
  completed: "secondary",
}

interface RowProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

function RowActions({ project, onEdit, onDelete }: RowProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${project.code}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(project)}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(project)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
}

/** ponytail: a bare div bar — the shadcn `progress` primitive isn't installed. */
function Progress({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="tabular-nums">{value}%</span>
    </span>
  )
}

/** A due date that has passed on an unfinished project reads as a warning. */
function Due({ project }: { project: Project }) {
  return (
    <span className={isOverdue(project) ? "font-medium text-destructive" : undefined}>
      {project.due}
    </span>
  )
}

export function DataTable({
  projects,
  onEdit,
  onDelete,
}: {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Project</TableHead>
              <TableHead className="hidden @md:table-cell">Client</TableHead>
              <TableHead className="hidden @md:table-cell">Lead</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="px-6">
                  <span className="font-medium">{project.name}</span>{" "}
                  <span className="text-muted-foreground">{project.code}</span>
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {project.client}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {project.lead}
                </TableCell>
                <TableCell className="tabular-nums">
                  <Due project={project} />
                </TableCell>
                <TableCell>
                  <Progress value={project.progress} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    project={project}
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
        {projects.map((project) => (
          <li key={project.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {project.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {project.code}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {project.client} · {project.lead} · due{" "}
                <Due project={project} />
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <StatusBadge status={project.status} />
                <Progress value={project.progress} />
              </div>
            </div>
            <RowActions
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
