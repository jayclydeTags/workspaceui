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
  LOANS,
  METHODS,
  emptyDraft,
  formatCurrency,
  isValid,
  remaining,
  wouldOverdraw,
  type Disbursement,
  type DisbursementDraft,
  type Method,
} from "../data"

export function DisbursementDialog({
  open,
  onOpenChange,
  editing,
  disbursements,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The tranche being edited, or `null` when scheduling a new one. */
  editing: Disbursement | null
  /** All tranches — the headroom check runs against them. */
  disbursements: Disbursement[]
  onSubmit: (draft: DisbursementDraft) => void
}) {
  const [draft, setDraft] = React.useState<DisbursementDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { loan, borrower, amount, method, date } = editing ?? emptyDraft()
      setDraft({ loan, borrower, amount, method, date })
    }
  }

  const patch = (changes: Partial<DisbursementDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  // The row being edited doesn't count against its own loan's headroom.
  const headroom = remaining(disbursements, draft.loan, editing?.id)
  const overdraws = wouldOverdraw(disbursements, draft, editing?.id)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid(draft) || overdraws) return
    onSubmit(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit disbursement" : "Schedule disbursement"}
          </DialogTitle>
        </DialogHeader>
        <form id="disbursement-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="disbursement-loan">Loan</FieldLabel>
              <Select
                value={draft.loan}
                onValueChange={(v) => patch({ loan: v ?? LOANS[0] })}
              >
                <SelectTrigger id="disbursement-loan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOANS.map((loan) => (
                    <SelectItem key={loan} value={loan}>
                      {loan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="disbursement-borrower">Borrower</FieldLabel>
              <Input
                id="disbursement-borrower"
                value={draft.borrower}
                onChange={(e) => patch({ borrower: e.target.value })}
                placeholder="e.g. Iris Muller"
                required
              />
            </Field>
            <Field data-invalid={overdraws || undefined}>
              <FieldLabel htmlFor="disbursement-amount">Amount</FieldLabel>
              <Input
                id="disbursement-amount"
                type="number"
                min="0"
                step="1000"
                value={draft.amount || ""}
                onChange={(e) => patch({ amount: Number(e.target.value) })}
                aria-invalid={overdraws}
                required
              />
              <FieldDescription>
                {overdraws
                  ? `Only ${formatCurrency(headroom)} left on ${draft.loan}.`
                  : `${formatCurrency(headroom)} of approved principal left on ${draft.loan}.`}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="disbursement-method">Method</FieldLabel>
              <Select
                value={draft.method}
                onValueChange={(v) => patch({ method: (v as Method) ?? "ach" })}
              >
                <SelectTrigger id="disbursement-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="disbursement-date">Date</FieldLabel>
              <Input
                id="disbursement-date"
                type="date"
                value={draft.date}
                onChange={(e) => patch({ date: e.target.value })}
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
          <Button
            type="submit"
            form="disbursement-form"
            disabled={!isValid(draft) || overdraws}
          >
            {editing ? "Save changes" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
