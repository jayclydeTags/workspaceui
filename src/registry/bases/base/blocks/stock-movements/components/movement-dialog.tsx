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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MOVEMENT_TYPES,
  emptyDraft,
  isValid,
  type MovementDraft,
  type MovementType,
} from "../data"

export function MovementDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (draft: MovementDraft) => void
}) {
  const [draft, setDraft] = React.useState<MovementDraft>(emptyDraft)

  // Reset the form each time the dialog opens. Adjusted during render (not an
  // effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = React.useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setDraft(emptyDraft())
  }

  const patch = (changes: Partial<MovementDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid(draft)) return
    onSubmit(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record movement</DialogTitle>
          <DialogDescription>
            Use a negative quantity for stock leaving the warehouse.
          </DialogDescription>
        </DialogHeader>
        <form id="movement-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="movement-sku">SKU</FieldLabel>
              <Input
                id="movement-sku"
                value={draft.sku}
                onChange={(e) => patch({ sku: e.target.value })}
                placeholder="e.g. SKU-1001"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="movement-warehouse">Warehouse</FieldLabel>
              <Input
                id="movement-warehouse"
                value={draft.warehouse}
                onChange={(e) => patch({ warehouse: e.target.value })}
                placeholder="e.g. WH-CEN"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="movement-type">Type</FieldLabel>
              <Select
                value={draft.type}
                onValueChange={(v) =>
                  patch({ type: (v as MovementType) ?? "receipt" })
                }
              >
                <SelectTrigger id="movement-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOVEMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="movement-quantity">Quantity</FieldLabel>
              <Input
                id="movement-quantity"
                type="number"
                step="1"
                value={draft.quantity || ""}
                onChange={(e) => patch({ quantity: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="movement-date">Date</FieldLabel>
              <Input
                id="movement-date"
                type="date"
                value={draft.date}
                onChange={(e) => patch({ date: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="movement-reference">Reference</FieldLabel>
              <Input
                id="movement-reference"
                value={draft.reference}
                onChange={(e) => patch({ reference: e.target.value })}
                placeholder="e.g. PO-8841"
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
          <Button type="submit" form="movement-form" disabled={!isValid(draft)}>
            Save movement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
