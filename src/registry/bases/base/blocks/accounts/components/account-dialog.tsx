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
  TIERS,
  emptyDraft,
  isValid,
  type Account,
  type AccountDraft,
  type AccountTier,
} from "../data"

export function AccountDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The account being edited, or `null` when creating a new one. */
  editing: Account | null
  onSubmit: (draft: AccountDraft) => void
}) {
  const [draft, setDraft] = React.useState<AccountDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { name, industry, owner, tier, arr, lastContact } =
        editing ?? emptyDraft()
      setDraft({ name, industry, owner, tier, arr, lastContact })
    }
  }

  const patch = (changes: Partial<AccountDraft>) =>
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
          <DialogTitle>{editing ? "Edit account" : "New account"}</DialogTitle>
        </DialogHeader>
        <form id="account-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="account-name">Name</FieldLabel>
              <Input
                id="account-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Northwind"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-industry">Industry</FieldLabel>
              <Input
                id="account-industry"
                value={draft.industry}
                onChange={(e) => patch({ industry: e.target.value })}
                placeholder="e.g. Logistics"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-owner">Owner</FieldLabel>
              <Input
                id="account-owner"
                value={draft.owner}
                onChange={(e) => patch({ owner: e.target.value })}
                placeholder="e.g. Ava Chen"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-tier">Tier</FieldLabel>
              <Select
                value={draft.tier}
                onValueChange={(v) => patch({ tier: (v as AccountTier) ?? "smb" })}
              >
                <SelectTrigger id="account-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="account-arr">ARR</FieldLabel>
              <Input
                id="account-arr"
                type="number"
                min="0"
                step="1000"
                value={draft.arr || ""}
                onChange={(e) => patch({ arr: Number(e.target.value) })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-contact">Last contact</FieldLabel>
              <Input
                id="account-contact"
                type="date"
                value={draft.lastContact}
                onChange={(e) => patch({ lastContact: e.target.value })}
              />
              <FieldDescription>
                Health is derived from how long ago this was.
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
          <Button type="submit" form="account-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
