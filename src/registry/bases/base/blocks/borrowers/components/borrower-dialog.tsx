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
  KYC_STATUSES,
  MAX_SCORE,
  MIN_SCORE,
  emptyDraft,
  isValid,
  riskGrade,
  type Borrower,
  type BorrowerDraft,
  type KycStatus,
} from "../data"

export function BorrowerDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The borrower being edited, or `null` when creating a new one. */
  editing: Borrower | null
  onSubmit: (draft: BorrowerDraft) => void
}) {
  const [draft, setDraft] = React.useState<BorrowerDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { name, email, phone, creditScore, kyc } = editing ?? emptyDraft()
      setDraft({ name, email, phone, creditScore, kyc })
    }
  }

  const patch = (changes: Partial<BorrowerDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const scoreOutOfRange =
    draft.creditScore < MIN_SCORE || draft.creditScore > MAX_SCORE

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
          <DialogTitle>{editing ? "Edit borrower" : "New borrower"}</DialogTitle>
        </DialogHeader>
        <form id="borrower-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="borrower-name">Name</FieldLabel>
              <Input
                id="borrower-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Iris Muller"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="borrower-email">Email</FieldLabel>
              <Input
                id="borrower-email"
                type="email"
                value={draft.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="e.g. iris@northwind.example"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="borrower-phone">Phone</FieldLabel>
              <Input
                id="borrower-phone"
                type="tel"
                value={draft.phone}
                onChange={(e) => patch({ phone: e.target.value })}
                placeholder="e.g. +1 503 555 0142"
              />
            </Field>
            <Field data-invalid={scoreOutOfRange || undefined}>
              <FieldLabel htmlFor="borrower-score">Credit score</FieldLabel>
              <Input
                id="borrower-score"
                type="number"
                min={MIN_SCORE}
                max={MAX_SCORE}
                step="1"
                value={draft.creditScore}
                onChange={(e) => patch({ creditScore: Number(e.target.value) })}
                aria-invalid={scoreOutOfRange}
                required
              />
              <FieldDescription>
                {scoreOutOfRange
                  ? `Must be between ${MIN_SCORE} and ${MAX_SCORE}.`
                  : `Risk grade ${riskGrade(draft.creditScore)}.`}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="borrower-kyc">KYC</FieldLabel>
              <Select
                value={draft.kyc}
                onValueChange={(v) => patch({ kyc: (v as KycStatus) ?? "unverified" })}
              >
                <SelectTrigger id="borrower-kyc">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KYC_STATUSES.map((status) => (
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
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="borrower-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create borrower"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
