"use client"

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
  STAGE_COLUMNS,
  STAGE_LABEL,
  emptyDraft,
  isValid,
  type Deal,
  type DealDraft,
  type DealStage,
} from "../data"

export function DealDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The deal being edited, or `null` when creating a new one. */
  editing: Deal | null
  onSubmit: (draft: DealDraft) => void
}) {
  const [draft, setDraft] = React.useState<DealDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { name, account, owner, value, closeDate, stage } =
        editing ?? emptyDraft()
      setDraft({ name, account, owner, value, closeDate, stage })
    }
  }

  const patch = (changes: Partial<DealDraft>) =>
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
          <DialogTitle>{editing ? "Edit deal" : "New deal"}</DialogTitle>
        </DialogHeader>
        <form id="deal-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="deal-name">Name</FieldLabel>
              <Input
                id="deal-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Platform renewal"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="deal-account">Account</FieldLabel>
              <Input
                id="deal-account"
                value={draft.account}
                onChange={(e) => patch({ account: e.target.value })}
                placeholder="e.g. Northwind"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="deal-owner">Owner</FieldLabel>
              <Input
                id="deal-owner"
                value={draft.owner}
                onChange={(e) => patch({ owner: e.target.value })}
                placeholder="e.g. Ava Chen"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="deal-value">Value</FieldLabel>
              <Input
                id="deal-value"
                type="number"
                min="0"
                step="1000"
                value={draft.value || ""}
                onChange={(e) => patch({ value: Number(e.target.value) })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="deal-close">Close date</FieldLabel>
              <Input
                id="deal-close"
                type="date"
                value={draft.closeDate}
                onChange={(e) => patch({ closeDate: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="deal-stage">Stage</FieldLabel>
              <Select
                value={draft.stage}
                onValueChange={(v) => patch({ stage: (v as DealStage) ?? "qualify" })}
              >
                <SelectTrigger id="deal-stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_COLUMNS.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {STAGE_LABEL[stage]}
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
          <Button type="submit" form="deal-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create deal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
