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
  DEDUCTIONS_BENEFITS,
  type DeductionBenefit,
  type DeductionBenefitDraft,
} from "./data"
import { DataTable } from "./components/data-table"
import { ItemDialog } from "./components/item-dialog"

export function DeductionsBenefits01() {
  const [items, setItems] = React.useState<DeductionBenefit[]>(
    DEDUCTIONS_BENEFITS
  )
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<DeductionBenefit | null>(null)
  const [deleting, setDeleting] = React.useState<DeductionBenefit | null>(
    null
  )

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(item: DeductionBenefit) {
    setEditing(item)
    setFormOpen(true)
  }

  function save(draft: DeductionBenefitDraft) {
    if (editing) {
      setItems((prev) =>
        prev.map((i) => (i.id === editing.id ? { ...i, ...draft } : i))
      )
    } else {
      setItems((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), enrolled: 0 },
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setItems((prev) => prev.filter((i) => i.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Deductions & benefits"
      subtitle={`${items.length} items`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New item
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No deductions or benefits</EmptyTitle>
              <EmptyDescription>
                Add a deduction or benefit plan to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable items={items} onEdit={openEdit} onDelete={setDeleting} />
        )}
      </div>

      <ItemDialog
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
            <AlertDialogTitle>Delete item</AlertDialogTitle>
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
