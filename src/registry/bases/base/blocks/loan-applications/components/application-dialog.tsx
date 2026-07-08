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
  LOAN_PURPOSES,
  MAX_DTI,
  dti,
  emptyDraft,
  formatCurrency,
  isValid,
  monthlyPayment,
  type LoanApplication,
  type LoanDraft,
  type LoanPurpose,
} from "../data"

export function ApplicationDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The application being edited, or `null` when creating a new one. */
  editing: LoanApplication | null
  onSubmit: (draft: LoanDraft) => void
}) {
  const [draft, setDraft] = React.useState<LoanDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const {
        reference,
        borrower,
        purpose,
        amount,
        rate,
        termMonths,
        monthlyIncome,
        monthlyDebts,
      } = editing ?? emptyDraft()
      setDraft({
        reference,
        borrower,
        purpose,
        amount,
        rate,
        termMonths,
        monthlyIncome,
        monthlyDebts,
      })
    }
  }

  const patch = (changes: Partial<LoanDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const payment = monthlyPayment(draft.amount, draft.rate, draft.termMonths)
  const ratio = dti(draft)
  const overCeiling = Number.isFinite(ratio) && ratio > MAX_DTI

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
            {editing ? "Edit application" : "New application"}
          </DialogTitle>
        </DialogHeader>
        <form id="loan-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="loan-reference">Reference</FieldLabel>
              <Input
                id="loan-reference"
                value={draft.reference}
                onChange={(e) => patch({ reference: e.target.value })}
                placeholder="e.g. LN-2046"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="loan-borrower">Borrower</FieldLabel>
              <Input
                id="loan-borrower"
                value={draft.borrower}
                onChange={(e) => patch({ borrower: e.target.value })}
                placeholder="e.g. Iris Muller"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="loan-purpose">Purpose</FieldLabel>
              <Select
                value={draft.purpose}
                onValueChange={(v) =>
                  patch({ purpose: (v as LoanPurpose) ?? "working-capital" })
                }
              >
                <SelectTrigger id="loan-purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOAN_PURPOSES.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="loan-amount">Amount</FieldLabel>
              <Input
                id="loan-amount"
                type="number"
                min="0"
                step="1000"
                value={draft.amount || ""}
                onChange={(e) => patch({ amount: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="loan-rate">Rate (% APR)</FieldLabel>
              <Input
                id="loan-rate"
                type="number"
                min="0"
                step="0.1"
                value={draft.rate}
                onChange={(e) => patch({ rate: Number(e.target.value) })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="loan-term">Term (months)</FieldLabel>
              <Input
                id="loan-term"
                type="number"
                min="1"
                step="1"
                value={draft.termMonths || ""}
                onChange={(e) => patch({ termMonths: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="loan-income">Monthly income</FieldLabel>
              <Input
                id="loan-income"
                type="number"
                min="0"
                step="100"
                value={draft.monthlyIncome || ""}
                onChange={(e) => patch({ monthlyIncome: Number(e.target.value) })}
                required
              />
            </Field>
            <Field data-invalid={overCeiling || undefined}>
              <FieldLabel htmlFor="loan-debts">Monthly debts</FieldLabel>
              <Input
                id="loan-debts"
                type="number"
                min="0"
                step="100"
                value={draft.monthlyDebts}
                onChange={(e) => patch({ monthlyDebts: Number(e.target.value) })}
                aria-invalid={overCeiling}
              />
              <FieldDescription>
                {payment > 0 && Number.isFinite(ratio)
                  ? `${formatCurrency(Math.round(payment))}/mo · DTI ${Math.round(ratio * 100)}%${
                      overCeiling
                        ? ` — over the ${Math.round(MAX_DTI * 100)}% ceiling, can be saved but not approved.`
                        : ""
                    }`
                  : "Payment and DTI appear once amount, term, and income are set."}
              </FieldDescription>
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
          <Button type="submit" form="loan-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
