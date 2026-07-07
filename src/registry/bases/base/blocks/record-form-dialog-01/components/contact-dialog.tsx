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
  emptyDraft,
  isValid,
  type Contact,
  type ContactDraft,
  type ContactStatus,
} from "../data"

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
              email: editing.email,
              company: editing.company,
              status: editing.status,
            }
          : emptyDraft()
      )
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
                placeholder="e.g. Ada Lovelace"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input
                id="contact-email"
                type="email"
                value={draft.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="e.g. ada@acme.co"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-company">Company</FieldLabel>
              <Input
                id="contact-company"
                value={draft.company}
                onChange={(e) => patch({ company: e.target.value })}
                placeholder="e.g. Acme Co."
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as ContactStatus) ?? "active" })
                }
              >
                <SelectTrigger id="contact-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
          <Button type="submit" form="contact-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
