import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { StockLevel } from "../data"

/**
 * Adjusts on-hand quantity to an absolute count (a stock take), not a delta —
 * matching how a physical count is entered. Deltas live in `stock-movements`.
 */
export function AdjustDialog({
  adjusting,
  onOpenChange,
  onSubmit,
}: {
  /** The stock row being adjusted, or `null` when closed. */
  adjusting: StockLevel | null
  onOpenChange: (open: boolean) => void
  onSubmit: (onHand: number, reorderPoint: number) => void
}) {
  const open = adjusting !== null
  const [onHand, setOnHand] = React.useState(0)
  const [reorderPoint, setReorderPoint] = React.useState(0)

  // Seed from the row each time the dialog opens for a different one. Adjusted
  // during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect.
  const [seededId, setSeededId] = React.useState<string | null>(null)
  if ((adjusting?.id ?? null) !== seededId) {
    setSeededId(adjusting?.id ?? null)
    if (adjusting) {
      setOnHand(adjusting.onHand)
      setReorderPoint(adjusting.reorderPoint)
    }
  }

  const valid = onHand >= 0 && reorderPoint >= 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit(onHand, reorderPoint)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            {adjusting?.product} at {adjusting?.warehouse}
          </DialogDescription>
        </DialogHeader>
        <form id="adjust-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="adjust-on-hand">On hand</FieldLabel>
              <Input
                id="adjust-on-hand"
                type="number"
                min="0"
                step="1"
                value={onHand}
                onChange={(e) => setOnHand(Number(e.target.value))}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="adjust-reorder-point">
                Reorder point
              </FieldLabel>
              <Input
                id="adjust-reorder-point"
                type="number"
                min="0"
                step="1"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(Number(e.target.value))}
                required
              />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="adjust-form" disabled={!valid}>
            Save adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
