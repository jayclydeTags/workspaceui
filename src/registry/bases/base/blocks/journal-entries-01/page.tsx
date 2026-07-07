"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  JOURNAL_ENTRIES,
  type JournalEntry,
  type JournalEntryDraft,
} from "./data"
import { DataTable } from "./components/data-table"
import { EntryDialog } from "./components/entry-dialog"

export function JournalEntries01() {
  const [entries, setEntries] = React.useState<JournalEntry[]>(
    JOURNAL_ENTRIES
  )
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<JournalEntry | null>(null)
  const [deleting, setDeleting] = React.useState<JournalEntry | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(entry: JournalEntry) {
    setEditing(entry)
    setFormOpen(true)
  }

  function save(draft: JournalEntryDraft) {
    if (editing) {
      setEntries((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...draft } : e))
      )
    } else {
      setEntries((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setEntries((prev) => prev.filter((e) => e.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Journal entries"
      subtitle={`${entries.length} entries`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New entry
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {entries.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No journal entries</EmptyTitle>
              <EmptyDescription>
                Create an entry to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            entries={entries}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )}
      </div>

      <EntryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSubmit={save}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete journal entry</AlertDialogTitle>
            <AlertDialogDescription>
              Delete{" "}
              <span className="font-medium">{deleting?.reference}</span>?
              This action can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
