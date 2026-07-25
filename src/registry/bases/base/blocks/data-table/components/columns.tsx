import type { ColumnDef } from "@tanstack/react-table"

import { dataGridFilterFn } from "@/registry/bases/base/workspaceui/data-filter"
import type { Payment } from "../data"

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
]
