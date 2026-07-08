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
  ADVANCE_RATE,
  COLLATERAL_TYPES,
  LOANS,
  emptyDraft,
  formatCurrency,
  isAppraisalStale,
  isValid,
  lendableValue,
  type Collateral,
  type CollateralDraft,
  type CollateralType,
} from "../data"

// ponytail: `lien` isn't editable here — it moves through the row's
// perfect/release actions, which enforce the appraisal-currency rule.

export function CollateralDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The asset being edited, or `null` when pledging a new one. */
  editing: Collateral | null
  onSubmit: (draft: CollateralDraft) => void
}) {
  const [draft, setDraft] = React.useState<CollateralDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { loan, description, type, value, appraisedOn } =
        editing ?? emptyDraft()
      setDraft({ loan, description, type, value, appraisedOn })
    }
  }

  const patch = (changes: Partial<CollateralDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const stale = isAppraisalStale(draft)

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
          <DialogTitle>{editing ? "Edit collateral" : "Pledge collateral"}</DialogTitle>
        </DialogHeader>
        <form id="collateral-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="collateral-loan">Loan</FieldLabel>
              <Select
                value={draft.loan}
                onValueChange={(v) => patch({ loan: v ?? LOANS[0] })}
              >
                <SelectTrigger id="collateral-loan">
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
              <FieldLabel htmlFor="collateral-description">Description</FieldLabel>
              <Input
                id="collateral-description"
                value={draft.description}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder="e.g. Warehouse unit 4, Portland"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="collateral-type">Type</FieldLabel>
              <Select
                value={draft.type}
                onValueChange={(v) =>
                  patch({ type: (v as CollateralType) ?? "property" })
                }
              >
                <SelectTrigger id="collateral-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLLATERAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="collateral-value">Appraised value</FieldLabel>
              <Input
                id="collateral-value"
                type="number"
                min="0"
                step="1000"
                value={draft.value || ""}
                onChange={(e) => patch({ value: Number(e.target.value) })}
                required
              />
              <FieldDescription>
                {formatCurrency(lendableValue(draft))} lendable at the{" "}
                {Math.round(ADVANCE_RATE[draft.type] * 100)}% advance rate for{" "}
                {draft.type}.
              </FieldDescription>
            </Field>
            <Field data-invalid={stale || undefined}>
              <FieldLabel htmlFor="collateral-appraised">Appraised on</FieldLabel>
              <Input
                id="collateral-appraised"
                type="date"
                value={draft.appraisedOn}
                onChange={(e) => patch({ appraisedOn: e.target.value })}
                aria-invalid={stale}
                required
              />
              {stale && (
                <FieldDescription>
                  Over a year old — the lien can&apos;t be perfected until it&apos;s
                  re-appraised.
                </FieldDescription>
              )}
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
          <Button type="submit" form="collateral-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Pledge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
