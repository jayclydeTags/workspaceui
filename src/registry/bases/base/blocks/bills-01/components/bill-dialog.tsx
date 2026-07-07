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
  type Bill,
  type BillDraft,
  type BillStatus,
} from "../data"

export function BillDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The bill being edited, or `null` when creating a new one. */
  editing: Bill | null
  onSubmit: (draft: BillDraft) => void
}) {
  const [draft, setDraft] = React.useState<BillDraft>(emptyDraft)

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
              vendor: editing.vendor,
              billNumber: editing.billNumber,
              dueDate: editing.dueDate,
              amount: editing.amount,
              status: editing.status,
            }
          : emptyDraft()
      )
    }
  }

  const patch = (changes: Partial<BillDraft>) =>
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
          <DialogTitle>{editing ? "Edit bill" : "New bill"}</DialogTitle>
        </DialogHeader>
        <form id="bill-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bill-vendor">Vendor</FieldLabel>
              <Input
                id="bill-vendor"
                value={draft.vendor}
                onChange={(e) => patch({ vendor: e.target.value })}
                placeholder="e.g. Acme Supply Co."
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bill-number">Bill number</FieldLabel>
              <Input
                id="bill-number"
                value={draft.billNumber}
                onChange={(e) => patch({ billNumber: e.target.value })}
                placeholder="e.g. B-1001"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bill-due-date">Due date</FieldLabel>
              <Input
                id="bill-due-date"
                type="date"
                value={draft.dueDate}
                onChange={(e) => patch({ dueDate: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bill-amount">Amount ($)</FieldLabel>
              <Input
                id="bill-amount"
                type="number"
                min="0"
                step="0.01"
                value={draft.amount || ""}
                onChange={(e) => patch({ amount: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bill-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as BillStatus) ?? "draft" })
                }
              >
                <SelectTrigger id="bill-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
          <Button type="submit" form="bill-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
