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
  PROJECTS,
  TIME_ENTRIES,
  totalHours,
  utilization,
  type TimeEntry,
  type TimeEntryDraft,
} from "./data"
import { DataTable } from "./components/data-table"
import { EntryDialog } from "./components/entry-dialog"

export function Timesheets() {
  const [entries, setEntries] = React.useState<TimeEntry[]>(TIME_ENTRIES)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<TimeEntry | null>(null)
  const [deleting, setDeleting] = React.useState<TimeEntry | null>(null)
  const [projectFilter, setProjectFilter] = React.useState("all")

  const visible =
    projectFilter === "all"
      ? entries
      : entries.filter((e) => e.project === projectFilter)

  function save(draft: TimeEntryDraft) {
    if (editing) {
      setEntries((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...draft } : e))
      )
    } else {
      setEntries((prev) => [
        { ...draft, id: crypto.randomUUID(), status: "draft" },
        ...prev,
      ])
    }
  }

  /** draft → submitted → approved. */
  function advance(entry: TimeEntry) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id
          ? { ...e, status: e.status === "draft" ? "submitted" : "approved" }
          : e
      )
    )
  }

  function confirmDelete() {
    if (!deleting) return
    setEntries((prev) => prev.filter((e) => e.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Timesheets"
      subtitle={`${totalHours(visible).toFixed(1)}h logged · ${utilization(visible)}% billable`}
      className="@container overflow-hidden"
      actions={
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <PlusIcon data-icon="inline-start" />
          Log time
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={projectFilter}
            onValueChange={(v) => setProjectFilter(v ?? "all")}
          >
            <SelectTrigger aria-label="Filter by project" className="w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {PROJECTS.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No time logged</EmptyTitle>
              <EmptyDescription>
                Log time against a project to get started.
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
            onAdvance={advance}
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
              Delete <span className="font-medium">{deleting?.member}</span>&apos;s{" "}
              {deleting?.hours}h on {deleting?.date}? This action can&apos;t be
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
