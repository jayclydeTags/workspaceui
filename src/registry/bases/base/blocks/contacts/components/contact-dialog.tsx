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
  ACCOUNTS,
  emptyDraft,
  isValid,
  type Contact,
  type ContactDraft,
} from "../data"

// ponytail: `primary` isn't editable here — it's an account-wide invariant,
// set through the row's "Make primary" action so the old primary is demoted.

export function ContactDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The contact being edited, or `null` when creating a new one. */
  editing: Contact | null
  onSubmit: (draft: ContactDraft) => void
}) {
  const [draft, setDraft] = React.useState<ContactDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { name, title, account, email, phone, primary } =
        editing ?? emptyDraft()
      setDraft({ name, title, account, email, phone, primary })
    }
  }

  const patch = (changes: Partial<ContactDraft>) =>
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
          <DialogTitle>{editing ? "Edit contact" : "New contact"}</DialogTitle>
        </DialogHeader>
        <form id="contact-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="contact-name">Name</FieldLabel>
              <Input
                id="contact-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Iris Muller"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-title">Title</FieldLabel>
              <Input
                id="contact-title"
                value={draft.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g. VP Finance"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-account">Account</FieldLabel>
              <Select
                value={draft.account}
                onValueChange={(v) => patch({ account: v ?? ACCOUNTS[0] })}
              >
                <SelectTrigger id="contact-account">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNTS.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input
                id="contact-email"
                type="email"
                value={draft.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="e.g. iris@northwind.example"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-phone">Phone</FieldLabel>
              <Input
                id="contact-phone"
                type="tel"
                value={draft.phone}
                onChange={(e) => patch({ phone: e.target.value })}
                placeholder="e.g. +1 503 555 0142"
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
          <Button type="submit" form="contact-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
