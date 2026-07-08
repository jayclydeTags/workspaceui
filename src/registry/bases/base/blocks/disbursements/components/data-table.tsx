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
  formatCurrency,
  isPending,
  type Disbursement,
  type DisbursementStatus,
} from "../data"

const STATUS_VARIANT: Record<
  DisbursementStatus,
  "default" | "secondary" | "destructive"
> = {
  released: "default",
  scheduled: "secondary",
  failed: "destructive",
}

interface RowProps {
  disbursement: Disbursement
  onEdit: (disbursement: Disbursement) => void
  onSettle: (disbursement: Disbursement, status: DisbursementStatus) => void
  onDelete: (disbursement: Disbursement) => void
}

/** Released or failed money is history — only a scheduled tranche is mutable. */
function RowActions({ disbursement, onEdit, onSettle, onDelete }: RowProps) {
  const pending = isPending(disbursement)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${disbursement.loan} ${formatCurrency(disbursement.amount)}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {pending ? (
          <>
            <DropdownMenuItem onClick={() => onEdit(disbursement)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSettle(disbursement, "released")}>
              Release
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSettle(disbursement, "failed")}>
              Mark failed
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(disbursement)}
            >
              Delete
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled>Settled</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DataTable({
  disbursements,
  onEdit,
  onSettle,
  onDelete,
}: {
  disbursements: Disbursement[]
  onEdit: (disbursement: Disbursement) => void
  onSettle: (disbursement: Disbursement, status: DisbursementStatus) => void
  onDelete: (disbursement: Disbursement) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Loan</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden @md:table-cell">Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {disbursements.map((disbursement) => (
              <TableRow key={disbursement.id}>
                <TableCell className="px-6 font-medium">
                  {disbursement.loan}
                </TableCell>
                <TableCell>{disbursement.borrower}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(disbursement.amount)}
                </TableCell>
                <TableCell className="hidden text-muted-foreground uppercase @md:table-cell">
                  {disbursement.method}
                </TableCell>
                <TableCell className="tabular-nums">{disbursement.date}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[disbursement.status]}>
                    {disbursement.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    disbursement={disbursement}
                    onEdit={onEdit}
                    onSettle={onSettle}
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
        {disbursements.map((disbursement) => (
          <li key={disbursement.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium tabular-nums">
                  {formatCurrency(disbursement.amount)}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {disbursement.loan}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {disbursement.borrower} · {disbursement.date}
              </p>
              <div className="mt-1.5">
                <Badge variant={STATUS_VARIANT[disbursement.status]}>
                  {disbursement.status}
                </Badge>
              </div>
            </div>
            <RowActions
              disbursement={disbursement}
              onEdit={onEdit}
              onSettle={onSettle}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
