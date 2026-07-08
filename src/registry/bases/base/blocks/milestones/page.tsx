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
  MILESTONES,
  openCount,
  state,
  type Milestone,
  type MilestoneDraft,
} from "./data"
import { DataTable } from "./components/data-table"
import { MilestoneDialog } from "./components/milestone-dialog"

export function Milestones() {
  const [milestones, setMilestones] = React.useState<Milestone[]>(MILESTONES)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Milestone | null>(null)
  const [deleting, setDeleting] = React.useState<Milestone | null>(null)

  const overdue = milestones.filter((m) => state(m) === "overdue").length

  function save(draft: MilestoneDraft) {
    if (editing) {
      setMilestones((prev) =>
        prev.map((m) => (m.id === editing.id ? { ...m, ...draft } : m))
      )
    } else {
      setMilestones((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), completedOn: "" },
      ])
    }
  }

  /** Signing off also finishes the scope; reopening leaves the counts alone. */
  function toggleComplete(milestone: Milestone) {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestone.id
          ? m.completedOn
            ? { ...m, completedOn: "" }
            : {
                ...m,
                completedOn: new Date().toISOString().slice(0, 10),
                tasksDone: m.tasksTotal,
              }
          : m
      )
    )
  }

  function confirmDelete() {
    if (!deleting) return
    setMilestones((prev) => prev.filter((m) => m.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Milestones"
      subtitle={`${openCount(milestones)} open · ${overdue} overdue`}
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
          New milestone
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {milestones.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No milestones</EmptyTitle>
              <EmptyDescription>
                Add a milestone to track a delivery date.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            milestones={milestones}
            onEdit={(milestone) => {
              setEditing(milestone)
              setFormOpen(true)
            }}
            onToggleComplete={toggleComplete}
            onDelete={setDeleting}
          />
        )}
      </div>

      <MilestoneDialog
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
            <AlertDialogTitle>Delete milestone</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.name}</span>? This
              action can&apos;t be undone.
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
