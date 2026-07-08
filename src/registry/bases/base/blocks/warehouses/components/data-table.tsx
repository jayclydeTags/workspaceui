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
import { utilization, type Warehouse } from "../data"

function RowActions({
  warehouse,
  onEdit,
  onDelete,
}: {
  warehouse: Warehouse
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${warehouse.code}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(warehouse)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(warehouse)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: Warehouse["status"] }) {
  return (
    <Badge
      variant={status === "active" ? "default" : "outline"}
      className="capitalize"
    >
      {status}
    </Badge>
  )
}

/** "9,400 / 12,000 (78%)" — near-full (≥ 90%) reads as a warning. */
function Utilization({ warehouse }: { warehouse: Warehouse }) {
  const pct = utilization(warehouse)
  return (
    <span className={pct >= 90 ? "font-medium text-destructive" : undefined}>
      {warehouse.used.toLocaleString()} / {warehouse.capacity.toLocaleString()}{" "}
      ({pct}%)
    </span>
  )
}

export function DataTable({
  warehouses,
  onEdit,
  onDelete,
}: {
  warehouses: Warehouse[]
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
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
              <TableHead className="hidden @md:table-cell">Location</TableHead>
              <TableHead className="text-right">Utilization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell className="px-6 font-medium">
                  {warehouse.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {warehouse.code}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {warehouse.location}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <Utilization warehouse={warehouse} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={warehouse.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    warehouse={warehouse}
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
        {warehouses.map((warehouse) => (
          <li key={warehouse.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {warehouse.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {warehouse.code}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {warehouse.location} · <Utilization warehouse={warehouse} />
              </p>
              <div className="mt-1.5">
                <StatusBadge status={warehouse.status} />
              </div>
            </div>
            <RowActions
              warehouse={warehouse}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
