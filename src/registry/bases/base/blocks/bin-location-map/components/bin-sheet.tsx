import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
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
  SKUS,
  canAssign,
  remainingCapacity,
  type Assignment,
  type Bin,
} from "../data"

const STATUS_BADGE_VARIANT: Record<Bin["status"], "default" | "outline" | "secondary"> = {
  active: "default",
  blocked: "outline",
  quarantine: "secondary",
}

export function BinSheet({
  bin,
  open,
  onOpenChange,
  onAssign,
  onClear,
  onEdit,
  onDelete,
}: {
  bin: Bin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (bin: Bin, assignment: Assignment) => void
  onClear: (bin: Bin) => void
  onEdit: (bin: Bin) => void
  onDelete: (bin: Bin) => void
}) {
  const [sku, setSku] = React.useState(SKUS[0])
  const [qty, setQty] = React.useState(0)

  // Reseed the assign form whenever a different bin is opened.
  const [seededId, setSeededId] = React.useState<string | null>(null)
  if (bin && bin.id !== seededId) {
    setSeededId(bin.id)
    setSku(bin.sku ?? SKUS[0])
    setQty(0)
  }

  if (!bin) return null

  const assignment: Assignment = { sku, qty }
  const allowed = canAssign(bin, assignment)
  const blockedReason =
    bin.status !== "active"
      ? `Bin is ${bin.status} — it can't accept stock.`
      : bin.sku && bin.sku !== sku
        ? `Occupied by ${bin.sku} — clear it before assigning a different SKU.`
        : qty > 0 && bin.qty + qty > bin.capacity
          ? `Only ${remainingCapacity(bin)} units of room left.`
          : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{bin.code}</SheetTitle>
          <SheetDescription>
            {bin.warehouse} · row {bin.row + 1}, col {bin.col + 1}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_BADGE_VARIANT[bin.status]}>{bin.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {bin.qty}/{bin.capacity} used
            </span>
          </div>

          {bin.sku && (
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">{bin.sku}</p>
              <p className="text-muted-foreground">{bin.qty} on hand</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onClear(bin)}
              >
                Clear bin
              </Button>
            </div>
          )}

          <FieldGroup>
            <Field data-invalid={blockedReason ? true : undefined}>
              <FieldLabel htmlFor="bin-sheet-sku">
                {bin.sku ? "Add more stock" : "Assign stock"}
              </FieldLabel>
              <Select
                value={sku}
                onValueChange={(v) => setSku(v ?? SKUS[0])}
                disabled={bin.status !== "active"}
              >
                <SelectTrigger id="bin-sheet-sku">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKUS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field data-invalid={blockedReason ? true : undefined}>
              <FieldLabel htmlFor="bin-sheet-qty">Quantity</FieldLabel>
              <Input
                id="bin-sheet-qty"
                type="number"
                min="0"
                value={qty || ""}
                aria-invalid={blockedReason ? true : undefined}
                disabled={bin.status !== "active"}
                onChange={(e) => setQty(Number(e.target.value))}
              />
              {blockedReason && <FieldDescription>{blockedReason}</FieldDescription>}
            </Field>
            <Button
              type="button"
              disabled={!allowed}
              onClick={() => {
                onAssign(bin, assignment)
                setQty(0)
              }}
            >
              {bin.sku ? "Add stock" : "Assign"}
            </Button>
          </FieldGroup>
        </div>

        <SheetFooter className="flex-row justify-between">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(bin)}>
            Edit slot
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(bin)}
          >
            Delete bin
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
