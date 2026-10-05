"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataGrid } from "@/registry/bases/base/workspaceui/data-grid"

interface Contact {
  id: string
  name: string
  email: string
  seats: number
  mrr: number
  plan: string
  active: boolean
  renewsOn: string
  tags: string[]
  owner: string | null
}

const owners = [
  { id: "u1", name: "Priya Patel" },
  { id: "u2", name: "Sam Okafor" },
]

const data: Contact[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    seats: 12,
    mrr: 490,
    plan: "team",
    active: true,
    renewsOn: "2026-03-01",
    tags: ["champion", "renewal-risk"],
    owner: "u1",
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
    tags: [],
    owner: null,
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
  {
    accessorKey: "tags",
    header: "Tags",
    meta: {
      type: "multiSelect",
      options: [
        { value: "champion", label: "Champion" },
        { value: "renewal-risk", label: "Renewal risk" },
        { value: "upsell", label: "Upsell" },
      ],
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    meta: { type: "user", users: owners },
  },
]

export function DataGridAllColumnTypesDemo() {
  const [rows, setRows] = React.useState(data)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    <div className="w-full min-w-0">
      <DataGrid.Root
        table={table}
        onCellEdit={(rowId, columnId, value) => {
          setRows((prev) =>
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
