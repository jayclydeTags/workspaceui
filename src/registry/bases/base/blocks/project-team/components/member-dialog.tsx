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
  FULL_WEEK_HOURS,
  TEAM_ROLES,
  emptyDraft,
  isOverAllocated,
  isValid,
  type Member,
  type MemberDraft,
  type TeamRole,
} from "../data"

export function MemberDialog({
  open,
  onOpenChange,
  editing,
  lockRole,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The member being edited, or `null` when adding a new one. */
  editing: Member | null
  /** True when `editing` is the only lead — the role can't be changed. */
  lockRole: boolean
  onSubmit: (draft: MemberDraft) => void
}) {
  const [draft, setDraft] = React.useState<MemberDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for an add or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { name, email, role, allocation } = editing ?? emptyDraft()
      setDraft({ name, email, role, allocation })
    }
  }

  const patch = (changes: Partial<MemberDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const overAllocated = isOverAllocated(draft)

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
          <DialogTitle>{editing ? "Edit member" : "Add member"}</DialogTitle>
        </DialogHeader>
        <form id="member-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="member-name">Name</FieldLabel>
              <Input
                id="member-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Ava Chen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="member-email">Email</FieldLabel>
              <Input
                id="member-email"
                type="email"
                value={draft.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="e.g. ava.chen@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="member-role">Role</FieldLabel>
              <Select
                value={draft.role}
                disabled={lockRole}
                onValueChange={(v) => patch({ role: (v as TeamRole) ?? "member" })}
              >
                <SelectTrigger id="member-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {lockRole && (
                <FieldDescription>
                  The only lead — promote someone else first.
                </FieldDescription>
              )}
            </Field>
            <Field data-invalid={overAllocated || undefined}>
              <FieldLabel htmlFor="member-allocation">
                Allocation (h / week)
              </FieldLabel>
              <Input
                id="member-allocation"
                type="number"
                min="0"
                max={FULL_WEEK_HOURS}
                step="1"
                value={draft.allocation || ""}
                onChange={(e) => patch({ allocation: Number(e.target.value) })}
                aria-invalid={overAllocated}
                required
              />
              {overAllocated && (
                <FieldDescription>
                  Can&apos;t allocate more than {FULL_WEEK_HOURS}h a week.
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
          <Button type="submit" form="member-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Add to team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
