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
import type { Employee } from "../data"

const STATUS_VARIANT: Record<
  Employee["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "secondary",
  onboarding: "outline",
  terminated: "destructive",
}

function RowActions({
  employee,
  onEdit,
  onDelete,
}: {
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${employee.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(employee)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(employee)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: Employee["status"] }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="capitalize">
      {status}
    </Badge>
  )
}

export function DataTable({
  employees,
  onEdit,
  onDelete,
}: {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden @md:table-cell">
                Department
              </TableHead>
              <TableHead className="hidden @lg:table-cell">Hired</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="px-6">
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {employee.email}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {employee.title}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {employee.department}
                </TableCell>
                <TableCell className="hidden text-muted-foreground @lg:table-cell">
                  {employee.hireDate}
                </TableCell>
                <TableCell>
                  <StatusBadge status={employee.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    employee={employee}
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
        {employees.map((employee) => (
          <li key={employee.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {employee.name}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {employee.title} · {employee.department}
              </p>
              <div className="mt-1.5">
                <StatusBadge status={employee.status} />
              </div>
            </div>
            <RowActions employee={employee} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
