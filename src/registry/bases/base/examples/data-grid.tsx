"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataGrid } from "@/registry/bases/base/workspaceui/data-grid"

interface Contact {
  id: string
  name: string
  seats: number
  plan: string
  active: boolean
  renewsOn: string
}

const initialData: Contact[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    seats: 12,
    plan: "team",
    active: true,
    renewsOn: "2026-03-01",
  },
  {
    id: "2",
    name: "Grace Hopper",
    seats: 3,
    plan: "starter",
    active: true,
    renewsOn: "2026-01-15",
  },
  {
    id: "3",
    name: "Katherine Johnson",
    seats: 40,
    plan: "enterprise",
    active: false,
    renewsOn: "2026-05-20",
  },
]

const columns: ColumnDef<Contact>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "seats", header: "Seats", meta: { type: "number" } },
  {
    accessorKey: "plan",
    header: "Plan",
    meta: {
      type: "select",
      options: [
        { value: "starter", label: "Starter" },
        { value: "team", label: "Team" },
        { value: "enterprise", label: "Enterprise" },
      ],
    },
  },
  { accessorKey: "active", header: "Active", meta: { type: "boolean" } },
  { accessorKey: "renewsOn", header: "Renews on", meta: { type: "date" } },
]

export function DataGridDemo() {
  const [data, setData] = React.useState(initialData)
  // Wiring getSortedRowModel is what surfaces the header's sort affordance.
  const [sorting, setSorting] = React.useState<SortingState>([])

  // useReactTable() intentionally returns fresh functions each render; see
  // data-table.tsx's identical eslint-disable for the same reason.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
    state: { sorting },
    onSortingChange: setSorting,
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
