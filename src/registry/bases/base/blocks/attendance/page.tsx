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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  ATTENDANCE,
  deriveStatus,
  totalHours,
  type AttendanceDraft,
  type AttendanceEntry,
} from "./data"
import { DataTable } from "./components/data-table"
import { EntryDialog } from "./components/entry-dialog"

export function Attendance() {
  const [entries, setEntries] = React.useState<AttendanceEntry[]>(ATTENDANCE)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<AttendanceEntry | null>(null)
  const [deleting, setDeleting] = React.useState<AttendanceEntry | null>(null)
  const [dateFilter, setDateFilter] = React.useState<string>("all")

  const dates = [...new Set(entries.map((e) => e.date))].sort().reverse()
  const visible =
    dateFilter === "all" ? entries : entries.filter((e) => e.date === dateFilter)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function save(draft: AttendanceDraft) {
    // Status is derived from the punches — an approved leave day has none, so
    // keep it rather than re-deriving it into "absent".
    const status =
      editing?.status === "leave" && !draft.clockIn
        ? "leave"
        : deriveStatus(draft)

    if (editing) {
      setEntries((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...draft, status } : e))
      )
    } else {
      setEntries((prev) => [
        { ...draft, id: crypto.randomUUID(), status },
        ...prev,
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setEntries((prev) => prev.filter((e) => e.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Attendance"
      subtitle={`${visible.length} entries · ${totalHours(visible).toFixed(1)}h logged`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New entry
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v ?? "all")}>
            <SelectTrigger aria-label="Filter by date" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              {dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No attendance entries</EmptyTitle>
              <EmptyDescription>
                Nothing has been logged for this period.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            entries={visible}
            onEdit={(entry) => {
              setEditing(entry)
              setFormOpen(true)
            }}
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
            <AlertDialogTitle>Delete entry</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.employee}</span>
              &apos;s entry for {deleting?.date}? This action can&apos;t be
              undone.
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
