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
import { WAREHOUSES, type Warehouse, type WarehouseDraft } from "./data"
import { DataTable } from "./components/data-table"
import { WarehouseDialog } from "./components/warehouse-dialog"

export function Warehouses() {
  const [warehouses, setWarehouses] = React.useState<Warehouse[]>(WAREHOUSES)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Warehouse | null>(null)
  const [deleting, setDeleting] = React.useState<Warehouse | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(warehouse: Warehouse) {
    setEditing(warehouse)
    setFormOpen(true)
  }

  function save(draft: WarehouseDraft) {
    if (editing) {
      setWarehouses((prev) =>
        prev.map((w) => (w.id === editing.id ? { ...w, ...draft } : w))
      )
    } else {
      setWarehouses((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), used: 0 },
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setWarehouses((prev) => prev.filter((w) => w.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Warehouses"
      subtitle={`${warehouses.length} warehouses`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New warehouse
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {warehouses.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No warehouses</EmptyTitle>
              <EmptyDescription>
                Create a warehouse to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            warehouses={warehouses}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )}
      </div>

      <WarehouseDialog
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
            <AlertDialogTitle>Delete warehouse</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.code}</span>? This
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
