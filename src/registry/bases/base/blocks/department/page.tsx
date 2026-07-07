"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { DEPARTMENTS, type Department, type DepartmentDraft } from "./data"
import { DataTable } from "./components/data-table"
import { DepartmentDialog } from "./components/department-dialog"

export function Department() {
  const [departments, setDepartments] =
    React.useState<Department[]>(DEPARTMENTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Department | null>(null)
  const [deleting, setDeleting] = React.useState<Department | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(dept: Department) {
    setEditing(dept)
    setFormOpen(true)
  }

  function save(draft: DepartmentDraft) {
    if (editing) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...draft } : d))
      )
    } else {
      setDepartments((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), headcount: 0 },
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setDepartments((prev) => prev.filter((d) => d.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Departments"
      subtitle={`${departments.length} departments`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New department
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {departments.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No departments</EmptyTitle>
              <EmptyDescription>
                Create a department to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            departments={departments}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )}
      </div>

      <DepartmentDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSubmit={save}
      />

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete department</DialogTitle>
            <DialogDescription>
              Delete <span className="font-medium">{deleting?.name}</span>? This
              action can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  )
}
