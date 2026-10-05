"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataGrid } from "@/registry/bases/base/workspaceui/data-grid"

interface Order {
  id: string
  reference: string
  customer: string
  status: string
}

const columns: ColumnDef<Order>[] = [
  // No meta.type — renders through its normal TanStack cell, read-only.
  { accessorKey: "reference", header: "Order #" },
  { accessorKey: "customer", header: "Customer", meta: { type: "text" } },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
      ],
    },
  },
]

export function DataGridMixedEditableDemo() {
  const [data, setData] = React.useState<Order[]>([
    {
      id: "1",
      reference: "#1001",
      customer: "Ada Lovelace",
      status: "pending",
    },
    {
      id: "2",
      reference: "#1002",
      customer: "Grace Hopper",
      status: "shipped",
    },
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
