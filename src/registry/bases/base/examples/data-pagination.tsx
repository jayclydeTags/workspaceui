"use client"

import {
  flexRender,
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataPagination } from "@/registry/bases/base/workspaceui/data-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Invoice {
  id: string
  customer: string
  amount: number
}

const data: Invoice[] = Array.from({ length: 42 }, (_, i) => ({
  id: String(i + 1),
  customer: `Customer ${i + 1}`,
  amount: 100 + i * 37,
}))

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
  },
]

export function DataPaginationDemo() {
  // useReactTable() intentionally returns fresh functions each render; see
  // data-search.tsx's identical eslint-disable for the same reason.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex w-full flex-col gap-3">
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DataPagination table={table} />
    </div>
  )
}
