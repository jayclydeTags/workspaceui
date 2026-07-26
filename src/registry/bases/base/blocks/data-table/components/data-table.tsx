"use client"

import * as React from "react"
import {
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Trash2Icon } from "lucide-react"

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
import { DataFilter } from "@/registry/bases/base/workspaceui/data-filter"
import { DataGrid } from "@/registry/bases/base/workspaceui/data-grid"
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, rowSelection },
  })

  function deleteRow(rowId: string) {
    setData((prev) => prev.filter((row) => row.id !== rowId))
  }

  const selectedIds = Object.keys(rowSelection)

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* min-w-0 lets this shrink below its content's natural width when
            BulkToolbar appears; flex-1 is what gives DataFilter's own
            ResizeObserver a real width to measure instead of shrink-wrapping
            to its buttons and reading permanently narrow. */}
        <div className="min-w-0 flex-1">
          <DataFilter table={table} />
        </div>
        <BulkToolbar
          count={selectedIds.length}
          onClear={() => setRowSelection({})}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmBulkDelete(true)}
          >
            <Trash2Icon data-icon="inline-start" />
            Delete
          </Button>
        </BulkToolbar>
      </div>

      <div className="flex-1 overflow-auto">
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
