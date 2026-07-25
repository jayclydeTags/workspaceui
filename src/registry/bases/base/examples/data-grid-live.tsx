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

interface Contact {
  id: string
  name: string
  email: string
  seats: number
  mrr: number
  plan: string
  active: boolean
  renewsOn: string
}

const initialData: Contact[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    seats: 12,
    mrr: 490,
    plan: "team",
    active: true,
    renewsOn: "2026-03-01",
  },
  {
    id: "2",
    name: "Grace Hopper",
    email: "grace@example.com",
    seats: 3,
    mrr: 90,
    plan: "starter",
    active: true,
    renewsOn: "2026-01-15",
  },
  {
    id: "3",
    name: "Katherine Johnson",
    email: "katherine@example.com",
    seats: 40,
    mrr: 1990,
    plan: "enterprise",
    active: false,
    renewsOn: "2026-05-20",
  },
]

const columns: ColumnDef<Contact>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "email", header: "Email", meta: { type: "text" } },
  { accessorKey: "seats", header: "Seats", meta: { type: "number" } },
  { accessorKey: "mrr", header: "MRR", meta: { type: "currency" } },
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

export function DataGridLiveDemo() {
  const [data, setData] = React.useState(initialData)

  // useReactTable() intentionally returns fresh functions each render; see
  // data-table.tsx's identical eslint-disable for the same reason.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <DataGrid
      table={table}
      onCellEdit={async (rowId, columnId, value) => {
        // Simulated network latency so the pending spinner is visible; type
        // "error" into a cell to see the rejection path.
        await new Promise((resolve) => setTimeout(resolve, 600))
        if (typeof value === "string" && value.toLowerCase() === "error") {
          throw new Error("The server rejected this value.")
        }
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
        } as Contact
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
  )
}
