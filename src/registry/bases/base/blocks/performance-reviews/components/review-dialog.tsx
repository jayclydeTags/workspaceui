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
import { Textarea } from "@/components/ui/textarea"
import {
  RATING_LABELS,
  REVIEW_STATUSES,
  emptyDraft,
  isValid,
  type Rating,
  type Review,
  type ReviewDraft,
  type ReviewStatus,
} from "../data"

export function ReviewDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The review being edited, or `null` when creating a new one. */
  editing: Review | null
  onSubmit: (draft: ReviewDraft) => void
}) {
  const [draft, setDraft] = React.useState<ReviewDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { employee, reviewer, period, rating, status, notes } =
        editing ?? emptyDraft()
      setDraft({ employee, reviewer, period, rating, status, notes })
    }
  }

  const patch = (changes: Partial<ReviewDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const needsRating = draft.status === "completed" && draft.rating === 0

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
          <DialogTitle>{editing ? "Edit review" : "New review"}</DialogTitle>
        </DialogHeader>
        <form id="review-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="review-employee">Employee</FieldLabel>
              <Input
                id="review-employee"
                value={draft.employee}
                onChange={(e) => patch({ employee: e.target.value })}
                placeholder="e.g. Ava Chen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="review-reviewer">Reviewer</FieldLabel>
              <Input
                id="review-reviewer"
                value={draft.reviewer}
                onChange={(e) => patch({ reviewer: e.target.value })}
                placeholder="e.g. Dana Reyes"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="review-period">Period</FieldLabel>
              <Input
                id="review-period"
                value={draft.period}
                onChange={(e) => patch({ period: e.target.value })}
                placeholder="e.g. H1 2026"
                required
              />
            </Field>
            <Field data-invalid={needsRating || undefined}>
              <FieldLabel htmlFor="review-rating">Rating</FieldLabel>
              <Select
                value={String(draft.rating)}
                onValueChange={(v) =>
                  patch({ rating: (Number(v ?? 0) || 0) as Rating })
                }
              >
                <SelectTrigger id="review-rating" aria-invalid={needsRating}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Unrated</SelectItem>
                  {([5, 4, 3, 2, 1] as const).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} — {RATING_LABELS[n]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {needsRating && (
                <FieldDescription>
                  A completed review needs a rating.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="review-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as ReviewStatus) ?? "draft" })
                }
              >
                <SelectTrigger id="review-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REVIEW_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="review-notes">Notes</FieldLabel>
              <Textarea
                id="review-notes"
                value={draft.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="Optional"
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
          <Button type="submit" form="review-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
