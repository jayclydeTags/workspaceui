import * as React from "react"
import { Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ACCOUNTS,
  emptyDraft,
  emptyLine,
  formatCurrency,
  isBalanced,
  isValid,
  totalCredits,
  totalDebits,
  type JournalEntry,
  type JournalEntryDraft,
  type JournalLine,
} from "../data"

export function EntryDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The entry being edited, or `null` when creating a new one. */
  editing: JournalEntry | null
  onSubmit: (draft: JournalEntryDraft) => void
}) {
  const [draft, setDraft] = React.useState<JournalEntryDraft>(emptyDraft)

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
              date: editing.date,
              reference: editing.reference,
              memo: editing.memo,
              lines: editing.lines.map((l) => ({ ...l })),
              status: editing.status,
            }
          : emptyDraft()
      )
    }
  }

  const patch = (changes: Partial<JournalEntryDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  function updateLine(id: string, changes: Partial<JournalLine>) {
    patch({
      lines: draft.lines.map((l) => (l.id === id ? { ...l, ...changes } : l)),
    })
  }

  function addLine() {
    patch({ lines: [...draft.lines, emptyLine()] })
  }

  function removeLine(id: string) {
    patch({ lines: draft.lines.filter((l) => l.id !== id) })
  }

  const debits = totalDebits(draft.lines)
  const credits = totalCredits(draft.lines)
  const balanced = isBalanced(draft.lines)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid(draft)) return
    onSubmit(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit journal entry" : "New journal entry"}
          </DialogTitle>
        </DialogHeader>
        <form
          id="journal-entry-form"
          onSubmit={submit}
          className="flex flex-col gap-4"
        >
          <FieldGroup className="sm:grid sm:grid-cols-2 sm:gap-4">
            <Field>
              <FieldLabel htmlFor="entry-reference">Reference</FieldLabel>
              <Input
                id="entry-reference"
                value={draft.reference}
                onChange={(e) => patch({ reference: e.target.value })}
                placeholder="e.g. JE-1004"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="entry-date">Date</FieldLabel>
              <Input
                id="entry-date"
                type="date"
                value={draft.date}
                onChange={(e) => patch({ date: e.target.value })}
                required
              />
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="entry-memo">Memo</FieldLabel>
            <Input
              id="entry-memo"
              value={draft.memo}
              onChange={(e) => patch({ memo: e.target.value })}
              placeholder="e.g. June rent payment"
            />
          </Field>

          <div className="flex flex-col gap-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="w-28 text-right">Debit</TableHead>
                  <TableHead className="w-28 text-right">Credit</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {draft.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Select
                        value={line.account}
                        onValueChange={(v) =>
                          updateLine(line.id, { account: v ?? "" })
                        }
                      >
                        <SelectTrigger aria-label="Account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCOUNTS.map((account) => (
                            <SelectItem key={account} value={account}>
                              {account}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={line.debit || ""}
                        onChange={(e) =>
                          updateLine(line.id, {
                            debit: Number(e.target.value),
                            credit: 0,
                          })
                        }
                        className="text-right"
                        aria-label="Debit"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={line.credit || ""}
                        onChange={(e) =>
                          updateLine(line.id, {
                            credit: Number(e.target.value),
                            debit: 0,
                          })
                        }
                        className="text-right"
                        aria-label="Credit"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove line"
                        onClick={() => removeLine(line.id)}
                        disabled={draft.lines.length <= 2}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(debits)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(credits)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
              >
                <Plus data-icon="inline-start" />
                Add line
              </Button>
              <Badge variant={balanced ? "secondary" : "destructive"}>
                {balanced
                  ? "Balanced"
                  : `Out of balance by ${formatCurrency(Math.abs(debits - credits))}`}
              </Badge>
            </div>
          </div>
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
            form="journal-entry-form"
            disabled={!isValid(draft)}
          >
            {editing ? "Save changes" : "Create entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
