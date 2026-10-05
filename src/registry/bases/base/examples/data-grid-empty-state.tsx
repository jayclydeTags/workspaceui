"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import { ListPlusIcon } from "@hugeicons/core-free-icons"

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
      <DataGrid.Root
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
        <DataGrid.Table
          emptyState={
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={ListPlusIcon} strokeWidth={2} />
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
        <DataGrid.Pagination />
      </DataGrid.Root>
    </div>
  )
}
