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
import { StatusBadge } from "@/registry/bases/base/workspaceui/status-badge"
import {
  pickFor,
  isPartiallyPicked,
  shipmentStatus,
  type Shipment,
  type ShipmentStatus,
} from "../data"

const STATUS_VARIANT: Record<
  ShipmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  delivered: "default",
  shipped: "secondary",
  "ready-to-ship": "outline",
  exception: "destructive",
  cancelled: "outline",
}

export function DataTable({
  shipments,
  onOpen,
}: {
  shipments: Shipment[]
  onOpen: (shipment: Shipment) => void
}) {
  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="px-6">Order</TableHead>
            <TableHead className="hidden @md:table-cell">Carrier</TableHead>
            <TableHead className="hidden @lg:table-cell">Tracking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0 pr-6" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => {
            const status = shipmentStatus(shipment)
            const partial = isPartiallyPicked(pickFor(shipment))
            return (
              <TableRow key={shipment.id}>
                <TableCell className="px-6">
                  <span className="font-medium">{shipment.orderId}</span>
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  <span className="text-muted-foreground">
                    {shipment.carrier ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="hidden @lg:table-cell">
                  <span className="text-muted-foreground tabular-nums">
                    {shipment.trackingNumber ?? "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
                    <StatusBadge status={status} variantMap={STATUS_VARIANT} />
                    {partial && status === "ready-to-ship" && (
                      <Badge variant="outline">short pick</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen(shipment)}
                    aria-label={`Open shipment for ${shipment.orderId}`}
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
