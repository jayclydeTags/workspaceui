"use client"

import {
  flexRender,
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { defineStory } from "@/components/studio/studio"
import {
  DataSearch,
  dataGridGetColumnCanGlobalFilter,
  dataGridGlobalFilterFn,
} from "@/registry/bases/base/workspaceui/data-search"

interface Task {
  id: string
  title: string
  status: string
  priority: number
}

const data: Task[] = [
  {
    id: "1",
    title: "Design onboarding flow",
    status: "In Progress",
    priority: 2,
  },
  { id: "2", title: "Fix invoice rounding bug", status: "Done", priority: 1 },
  { id: "3", title: "Write Q3 report", status: "Todo", priority: 3 },
  { id: "4", title: "Review PR #482", status: "In Progress", priority: 1 },
]

const columns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "priority", header: "Priority" },
]

interface Args {
  placeholder: string
}

function Preview({ placeholder }: Args) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    globalFilterFn: dataGridGlobalFilterFn,
    getColumnCanGlobalFilter: dataGridGetColumnCanGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg bg-background p-3">
      <DataSearch table={table} placeholder={placeholder || undefined} />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span className="text-muted-foreground">No results.</span>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default defineStory<Args>({
  args: { placeholder: "Search tasks..." },
  controls: { placeholder: { type: "text" } },
  preview: Preview,
})
