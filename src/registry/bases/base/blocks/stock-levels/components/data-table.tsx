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
import { stockStatus, type StockLevel } from "../data"

const STATUS_LABEL: Record<ReturnType<typeof stockStatus>, string> = {
  "in-stock": "In stock",
  low: "Low",
  "out-of-stock": "Out of stock",
}

const STATUS_VARIANT: Record<
  ReturnType<typeof stockStatus>,
  "default" | "secondary" | "destructive" | "outline"
> = {
  "in-stock": "secondary",
  low: "default",
  "out-of-stock": "destructive",
}

function StatusBadge({ stock }: { stock: StockLevel }) {
  const status = stockStatus(stock)
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
}

function AdjustButton({
  stock,
  onAdjust,
}: {
  stock: StockLevel
  onAdjust: (stock: StockLevel) => void
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label={`Adjust ${stock.sku} at ${stock.warehouse}`}
      onClick={() => onAdjust(stock)}
    >
      Adjust
    </Button>
  )
}

export function DataTable({
  levels,
  onAdjust,
}: {
  levels: StockLevel[]
  onAdjust: (stock: StockLevel) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="hidden @md:table-cell">Warehouse</TableHead>
              <TableHead className="text-right">On hand</TableHead>
              <TableHead className="hidden text-right @md:table-cell">
                Reorder at
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell className="px-6 font-medium">
                  {stock.product}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {stock.sku}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {stock.warehouse}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {stock.onHand.toLocaleString()}
                </TableCell>
                <TableCell className="hidden text-right tabular-nums text-muted-foreground @md:table-cell">
                  {stock.reorderPoint.toLocaleString()}
                </TableCell>
                <TableCell>
                  <StatusBadge stock={stock} />
                </TableCell>
                <TableCell className="pr-6">
                  <AdjustButton stock={stock} onAdjust={onAdjust} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {levels.map((stock) => (
          <li key={stock.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {stock.product}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {stock.sku}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {stock.warehouse} · {stock.onHand.toLocaleString()} on hand
              </p>
              <div className="mt-1.5">
                <StatusBadge stock={stock} />
              </div>
            </div>
            <AdjustButton stock={stock} onAdjust={onAdjust} />
          </li>
        ))}
      </ul>
    </>
  )
}
