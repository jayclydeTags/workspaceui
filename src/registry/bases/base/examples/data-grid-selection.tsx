"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import {
  type ColumnDef,
  type RowSelectionState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

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
import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"
import { DataGrid } from "@/registry/bases/base/workspaceui/data-grid"

interface Task {
  id: string
  title: string
  estimate: number
}

const columns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title", meta: { type: "text" } },
  { accessorKey: "estimate", header: "Estimate (h)", meta: { type: "number" } },
]

export function DataGridSelectionDemo() {
  const [data, setData] = React.useState<Task[]>([
    { id: "1", title: "Design onboarding flow", estimate: 8 },
    { id: "2", title: "Fix invoice rounding bug", estimate: 3 },
    { id: "3", title: "Write Q3 report", estimate: 5 },
  ])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  })

  function deleteRow(rowId: string) {
    setData((prev) => prev.filter((row) => row.id !== rowId))
  }

  const selectedIds = Object.keys(rowSelection)

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3">
        <BulkToolbar
          count={selectedIds.length}
          onClear={() => setRowSelection({})}
        >
          <Button
            variant="destructive"
            size="sm"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90"
            onClick={() => setConfirmBulkDelete(true)}
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Delete
          </Button>
        </BulkToolbar>
        <DataGrid
          table={table}
          onCellEdit={(rowId, columnId, value) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === rowId ? { ...row, [columnId]: value } : row
              )
            )
          }}
        />
        <AlertDialog
          open={confirmBulkDelete}
          onOpenChange={setConfirmBulkDelete}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {selectedIds.length} rows
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  setConfirmBulkDelete(false)
                  selectedIds.forEach(deleteRow)
                  setRowSelection({})
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
