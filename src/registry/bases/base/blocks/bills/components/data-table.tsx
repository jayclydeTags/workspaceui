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
import { formatCurrency, type Bill } from "../data"

const STATUS_VARIANT: Record<
  Bill["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  open: "default",
  paid: "secondary",
  overdue: "destructive",
}

function RowActions({
  bill,
  onEdit,
  onDelete,
}: {
  bill: Bill
  onEdit: (bill: Bill) => void
  onDelete: (bill: Bill) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${bill.billNumber}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(bill)}>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(bill)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: Bill["status"] }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="capitalize">
      {status}
    </Badge>
  )
}

export function DataTable({
  bills,
  onEdit,
  onDelete,
}: {
  bills: Bill[]
  onEdit: (bill: Bill) => void
  onDelete: (bill: Bill) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Vendor</TableHead>
              <TableHead>Bill #</TableHead>
              <TableHead className="hidden @md:table-cell">Due date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="px-6 font-medium">
                  {bill.vendor}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {bill.billNumber}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {bill.dueDate}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(bill.amount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={bill.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions bill={bill} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {bills.map((bill) => (
          <li key={bill.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {bill.vendor}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {bill.billNumber}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Due {bill.dueDate} · {formatCurrency(bill.amount)}
              </p>
              <div className="mt-1.5">
                <StatusBadge status={bill.status} />
              </div>
            </div>
            <RowActions bill={bill} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
