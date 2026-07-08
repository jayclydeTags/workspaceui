import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  status,
  type Instalment,
  type InstalmentStatus,
} from "../data"

const STATUS_VARIANT: Record<
  InstalmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "default",
  due: "secondary",
  overdue: "destructive",
  scheduled: "outline",
}

export function ScheduleTable({
  rows,
  nextN,
  onPay,
}: {
  rows: Instalment[]
  /** Instalment number of the earliest unpaid row — the only payable one. */
  nextN: number | undefined
  onPay: (instalment: Instalment) => void
}) {
  const Status = ({ row }: { row: Instalment }) => {
    const s = status(row)
    return <Badge variant={STATUS_VARIANT[s]}>{s}</Badge>
  }

  const PayButton = ({ row }: { row: Instalment }) =>
    row.n === nextN ? (
      <Button size="sm" onClick={() => onPay(row)}>
        Record payment
      </Button>
    ) : null

  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">#</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              <TableHead className="hidden text-right @md:table-cell">
                Interest
              </TableHead>
              <TableHead className="hidden text-right @md:table-cell">
                Principal
              </TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.n}>
                <TableCell className="px-6 tabular-nums text-muted-foreground">
                  {row.n}
                </TableCell>
                <TableCell className="tabular-nums">{row.due}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(row.payment)}
                </TableCell>
                <TableCell className="hidden text-right tabular-nums text-muted-foreground @md:table-cell">
                  {formatCurrency(row.interest)}
                </TableCell>
                <TableCell className="hidden text-right tabular-nums text-muted-foreground @md:table-cell">
                  {formatCurrency(row.principal)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(row.balance)}
                </TableCell>
                <TableCell>
                  <Status row={row} />
                </TableCell>
                <TableCell className="pr-6">
                  <PayButton row={row} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {rows.map((row) => (
          <li key={row.n} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(row.payment)}
                </span>
                <Badge variant="outline" className="text-[10px] tabular-nums">
                  #{row.n}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs tabular-nums text-muted-foreground">
                Due {row.due} · balance {formatCurrency(row.balance)}
              </p>
              <div className="mt-1.5">
                <Status row={row} />
              </div>
            </div>
            <PayButton row={row} />
          </li>
        ))}
      </ul>
    </>
  )
}
