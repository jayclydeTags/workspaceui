"use client"

import {
  flexRender,
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
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
import { DataPagination } from "@/registry/bases/base/workspaceui/data-pagination"

interface Invoice {
  id: string
  customer: string
  amount: number
}

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
  },
]

interface Args {
  rows: number
  pageSizeOptions: number[]
}

function Preview({ rows, pageSizeOptions }: Args) {
  const data: Invoice[] = Array.from(
    { length: Math.max(0, Math.min(rows, 500)) },
    (_, i) => ({
      id: String(i + 1),
      customer: `Customer ${i + 1}`,
      amount: 100 + i * 37,
    })
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg bg-background p-3">
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
      <DataPagination
        table={table}
        pageSizeOptions={pageSizeOptions.length ? pageSizeOptions : undefined}
      />
    </div>
  )
}

export default defineStory<Args>({
  args: { rows: 42, pageSizeOptions: [5, 10, 20] },
  controls: {
    rows: {
      type: "number",
      min: 0,
      max: 500,
      description: "Rows in the demo table (playground only).",
    },
    pageSizeOptions: {
      type: "numbers",
      description:
        "Choices in the rows-per-page select. Empty = 10/20/30/40/50.",
    },
  },
  preview: Preview,
})
