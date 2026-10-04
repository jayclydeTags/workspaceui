"use client"

import {
  flexRender,
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  DataFilter,
  dataGridFilterFn,
} from "@/registry/bases/base/workspaceui/data-filter"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Task {
  id: string
  title: string
  status: string
  priority: number
  done: boolean
}

const data: Task[] = [
  {
    id: "1",
    title: "Design onboarding flow",
    status: "In Progress",
    priority: 2,
    done: false,
  },
  {
    id: "2",
    title: "Fix invoice rounding bug",
    status: "Done",
    priority: 1,
    done: true,
  },
  {
    id: "3",
    title: "Write Q3 report",
    status: "Todo",
    priority: 3,
    done: false,
  },
  {
    id: "4",
    title: "Review PR #482",
    status: "In Progress",
    priority: 1,
    done: false,
  },
]

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    meta: { type: "text" },
    filterFn: dataGridFilterFn,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "select",
      options: [
        { value: "Todo", label: "Todo" },
        { value: "In Progress", label: "In Progress" },
        { value: "Done", label: "Done" },
      ],
    },
    filterFn: dataGridFilterFn,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    meta: { type: "number" },
    filterFn: dataGridFilterFn,
  },
  {
    accessorKey: "done",
    header: "Done",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
    meta: { type: "boolean" },
    filterFn: dataGridFilterFn,
  },
]

export function DataFilterDemo() {
  // useReactTable() intentionally returns fresh functions each render; see
  // data-table.tsx's identical eslint-disable for the same reason.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex flex-col gap-3">
      <DataFilter table={table} />
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
