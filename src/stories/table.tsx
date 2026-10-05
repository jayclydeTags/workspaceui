"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { defineStory } from "@/components/studio/studio"

interface Args {
  rows: number
  caption: boolean
  footer: boolean
}

const INVOICES = [
  ["INV001", "Paid", "Credit Card", 250],
  ["INV002", "Pending", "PayPal", 150],
  ["INV003", "Unpaid", "Bank Transfer", 350],
  ["INV004", "Paid", "Credit Card", 450],
  ["INV005", "Paid", "PayPal", 550],
] as const

function Preview({ rows, caption, footer }: Args) {
  const shown = INVOICES.slice(0, Math.min(Math.max(rows, 1), INVOICES.length))
  const total = shown.reduce((sum, row) => sum + row[3], 0)
  return (
    <Table className="w-full max-w-lg">
      {caption && <TableCaption>A list of recent invoices.</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shown.map(([id, status, method, amount]) => (
          <TableRow key={id}>
            <TableCell>{id}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{method}</TableCell>
            <TableCell className="text-right">${amount}.00</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {footer && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">${total}.00</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}

export default defineStory<Args>({
  args: { rows: 3, caption: true, footer: true },
  controls: {
    rows: { type: "number", min: 1, max: INVOICES.length },
    caption: { type: "boolean", group: "style" },
    footer: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
