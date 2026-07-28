"use client"

import * as React from "react"
import {
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

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
import {
  dataGridGetColumnCanGlobalFilter,
  dataGridGlobalFilterFn,
} from "@/registry/bases/base/workspaceui/data-search"
import type { Payment } from "../data"
import { columns } from "./columns"

interface DataTableProps {
  data: Payment[]
}

export function DataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState(initialData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false)

  // useReactTable() intentionally returns fresh functions each render; see
  // data-grid.tsx's (examples) identical eslint-disable for the same reason.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    globalFilterFn: dataGridGlobalFilterFn,
    getColumnCanGlobalFilter: dataGridGetColumnCanGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // DataGrid renders its pagination footer off the presence of this model.
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, rowSelection },
  })

  function deleteRow(rowId: string) {
    setData((prev) => prev.filter((row) => row.id !== rowId))
  }

  const selectedIds = Object.keys(rowSelection)

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Search, filter, and columns all live in DataGrid's own toolbar. */}
      <div className="relative flex-1 overflow-auto">
        <DataGrid
          table={table}
          onCellEdit={(rowId, columnId, value) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === rowId ? { ...row, [columnId]: value } : row
              )
            )
          }}
          onRowDelete={deleteRow}
        />
        <BulkToolbar
          count={selectedIds.length}
          onClear={() => setRowSelection({})}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2"
        >
          <Button
            variant="destructive"
            size="sm"
            className="bg-destructive text-white hover:bg-destructive/90"
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
      </div>

      <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
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
                // Reuses the single-row onRowDelete path — there's no
                // separate bulk-delete callback.
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
  )
}
