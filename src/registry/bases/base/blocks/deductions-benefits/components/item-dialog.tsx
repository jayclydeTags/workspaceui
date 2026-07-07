import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  type Calculation,
  type DeductionBenefit,
  type DeductionBenefitDraft,
  type DeductionStatus,
  type DeductionType,
} from "../data"

export function ItemDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The deduction/benefit being edited, or `null` when creating a new one. */
  editing: DeductionBenefit | null
  onSubmit: (draft: DeductionBenefitDraft) => void
}) {
  const [draft, setDraft] = React.useState<DeductionBenefitDraft>(emptyDraft)

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
              name: editing.name,
              type: editing.type,
              calculation: editing.calculation,
              amount: editing.amount,
              preTax: editing.preTax,
              status: editing.status,
            }
          : emptyDraft()
      )
    }
  }

  const patch = (changes: Partial<DeductionBenefitDraft>) =>
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
            {editing ? "Edit item" : "New deduction / benefit"}
          </DialogTitle>
        </DialogHeader>
        <form id="deduction-benefit-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="item-name">Name</FieldLabel>
              <Input
                id="item-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Health Insurance"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="item-type">Type</FieldLabel>
              <Select
                value={draft.type}
                onValueChange={(v) =>
                  patch({ type: (v as DeductionType) ?? "deduction" })
                }
              >
                <SelectTrigger id="item-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deduction">Deduction</SelectItem>
                  <SelectItem value="benefit">Benefit</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="item-calculation">Calculation</FieldLabel>
              <Select
                value={draft.calculation}
                onValueChange={(v) =>
                  patch({ calculation: (v as Calculation) ?? "fixed" })
                }
              >
                <SelectTrigger id="item-calculation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed $ per pay period</SelectItem>
                  <SelectItem value="percent">% of gross</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="item-amount">
                {draft.calculation === "fixed" ? "Amount ($)" : "Amount (%)"}
              </FieldLabel>
              <Input
                id="item-amount"
                type="number"
                min="0"
                step="0.01"
                value={draft.amount || ""}
                onChange={(e) => patch({ amount: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="item-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as DeductionStatus) ?? "active" })
                }
              >
                <SelectTrigger id="item-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="item-pretax"
                checked={draft.preTax}
                onCheckedChange={(v) => patch({ preTax: !!v })}
              />
              <FieldLabel htmlFor="item-pretax" className="font-normal">
                Pre-tax
              </FieldLabel>
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
            form="deduction-benefit-form"
            disabled={!isValid(draft)}
          >
            {editing ? "Save changes" : "Create item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
