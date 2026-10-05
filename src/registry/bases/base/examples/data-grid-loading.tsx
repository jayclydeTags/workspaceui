"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

// The grid never owns data, so it never owns "data isn't here yet" either —
// render a skeleton with the same headers and swap in DataGrid once loaded.
export function DataGridLoadingDemo() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState<Task[]>([])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        { id: "1", title: "Design onboarding flow", estimate: 8 },
        { id: "2", title: "Fix invoice rounding bug", estimate: 3 },
      ])
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  if (isLoading) {
    return (
      <div className="w-full min-w-0 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Estimate (h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">
      <DataGrid.Root
        table={table}
        onCellEdit={(rowId, columnId, value) => {
          setData((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          )
        }}
      >
        <DataGrid.Toolbar>
          <DataGrid.Search />
          <DataGrid.ToolbarActions>
            <DataGrid.Filter />
            <DataGrid.Columns />
            <DataGrid.Options />
          </DataGrid.ToolbarActions>
        </DataGrid.Toolbar>
        <DataGrid.FilterChips />
        <DataGrid.Table />
        <DataGrid.Pagination />
      </DataGrid.Root>
    </div>
  )
}
