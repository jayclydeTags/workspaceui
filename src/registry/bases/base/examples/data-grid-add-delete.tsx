"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  DataGrid,
  getDataGridRowDefaults,
} from "@/registry/bases/base/workspaceui/data-grid"

interface Task {
  id: string
  title: string
  estimate: number
}

const columns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title", meta: { type: "text" } },
  { accessorKey: "estimate", header: "Estimate (h)", meta: { type: "number" } },
]

export function DataGridAddDeleteDemo() {
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
        onRowAdd={(afterRowId) => {
          const row = {
            id: crypto.randomUUID(),
            ...getDataGridRowDefaults(table),
          } as Task
          setData((prev) => {
            if (afterRowId == null) return [...prev, row]
            const index = prev.findIndex((r) => r.id === afterRowId)
            return [...prev.slice(0, index + 1), row, ...prev.slice(index + 1)]
          })
        }}
        onRowDelete={(rowId) => {
          setData((prev) => prev.filter((row) => row.id !== rowId))
        }}
      />
    </div>
  )
}
