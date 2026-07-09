"use client"

import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CARRIERS,
  canCancel,
  canDeliver,
  canFlagException,
  canMarkShipped,
  canShip,
  lineShortfall,
  pickFor,
  shipmentStatus,
  totalShortfall,
  type Shipment,
} from "../data"

export function ShipmentSheet({
  shipment,
  open,
  onOpenChange,
  onCarrierChange,
  onTrackingChange,
  onShip,
  onDeliver,
  onCancel,
  onException,
}: {
  shipment: Shipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCarrierChange: (carrier: string) => void
  onTrackingChange: (tracking: string) => void
  onShip: () => void
  onDeliver: () => void
  onCancel: () => void
  onException: (reason: string) => void
}) {
  // Cleared whenever the sheet closes, so each shipment opens on a blank draft.
  const [reason, setReason] = React.useState("")

  const pick = shipment ? pickFor(shipment) : null
  const status = shipment ? shipmentStatus(shipment) : null
  const shippable = shipment && pick ? canShip(pick) : false
  const readyToShip = shipment && pick ? canMarkShipped(shipment, pick) : false

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("")
        onOpenChange(next)
      }}
    >
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{shipment ? shipment.orderId : "Shipment"}</SheetTitle>
          <SheetDescription>
            {shipment ? `Pick ${shipment.pickId}` : ""}
          </SheetDescription>
        </SheetHeader>

        {shipment && pick && (
          <div className="flex flex-1 flex-col gap-4 overflow-auto px-4">
            <div className="flex flex-wrap items-center gap-1">
              <Badge
                variant={
                  status === "delivered"
                    ? "default"
                    : status === "shipped"
                      ? "secondary"
                      : status === "exception"
                        ? "destructive"
                        : "outline"
                }
              >
                {status}
              </Badge>
              {!shippable && status === "ready-to-ship" && (
                <Badge variant="outline">short pick</Badge>
              )}
            </div>

            {!shippable && status === "ready-to-ship" && (
              <Alert>
                <AlertTitle>Order was not picked in full</AlertTitle>
                <AlertDescription>
                  The pick closed {totalShortfall(pick)} units short, so this
                  order can&apos;t ship. Re-pick it or raise a back-order in
                  Outbound, then cancel this shipment.
                </AlertDescription>
              </Alert>
            )}

            {status === "exception" && (
              <Alert>
                <AlertTitle>Exception</AlertTitle>
                <AlertDescription>{shipment.exception}</AlertDescription>
              </Alert>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Requested</TableHead>
                  <TableHead className="text-right">Picked</TableHead>
                  <TableHead className="text-right">Short</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pick.lines.map((line) => {
                  const short = lineShortfall(line)
                  return (
                    <TableRow key={line.sku}>
                      <TableCell className="font-medium">{line.sku}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {line.requestedQty}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {line.pickedQty}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {short > 0 ? (
                          <span className="text-destructive">{short}</span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <Separator />

            {status === "ready-to-ship" ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">
                    Carrier
                  </label>
                  <Select
                    value={shipment.carrier ?? ""}
                    onValueChange={(v) => onCarrierChange(v ?? "")}
                  >
                    <SelectTrigger aria-label="Carrier">
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARRIERS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs text-muted-foreground"
                    htmlFor="tracking"
                  >
                    Tracking number
                  </label>
                  <Input
                    id="tracking"
                    value={shipment.trackingNumber ?? ""}
                    onChange={(e) => onTrackingChange(e.target.value)}
                    placeholder="Required before shipping"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <Row label="Carrier" value={shipment.carrier ?? "—"} />
                <Row label="Tracking" value={shipment.trackingNumber ?? "—"} />
                {shipment.shippedAt && (
                  <Row label="Shipped" value={shipment.shippedAt} />
                )}
                {shipment.deliveredAt && (
                  <Row label="Delivered" value={shipment.deliveredAt} />
                )}
              </div>
            )}

            {canFlagException(shipment) && (
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="exception"
                >
                  Exception reason
                </label>
                <Input
                  id="exception"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="What the carrier reported"
                />
              </div>
            )}
          </div>
        )}

        {shipment && (
          <SheetFooter className="flex-row justify-end">
            {canCancel(shipment) && (
              <Button variant="outline" onClick={onCancel}>
                Cancel shipment
              </Button>
            )}
            {canFlagException(shipment) && (
              <Button
                variant="outline"
                disabled={reason.trim() === ""}
                onClick={() => {
                  onException(reason.trim())
                  setReason("")
                }}
              >
                Flag exception
              </Button>
            )}
            {canDeliver(shipment) && (
              <Button onClick={onDeliver}>Mark delivered</Button>
            )}
            {status === "ready-to-ship" && (
              <Button disabled={!readyToShip} onClick={onShip}>
                Mark shipped
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm tabular-nums">{value}</span>
    </div>
  )
}
