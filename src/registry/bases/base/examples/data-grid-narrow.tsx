"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataGrid } from "@/registry/bases/base/workspaceui/data-grid"

interface Task {
  id: string
  title: string
  estimate: number
}

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    meta: { type: "text", summary: true },
  },
  {
    accessorKey: "estimate",
    header: "Estimate (h)",
    meta: { type: "number", summary: true },
  },
]

export function DataGridNarrowDemo() {
  const [data, setData] = React.useState<Task[]>([
    { id: "1", title: "Design onboarding flow", estimate: 8 },
    { id: "2", title: "Fix invoice rounding bug", estimate: 3 },
  ])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    // Below DataGrid's 448px measured-container breakpoint, forcing the
    // card/drawer fallback without needing to resize the browser window.
    <div className="mx-auto w-[320px] min-w-0">
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
    </div>
  )
}
