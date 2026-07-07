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
  METHOD_LABEL,
  emptyDraft,
  isValid,
  type Payment,
  type PaymentDraft,
  type PaymentMethod,
  type PaymentStatus,
} from "../data"

const METHODS = Object.keys(METHOD_LABEL) as PaymentMethod[]

export function PaymentDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The payment being edited, or `null` when creating a new one. */
  editing: Payment | null
  onSubmit: (draft: PaymentDraft) => void
}) {
  const [draft, setDraft] = React.useState<PaymentDraft>(emptyDraft)

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
              payee: editing.payee,
              method: editing.method,
              reference: editing.reference,
              date: editing.date,
              amount: editing.amount,
              status: editing.status,
            }
          : emptyDraft()
      )
    }
  }

  const patch = (changes: Partial<PaymentDraft>) =>
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
          <DialogTitle>{editing ? "Edit payment" : "New payment"}</DialogTitle>
        </DialogHeader>
        <form id="payment-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="payment-payee">Payee</FieldLabel>
              <Input
                id="payment-payee"
                value={draft.payee}
                onChange={(e) => patch({ payee: e.target.value })}
                placeholder="e.g. Acme Supply Co."
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="payment-method">Method</FieldLabel>
              <Select
                value={draft.method}
                onValueChange={(v) =>
                  patch({ method: (v as PaymentMethod) ?? "ach" })
                }
              >
                <SelectTrigger id="payment-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {METHOD_LABEL[method]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="payment-reference">Reference</FieldLabel>
              <Input
                id="payment-reference"
                value={draft.reference}
                onChange={(e) => patch({ reference: e.target.value })}
                placeholder="e.g. ACH-88213"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="payment-date">Date</FieldLabel>
              <Input
                id="payment-date"
                type="date"
                value={draft.date}
                onChange={(e) => patch({ date: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="payment-amount">Amount ($)</FieldLabel>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={draft.amount || ""}
                onChange={(e) => patch({ amount: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="payment-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as PaymentStatus) ?? "pending" })
                }
              >
                <SelectTrigger id="payment-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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
          <Button type="submit" form="payment-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
