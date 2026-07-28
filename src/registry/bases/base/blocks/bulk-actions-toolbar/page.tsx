"use client"

import * as React from "react"
import {
  type ColumnDef,
  type RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon, Delete02Icon } from "@hugeicons/core-free-icons"

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
import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"
import { DataGrid } from "@/registry/bases/base/workspaceui/data-grid"
import {
  dataGridGetColumnCanGlobalFilter,
  dataGridGlobalFilterFn,
} from "@/registry/bases/base/workspaceui/data-search"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { DOCUMENTS, type Document } from "./data"

// No `meta.type` on any column: each renders through its TanStack cell and
// stays read-only. Selection is what this block is about, not editing.
const columns: ColumnDef<Document>[] = [
  { accessorKey: "name", header: "Name", meta: { summary: true } },
  { accessorKey: "owner", header: "Owner", meta: { summary: true } },
  { accessorKey: "size", header: "Size" },
]

export function BulkActionsToolbar() {
  const [docs, setDocs] = React.useState<Document[]>(DOCUMENTS)
  // Seeded so the toolbar — the point of this block — is on screen at a glance.
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({
    "1": true,
    "3": true,
  })
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  // useReactTable() intentionally returns fresh functions each render; see
  // data-grid.tsx's (examples) identical eslint-disable for the same reason.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: docs,
    columns,
    getRowId: (row) => row.id,
    globalFilterFn: dataGridGlobalFilterFn,
    getColumnCanGlobalFilter: dataGridGetColumnCanGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    // DataGrid renders its search box off the presence of this model.
    getFilteredRowModel: getFilteredRowModel(),
    state: { rowSelection },
  })

  const selectedIds = Object.keys(rowSelection)

  function deleteSelected() {
    setDocs((prev) => prev.filter((d) => !rowSelection[d.id]))
    setRowSelection({})
    setConfirmDelete(false)
  }

  return (
    <Page title="Documents" subtitle={`${docs.length} files`} hasPadding>
      <div className="relative flex h-full flex-col">
        <DataGrid
          table={table}
          // Required by DataGrid, but nothing here is editable.
          onCellEdit={() => {}}
          emptyState={
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No documents</EmptyTitle>
                <EmptyDescription>You deleted all of them.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          }
        />
        <BulkToolbar
          count={selectedIds.length}
          onClear={() => setRowSelection({})}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2"
        >
          <Button variant="outline" size="sm">
            <HugeiconsIcon
              icon={Download01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmDelete(true)}
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Delete
          </Button>
        </BulkToolbar>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.length} documents
            </AlertDialogTitle>
            <AlertDialogDescription>
              These files will be permanently deleted. This can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteSelected}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
