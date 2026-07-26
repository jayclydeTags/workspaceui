"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ListPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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

export function DataGridEmptyStateDemo() {
  const [data, setData] = React.useState<Task[]>([])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  const addTask = () => {
    setData((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...getDataGridRowDefaults(table) } as Task,
    ])
  }

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
        onRowAdd={addTask}
        onRowDelete={(rowId) => {
          setData((prev) => prev.filter((row) => row.id !== rowId))
        }}
        emptyState={
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListPlusIcon />
              </EmptyMedia>
              <EmptyTitle>No tasks yet</EmptyTitle>
              <EmptyDescription>
                Add your first task to start tracking estimates.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" onClick={addTask}>
                Add task
              </Button>
            </EmptyContent>
          </Empty>
        }
      />
    </div>
  )
}
