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
import { BILLS, type Bill, type BillDraft } from "./data"
import { DataTable } from "./components/data-table"
import { BillDialog } from "./components/bill-dialog"

export function Bills01() {
  const [bills, setBills] = React.useState<Bill[]>(BILLS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Bill | null>(null)
  const [deleting, setDeleting] = React.useState<Bill | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(bill: Bill) {
    setEditing(bill)
    setFormOpen(true)
  }

  function save(draft: BillDraft) {
    if (editing) {
      setBills((prev) =>
        prev.map((b) => (b.id === editing.id ? { ...b, ...draft } : b))
      )
    } else {
      setBills((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setBills((prev) => prev.filter((b) => b.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Bills"
      subtitle={`${bills.length} bills`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New bill
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {bills.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No bills</EmptyTitle>
              <EmptyDescription>
                Create a bill to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable bills={bills} onEdit={openEdit} onDelete={setDeleting} />
        )}
      </div>

      <BillDialog
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
            <AlertDialogTitle>Delete bill</AlertDialogTitle>
            <AlertDialogDescription>
              Delete{" "}
              <span className="font-medium">{deleting?.billNumber}</span>?
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
