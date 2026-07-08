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
import { Textarea } from "@/components/ui/textarea"
import {
  LEAVE_TYPES,
  dayCount,
  emptyDraft,
  isValid,
  type LeaveRequestDraft,
  type LeaveType,
} from "../data"

// ponytail: no edit dialog — a submitted request is amended by the approver's
// decision (approve/reject) or withdrawn and re-filed.

export function RequestDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (draft: LeaveRequestDraft) => void
}) {
  const [draft, setDraft] = React.useState<LeaveRequestDraft>(emptyDraft)

  // Reset the form each time the dialog opens — adjusted during render, not in
  // an effect (https://react.dev/learn/you-might-not-need-an-effect).
  const [wasOpen, setWasOpen] = React.useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setDraft(emptyDraft())
  }

  const patch = (changes: Partial<LeaveRequestDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const days = dayCount(draft.start, draft.end)

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
          <DialogTitle>New leave request</DialogTitle>
        </DialogHeader>
        <form id="leave-request-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="leave-employee">Employee</FieldLabel>
              <Input
                id="leave-employee"
                value={draft.employee}
                onChange={(e) => patch({ employee: e.target.value })}
                placeholder="e.g. Ava Chen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="leave-type">Type</FieldLabel>
              <Select
                value={draft.type}
                onValueChange={(v) =>
                  patch({ type: (v as LeaveType) ?? "vacation" })
                }
              >
                <SelectTrigger id="leave-type" className="capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAVE_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="leave-start">Start date</FieldLabel>
              <Input
                id="leave-start"
                type="date"
                value={draft.start}
                onChange={(e) => patch({ start: e.target.value })}
                required
              />
            </Field>
            <Field data-invalid={draft.end !== "" && days === 0 ? "" : undefined}>
              <FieldLabel htmlFor="leave-end">End date</FieldLabel>
              <Input
                id="leave-end"
                type="date"
                value={draft.end}
                onChange={(e) => patch({ end: e.target.value })}
                aria-invalid={draft.end !== "" && days === 0}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="leave-reason">Reason</FieldLabel>
              <Textarea
                id="leave-reason"
                value={draft.reason}
                onChange={(e) => patch({ reason: e.target.value })}
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
          <Button
            type="submit"
            form="leave-request-form"
            disabled={!isValid(draft)}
          >
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
