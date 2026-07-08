import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatQuantity, type Movement } from "../data"

const TYPE_VARIANT: Record<
  Movement["type"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  receipt: "default",
  shipment: "secondary",
  adjustment: "outline",
  transfer: "outline",
}

function TypeBadge({ type }: { type: Movement["type"] }) {
  return (
    <Badge variant={TYPE_VARIANT[type]} className="capitalize">
      {type}
    </Badge>
  )
}

function Quantity({ quantity }: { quantity: number }) {
  return (
    <span
      className={
        quantity < 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
      }
    >
      {formatQuantity(quantity)}
    </span>
  )
}

export function DataTable({ movements }: { movements: Movement[] }) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Date</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="hidden @md:table-cell">Warehouse</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="hidden pr-6 @md:table-cell">
                Reference
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="px-6 font-medium">
                  {movement.date}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {movement.sku}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {movement.warehouse}
                </TableCell>
                <TableCell>
                  <TypeBadge type={movement.type} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <Quantity quantity={movement.quantity} />
                </TableCell>
                <TableCell className="hidden pr-6 text-muted-foreground @md:table-cell">
                  {movement.reference}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {movements.map((movement) => (
          <li key={movement.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {movement.sku}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {movement.warehouse}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {movement.date} · {movement.reference}
              </p>
              <div className="mt-1.5">
                <TypeBadge type={movement.type} />
              </div>
            </div>
            <span className="text-sm tabular-nums">
              <Quantity quantity={movement.quantity} />
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
