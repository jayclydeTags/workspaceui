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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  ORDER_STATUS,
  binsWithStock,
  canCompletePick,
  canPick,
  isLineClosed,
  pickStatus,
  pickedQty,
  remainingToPick,
  shortfall,
  type Bin,
  type PickLine,
  type PickList,
} from "../data"

/** Bin picker + qty + Allocate button for a line still short on units. */
function AllocateControl({
  line,
  bins,
  warehouse,
  onAllocate,
}: {
  line: PickLine
  bins: Bin[]
  warehouse: string
  onAllocate: (lineId: string, binId: string, qty: number) => void
}) {
  const options = binsWithStock(line, bins, warehouse)
  const [binId, setBinId] = React.useState<string>("")
  const [qty, setQty] = React.useState<string>("")

  if (options.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No bin in {warehouse} holds {line.sku} — short-pick to close the line.
      </p>
    )
  }

  const selected = options.find((b) => b.id === binId)
  // Cap the draw at what the bin holds and what the line still needs.
  const max = selected ? Math.min(selected.qty, remainingToPick(line)) : 0
  const n = Number(qty) || 0
  const valid = selected != null && n > 0 && n <= max

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Pick from</label>
        <Select
          value={binId}
          onValueChange={(v) => {
            setBinId(v ?? "")
            const b = options.find((o) => o.id === v)
            if (b) setQty(String(Math.min(b.qty, remainingToPick(line))))
          }}
        >
          <SelectTrigger className="w-36" aria-label={`Bin for ${line.sku}`}>
            <SelectValue placeholder="Select bin" />
          </SelectTrigger>
          <SelectContent>
            {options.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.code} ({b.qty})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`qty-${line.id}`}
          className="text-xs text-muted-foreground"
        >
          Qty
        </label>
        <Input
          id={`qty-${line.id}`}
          type="number"
          min="0"
          max={max || undefined}
          className="w-20"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </div>
      <Button
        size="sm"
        disabled={!valid}
        onClick={() => valid && onAllocate(line.id, binId, n)}
      >
        Allocate
      </Button>
    </div>
  )
}

function LineCard({
  line,
  list,
  bins,
  onAllocate,
  onShort,
}: {
  line: PickLine
  list: PickList
  bins: Bin[]
  onAllocate: (lineId: string, binId: string, qty: number) => void
  onShort: (lineId: string) => void
}) {
  const picked = pickedQty(line)
  const workable = canPick(list) && list.picker !== null && !list.completed
  const short = shortfall(line)

  return (
    <li className="flex flex-col gap-3 py-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{line.sku}</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {picked} / {line.requestedQty} picked
            {line.short && short > 0 && (
              <span className="text-destructive"> (short {short})</span>
            )}
          </p>
        </div>
        {isLineClosed(line) && (
          <Badge variant={line.short ? "outline" : "default"}>
            {line.short ? "short" : "picked"}
          </Badge>
        )}
      </div>

      {line.allocations.length > 0 && (
        <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {line.allocations.map((a, i) => (
            <li key={i} className="tabular-nums">
              {a.qty} from bin {bins.find((b) => b.id === a.binId)?.code ?? a.binId}
            </li>
          ))}
        </ul>
      )}

      {workable && !isLineClosed(line) && (
        <>
          <AllocateControl
            line={line}
            bins={bins}
            warehouse={list.warehouse}
            onAllocate={onAllocate}
          />
          <Button
            size="sm"
            variant="outline"
            className="self-start"
            onClick={() => onShort(line.id)}
          >
            Short-pick
          </Button>
        </>
      )}
    </li>
  )
}

export function PickSheet({
  list,
  bins,
  open,
  onOpenChange,
  onClaim,
  onAllocate,
  onShort,
  onComplete,
}: {
  list: PickList | null
  bins: Bin[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaim: (name: string) => void
  onAllocate: (lineId: string, binId: string, qty: number) => void
  onShort: (lineId: string) => void
  onComplete: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{list ? list.orderId : "Pick list"}</SheetTitle>
          <SheetDescription>
            {list
              ? `${list.warehouse} · ${pickStatus(list)}${
                  list.picker ? ` · ${list.picker}` : ""
                }`
              : ""}
          </SheetDescription>
        </SheetHeader>

        {list && !canPick(list) && (
          <div className="px-4">
            <Alert>
              <AlertTitle>Order {ORDER_STATUS[list.orderId]}</AlertTitle>
              <AlertDescription>
                {list.orderId} is {ORDER_STATUS[list.orderId]} — it can no longer
                be picked.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {list && canPick(list) && list.picker === null && (
          <div className="px-4">
            <Button size="sm" onClick={() => onClaim("You")}>
              Claim to start picking
            </Button>
          </div>
        )}

        {list && (
          <ul className="flex-1 divide-y divide-border overflow-auto px-4">
            {list.lines.map((line) => (
              <LineCard
                key={line.id}
                line={line}
                list={list}
                bins={bins}
                onAllocate={onAllocate}
                onShort={onShort}
              />
            ))}
          </ul>
        )}

        {list && (
          <SheetFooter>
            <Button disabled={!canCompletePick(list)} onClick={onComplete}>
              {list.completed ? "Completed" : "Complete pick"}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
