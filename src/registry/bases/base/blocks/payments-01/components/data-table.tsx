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
import { METHOD_LABEL, formatCurrency, type Payment } from "../data"

const STATUS_VARIANT: Record<
  Payment["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  cleared: "secondary",
  failed: "destructive",
}

function RowActions({
  payment,
  onEdit,
  onDelete,
}: {
  payment: Payment
  onEdit: (payment: Payment) => void
  onDelete: (payment: Payment) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${payment.reference}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(payment)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(payment)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: Payment["status"] }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="capitalize">
      {status}
    </Badge>
  )
}

export function DataTable({
  payments,
  onEdit,
  onDelete,
}: {
  payments: Payment[]
  onEdit: (payment: Payment) => void
  onDelete: (payment: Payment) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Payee</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="hidden @md:table-cell">
                Reference
              </TableHead>
              <TableHead className="hidden @lg:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="px-6 font-medium">
                  {payment.payee}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {METHOD_LABEL[payment.method]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {payment.reference}
                </TableCell>
                <TableCell className="hidden text-muted-foreground @lg:table-cell">
                  {payment.date}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    payment={payment}
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
        {payments.map((payment) => (
          <li key={payment.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {payment.payee}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {METHOD_LABEL[payment.method]}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {payment.reference} · {formatCurrency(payment.amount)}
              </p>
              <div className="mt-1.5">
                <StatusBadge status={payment.status} />
              </div>
            </div>
            <RowActions payment={payment} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
