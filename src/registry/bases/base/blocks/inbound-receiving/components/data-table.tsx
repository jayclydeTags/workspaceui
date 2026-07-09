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
  receiptStatus,
  variance,
  type Receipt,
  type ReceiptStatus,
} from "../data"

const STATUS_VARIANT: Record<
  ReceiptStatus,
  "default" | "secondary" | "outline"
> = {
  "put-away": "default",
  received: "secondary",
  partial: "outline",
  expected: "outline",
}

const STATUS_LABEL: Record<ReceiptStatus, string> = {
  "put-away": "put away",
  received: "received",
  partial: "partial",
  expected: "expected",
}

/** Total received vs expected across a receipt's lines, plus net variance. */
function totals(receipt: Receipt) {
  const expected = receipt.lines.reduce((n, l) => n + l.expectedQty, 0)
  const received = receipt.lines.reduce((n, l) => n + l.receivedQty, 0)
  const varTotal = receipt.lines.reduce((n, l) => n + variance(l), 0)
  return { expected, received, varTotal }
}

function VarianceCell({ value }: { value: number }) {
  if (value === 0) return <span className="text-muted-foreground">—</span>
  return (
    <span className={value < 0 ? "font-medium text-destructive" : "font-medium"}>
      {value > 0 ? `+${value}` : value}
    </span>
  )
}

export function DataTable({
  receipts,
  onOpen,
}: {
  receipts: Receipt[]
  onOpen: (receipt: Receipt) => void
}) {
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="px-6">PO</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead className="hidden @md:table-cell">Warehouse</TableHead>
            <TableHead className="text-right">Received / Expected</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0 pr-6" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => {
            const status = receiptStatus(receipt.lines)
            const { expected, received, varTotal } = totals(receipt)
            return (
              <TableRow key={receipt.id}>
                <TableCell className="px-6 font-medium">{receipt.po}</TableCell>
                <TableCell className="text-muted-foreground">
                  {receipt.vendor}
                </TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {receipt.warehouse}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {received} / {expected}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <VarianceCell value={varTotal} />
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[status]}>
                    {STATUS_LABEL[status]}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen(receipt)}
                    aria-label={`Open receipt ${receipt.po}`}
                  >
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
