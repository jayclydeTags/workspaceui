import type { ColumnDef } from "@tanstack/react-table"

import { dataGridFilterFn } from "@/registry/bases/base/workspaceui/data-filter"
import { PAYMENT_AGENTS, type Payment } from "../data"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    filterFn: dataGridFilterFn,
    meta: {
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "success", label: "Success" },
        { value: "failed", label: "Failed" },
      ],
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    filterFn: dataGridFilterFn,
    meta: { type: "text" },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    filterFn: dataGridFilterFn,
    meta: { type: "currency" },
  },
  {
    accessorKey: "paidAt",
    header: "Paid at",
    filterFn: dataGridFilterFn,
    meta: { type: "date" },
  },
  {
    accessorKey: "flagged",
    header: "Flagged",
    filterFn: dataGridFilterFn,
    meta: { type: "boolean" },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    filterFn: dataGridFilterFn,
    meta: {
      type: "multiSelect",
      options: [
        { value: "recurring", label: "Recurring" },
        { value: "high-value", label: "High value" },
        { value: "disputed", label: "Disputed" },
        { value: "refunded", label: "Refunded" },
      ],
    },
  },
  {
    accessorKey: "processedBy",
    header: "Processed by",
    filterFn: dataGridFilterFn,
    meta: { type: "user", users: PAYMENT_AGENTS },
  },
]
