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
import type { Department } from "../data"

function RowActions({
  dept,
  onEdit,
  onDelete,
}: {
  dept: Department
  onEdit: (dept: Department) => void
  onDelete: (dept: Department) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${dept.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(dept)}>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(dept)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: Department["status"] }) {
  return (
    <Badge
      variant={status === "active" ? "secondary" : "outline"}
      className="capitalize"
    >
      {status}
    </Badge>
  )
}

export function DataTable({
  departments,
  onEdit,
  onDelete,
}: {
  departments: Department[]
  onEdit: (dept: Department) => void
  onDelete: (dept: Department) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="hidden @md:table-cell">Manager</TableHead>
              <TableHead className="text-right">Headcount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="px-6 font-medium">{dept.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{dept.code}</Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {dept.manager}
                </TableCell>
                <TableCell className="text-right">{dept.headcount}</TableCell>
                <TableCell>
                  <StatusBadge status={dept.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    dept={dept}
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
        {departments.map((dept) => (
          <li key={dept.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {dept.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {dept.code}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {dept.manager} · {dept.headcount} people
              </p>
              <div className="mt-1.5">
                <StatusBadge status={dept.status} />
              </div>
            </div>
            <RowActions dept={dept} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
