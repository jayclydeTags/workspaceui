"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { defineStory } from "@/components/studio/studio"
import {
  DataGrid,
  getDataGridRowDefaults,
} from "@/registry/bases/base/workspaceui/data-grid"

interface Contact {
  id: string
  name: string
  seats: number
  plan: string
  active: boolean
}

const INITIAL: Contact[] = [
  { id: "1", name: "Ada Lovelace", seats: 12, plan: "team", active: true },
  { id: "2", name: "Grace Hopper", seats: 3, plan: "starter", active: true },
  {
    id: "3",
    name: "Katherine Johnson",
    seats: 40,
    plan: "enterprise",
    active: false,
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
]

interface Args {
  empty: boolean
  rowAdd: boolean
  rowDelete: boolean
  narrowFallback: "cards" | "none"
}

function Preview({ empty, rowAdd, rowDelete, narrowFallback }: Args) {
  const [data, setData] = React.useState(INITIAL)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: empty ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    <div className="w-full min-w-0 rounded-lg bg-background">
      <DataGrid
        table={table}
        narrowFallback={narrowFallback}
        onCellEdit={(rowId, columnId, value) =>
          setData((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          )
        }
        onRowAdd={
          rowAdd
            ? (afterRowId) => {
                const row = {
                  id: crypto.randomUUID(),
                  ...getDataGridRowDefaults(table),
                } as Contact
                setData((prev) => {
                  if (afterRowId == null) return [...prev, row]
                  const index = prev.findIndex((r) => r.id === afterRowId)
                  return [
                    ...prev.slice(0, index + 1),
                    row,
                    ...prev.slice(index + 1),
                  ]
                })
              }
            : undefined
        }
        onRowDelete={
          rowDelete
            ? (rowId) =>
                setData((prev) => prev.filter((row) => row.id !== rowId))
            : undefined
        }
      />
    </div>
  )
}

export default defineStory<Args>({
  args: {
    empty: false,
    rowAdd: true,
    rowDelete: true,
    narrowFallback: "cards",
  },
  controls: {
    empty: {
      group: "style",
      type: "boolean",
      label: "No rows",
      description: "Empties the table to show the empty state.",
    },
    rowAdd: {
      type: "boolean",
      label: "onRowAdd",
      description: "Adds the add-row affordances.",
    },
    rowDelete: {
      type: "boolean",
      label: "onRowDelete",
      description: "Adds the delete-row affordance.",
    },
    narrowFallback: {
      group: "style",
      type: "select",
      options: ["cards", "none"],
      description:
        'Below 448px, "cards" swaps in a card list. Try the Mobile canvas width.',
    },
  },
  preview: Preview,
})
