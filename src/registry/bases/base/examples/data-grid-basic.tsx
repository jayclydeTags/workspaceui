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
  { accessorKey: "title", header: "Title", meta: { type: "text" } },
  { accessorKey: "estimate", header: "Estimate (h)", meta: { type: "number" } },
]

export function DataGridBasicDemo() {
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
    <div className="w-full min-w-0">
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
