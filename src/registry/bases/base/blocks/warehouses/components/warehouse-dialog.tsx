import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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
  emptyDraft,
  isValid,
  type Warehouse,
  type WarehouseDraft,
  type WarehouseStatus,
} from "../data"

export function WarehouseDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The warehouse being edited, or `null` when creating a new one. */
  editing: Warehouse | null
  onSubmit: (draft: WarehouseDraft) => void
}) {
  const [draft, setDraft] = React.useState<WarehouseDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // one form handles both, keyed off whether `editing` is set. Adjusted during
  // render (not an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      setDraft(
        editing
          ? {
              code: editing.code,
              name: editing.name,
              location: editing.location,
              capacity: editing.capacity,
              status: editing.status,
            }
          : emptyDraft()
      )
    }
  }

  const patch = (changes: Partial<WarehouseDraft>) =>
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
          <DialogTitle>
            {editing ? "Edit warehouse" : "New warehouse"}
          </DialogTitle>
        </DialogHeader>
        <form id="warehouse-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="warehouse-name">Name</FieldLabel>
              <Input
                id="warehouse-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Central Fulfilment"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="warehouse-code">Code</FieldLabel>
              <Input
                id="warehouse-code"
                value={draft.code}
                onChange={(e) => patch({ code: e.target.value })}
                placeholder="e.g. WH-CEN"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="warehouse-location">Location</FieldLabel>
              <Input
                id="warehouse-location"
                value={draft.location}
                onChange={(e) => patch({ location: e.target.value })}
                placeholder="e.g. Kansas City, MO"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="warehouse-capacity">
                Capacity (units)
              </FieldLabel>
              <Input
                id="warehouse-capacity"
                type="number"
                min="0"
                step="1"
                value={draft.capacity || ""}
                onChange={(e) => patch({ capacity: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="warehouse-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as WarehouseStatus) ?? "active" })
                }
              >
                <SelectTrigger id="warehouse-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
          <Button
            type="submit"
            form="warehouse-form"
            disabled={!isValid(draft)}
          >
            {editing ? "Save changes" : "Create warehouse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
