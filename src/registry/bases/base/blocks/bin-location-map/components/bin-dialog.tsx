import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  BIN_STATUSES,
  WAREHOUSES,
  emptyDraft,
  isDraftValid,
  isPositionTaken,
  type Bin,
  type BinDraft,
  type BinStatus,
} from "../data"

export function BinDialog({
  open,
  onOpenChange,
  editing,
  defaultWarehouse,
  seed,
  bins,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The bin being edited, or `null` when adding a new one. */
  editing: Bin | null
  defaultWarehouse: string
  /** When adding, pre-fill the grid position (from a floor quick-add button). */
  seed?: { row: number; col: number } | null
  /** All bins, used to reject a duplicate grid position. */
  bins: Bin[]
  onSubmit: (draft: BinDraft) => void
}) {
  const [draft, setDraft] = React.useState<BinDraft>(() =>
    emptyDraft(defaultWarehouse)
  )

  // Include the seed position in the key so two different quick-add buttons
  // reseed the form even though both are "new".
  const openKey = open
    ? (editing?.id ?? (seed ? `new-${seed.row}-${seed.col}` : "new"))
    : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { code, warehouse, row, col, capacity, status } =
        editing ?? { ...emptyDraft(defaultWarehouse), ...seed }
      setDraft({ code, warehouse, row, col, capacity, status })
    }
  }

  const patch = (changes: Partial<BinDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const duplicatePosition = isPositionTaken(bins, draft, editing?.id)
  const valid = isDraftValid(draft) && !duplicatePosition

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit bin" : "Add bin"}</DialogTitle>
        </DialogHeader>
        <form id="bin-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bin-code">Code</FieldLabel>
              <Input
                id="bin-code"
                value={draft.code}
                onChange={(e) => patch({ code: e.target.value })}
                placeholder="e.g. CEN-A5"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bin-warehouse">Warehouse</FieldLabel>
              <Select
                value={draft.warehouse}
                onValueChange={(v) => patch({ warehouse: v ?? WAREHOUSES[0] })}
              >
                <SelectTrigger id="bin-warehouse">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WAREHOUSES.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={duplicatePosition || undefined}>
                <FieldLabel htmlFor="bin-row">Row</FieldLabel>
                <Input
                  id="bin-row"
                  type="number"
                  min="0"
                  value={draft.row}
                  aria-invalid={duplicatePosition || undefined}
                  onChange={(e) => patch({ row: Number(e.target.value) })}
                />
              </Field>
              <Field data-invalid={duplicatePosition || undefined}>
                <FieldLabel htmlFor="bin-col">Column</FieldLabel>
                <Input
                  id="bin-col"
                  type="number"
                  min="0"
                  value={draft.col}
                  aria-invalid={duplicatePosition || undefined}
                  onChange={(e) => patch({ col: Number(e.target.value) })}
                />
              </Field>
            </div>
            {duplicatePosition && (
              <FieldDescription className="text-destructive">
                Another bin in {draft.warehouse} already sits at that position.
              </FieldDescription>
            )}
            <Field>
              <FieldLabel htmlFor="bin-capacity">Capacity</FieldLabel>
              <Input
                id="bin-capacity"
                type="number"
                min="1"
                value={draft.capacity || ""}
                onChange={(e) => patch({ capacity: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bin-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as BinStatus) ?? "active" })
                }
              >
                <SelectTrigger id="bin-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BIN_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="bin-form" disabled={!valid}>
            {editing ? "Save changes" : "Add bin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
