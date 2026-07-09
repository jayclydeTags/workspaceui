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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  PO_STATUS,
  availableQty,
  canReceive,
  eligibleBins,
  receiptStatus,
  remainingToPutAway,
  variance,
  type Bin,
  type QcVerdict,
  type Receipt,
  type ReceiptLine,
} from "../data"

const QC_VARIANT: Record<QcVerdict, "default" | "secondary" | "outline"> = {
  passed: "default",
  pending: "secondary",
  failed: "outline",
}

/** Number input + Record button for checking a line in against an open PO. */
function ReceiveControl({
  line,
  onReceive,
}: {
  line: ReceiptLine
  onReceive: (lineId: string, qty: number) => void
}) {
  const [qty, setQty] = React.useState(String(line.expectedQty))

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`recv-${line.id}`}
          className="text-xs text-muted-foreground"
        >
          Received qty
        </label>
        <Input
          id={`recv-${line.id}`}
          type="number"
          min="0"
          className="w-28"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </div>
      <Button size="sm" onClick={() => onReceive(line.id, Number(qty) || 0)}>
        Record
      </Button>
    </div>
  )
}

/** Bin picker + Put away button for a QC-passed line with units waiting. */
function PutAwayControl({
  line,
  bins,
  warehouse,
  onPutAway,
}: {
  line: ReceiptLine
  bins: Bin[]
  warehouse: string
  onPutAway: (lineId: string, binId: string) => void
}) {
  const options = eligibleBins(line, bins, warehouse)
  const [binId, setBinId] = React.useState<string>("")

  if (options.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No bin in {warehouse} can take {remainingToPutAway(line)} more units.
      </p>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Put away into</label>
        <Select value={binId} onValueChange={(v) => setBinId(v ?? "")}>
          <SelectTrigger
            className="w-40"
            aria-label={`Bin for ${line.sku}`}
          >
            <SelectValue placeholder="Select bin" />
          </SelectTrigger>
          <SelectContent>
            {options.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        size="sm"
        disabled={!binId}
        onClick={() => binId && onPutAway(line.id, binId)}
      >
        Put away
      </Button>
    </div>
  )
}

function LineCard({
  line,
  receipt,
  bins,
  onReceive,
  onQc,
  onPutAway,
}: {
  line: ReceiptLine
  receipt: Receipt
  bins: Bin[]
  onReceive: (lineId: string, qty: number) => void
  onQc: (lineId: string, verdict: QcVerdict) => void
  onPutAway: (lineId: string, binId: string) => void
}) {
  const v = variance(line)
  const open = canReceive(receipt.po)

  return (
    <li className="flex flex-col gap-3 py-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{line.sku}</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {line.receivedQty} / {line.expectedQty} received
            {v !== 0 && (
              <span className={v < 0 ? "text-destructive" : undefined}>
                {" "}
                ({v > 0 ? `+${v}` : v})
              </span>
            )}
            {" · "}
            {availableQty(line)} available
          </p>
        </div>
        <Badge variant={QC_VARIANT[line.qc]}>QC {line.qc}</Badge>
      </div>

      {open && <ReceiveControl line={line} onReceive={onReceive} />}

      {line.receivedQty > 0 && line.qc === "pending" && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onQc(line.id, "passed")}>
            Pass QC
          </Button>
          <Button size="sm" variant="outline" onClick={() => onQc(line.id, "failed")}>
            Fail QC
          </Button>
        </div>
      )}

      {line.qc === "failed" && (
        <p className="text-xs font-medium text-destructive">
          Failed QC — held back from put-away.
        </p>
      )}

      {line.qc === "passed" && remainingToPutAway(line) > 0 && (
        <PutAwayControl
          line={line}
          bins={bins}
          warehouse={receipt.warehouse}
          onPutAway={onPutAway}
        />
      )}

      {line.qc === "passed" && line.binId && remainingToPutAway(line) === 0 && (
        <p className="text-xs text-muted-foreground">
          Put away into bin {bins.find((b) => b.id === line.binId)?.code}.
        </p>
      )}
    </li>
  )
}

export function ReceiptSheet({
  receipt,
  bins,
  open,
  onOpenChange,
  onReceive,
  onQc,
  onPutAway,
}: {
  receipt: Receipt | null
  bins: Bin[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onReceive: (lineId: string, qty: number) => void
  onQc: (lineId: string, verdict: QcVerdict) => void
  onPutAway: (lineId: string, binId: string) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{receipt ? receipt.po : "Receipt"}</SheetTitle>
          <SheetDescription>
            {receipt
              ? `${receipt.vendor} · ${receipt.warehouse} · ${receiptStatus(receipt.lines)}`
              : ""}
          </SheetDescription>
        </SheetHeader>

        {receipt && !canReceive(receipt.po) && (
          <div className="px-4">
            <Alert>
              <AlertTitle>PO {PO_STATUS[receipt.po]}</AlertTitle>
              <AlertDescription>
                {receipt.po} is {PO_STATUS[receipt.po]} — no more stock can be
                received against it.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {receipt && (
          <ul className="flex-1 divide-y divide-border overflow-auto px-4">
            {receipt.lines.map((line) => (
              <LineCard
                key={line.id}
                line={line}
                receipt={receipt}
                bins={bins}
                onReceive={onReceive}
                onQc={onQc}
                onPutAway={onPutAway}
              />
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  )
}
