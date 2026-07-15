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
import { EMPLOYEES, type Employee, type EmployeeDraft } from "./data"
import { DataTable } from "./components/data-table"
import { EmployeeDialog } from "./components/employee-dialog"

export function Employee() {
  const [employees, setEmployees] = React.useState<Employee[]>(EMPLOYEES)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Employee | null>(null)
  const [deleting, setDeleting] = React.useState<Employee | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(employee: Employee) {
    setEditing(employee)
    setFormOpen(true)
  }

  function save(draft: EmployeeDraft) {
    if (editing) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...draft } : e))
      )
    } else {
      setEmployees((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setEmployees((prev) => prev.filter((e) => e.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Employees"
      subtitle={`${employees.length} employees`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New employee
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {employees.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No employees</EmptyTitle>
              <EmptyDescription>
                Add an employee to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            employees={employees}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )}
      </div>

      <EmployeeDialog
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
            <AlertDialogTitle>Delete employee</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.name}</span>?
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
