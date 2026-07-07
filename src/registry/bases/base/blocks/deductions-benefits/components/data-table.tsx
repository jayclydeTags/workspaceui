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
import { formatAmount, type DeductionBenefit } from "../data"

function RowActions({
  item,
  onEdit,
  onDelete,
}: {
  item: DeductionBenefit
  onEdit: (item: DeductionBenefit) => void
  onDelete: (item: DeductionBenefit) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${item.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: DeductionBenefit["status"] }) {
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
  items,
  onEdit,
  onDelete,
}: {
  items: DeductionBenefit[]
  onEdit: (item: DeductionBenefit) => void
  onDelete: (item: DeductionBenefit) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden @md:table-cell">Amount</TableHead>
              <TableHead className="hidden @lg:table-cell">Pre-tax</TableHead>
              <TableHead className="text-right">Enrolled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-6 font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {formatAmount(item)}
                </TableCell>
                <TableCell className="hidden @lg:table-cell">
                  {item.preTax ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-right">{item.enrolled}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {item.name}
                </span>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {item.type}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {formatAmount(item)} · {item.enrolled} enrolled
              </p>
              <div className="mt-1.5">
                <StatusBadge status={item.status} />
              </div>
            </div>
            <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
