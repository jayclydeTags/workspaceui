"use client"

import * as React from "react"
import { Trash2Icon } from "lucide-react"
import {
  type ColumnDef,
  type RowSelectionState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"
import {
  DataGrid,
  getDataGridRowDefaults,
} from "@/registry/bases/base/workspaceui/data-grid"

interface Contact {
  id: string
  name: string
  email: string
  seats: number
  mrr: number
  plan: string
  active: boolean
  renewsOn: string
  tags: string[]
  owner: string | null
}

const owners = [
  { id: "u1", name: "Priya Patel" },
  { id: "u2", name: "Sam Okafor" },
]

const initialData: Contact[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    seats: 12,
    mrr: 490,
    plan: "team",
    active: true,
    renewsOn: "2026-03-01",
    tags: ["champion", "renewal-risk"],
    owner: "u1",
  },
  {
    id: "2",
    name: "Grace Hopper",
    email: "grace@example.com",
    seats: 3,
    mrr: 90,
    plan: "starter",
    active: true,
    renewsOn: "2026-01-15",
    tags: [],
    owner: null,
  },
  {
    id: "3",
    name: "Katherine Johnson",
    email: "katherine@example.com",
    seats: 40,
    mrr: 1990,
    plan: "enterprise",
    active: false,
    renewsOn: "2026-05-20",
    tags: ["champion"],
    owner: "u2",
  },
]

const columns: ColumnDef<Contact>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "email", header: "Email", meta: { type: "text" } },
  { accessorKey: "seats", header: "Seats", meta: { type: "number" } },
  { accessorKey: "mrr", header: "MRR", meta: { type: "currency" } },
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
  { accessorKey: "renewsOn", header: "Renews on", meta: { type: "date" } },
  {
    accessorKey: "tags",
    header: "Tags",
    meta: {
      type: "multiSelect",
      options: [
        { value: "champion", label: "Champion" },
        { value: "renewal-risk", label: "Renewal risk" },
        { value: "upsell", label: "Upsell" },
      ],
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    meta: { type: "user", users: owners },
  },
]

export function DataGridLiveDemo() {
  const [data, setData] = React.useState(initialData)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false)

  // useReactTable() intentionally returns fresh functions each render; see
  // data-table.tsx's identical eslint-disable for the same reason.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    // DataGrid's leading checkbox column renders regardless (TanStack's own
    // row selection default) — controlling it here is only so this
    // component can read the selection to build the bulk bar below.
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  })

  function deleteRow(rowId: string) {
    setData((prev) => prev.filter((row) => row.id !== rowId))
  }

  const selectedIds = Object.keys(rowSelection)

  return (
    <div className="flex flex-col gap-3">
      <BulkToolbar
        count={selectedIds.length}
        onClear={() => setRowSelection({})}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmBulkDelete(true)}
        >
          <Trash2Icon data-icon="inline-start" />
          Delete
        </Button>
      </BulkToolbar>
      <DataGrid
        table={table}
        onCellEdit={async (rowId, columnId, value) => {
          // Simulated network latency so the pending spinner is visible; type
          // "error" into a cell to see the rejection path.
          await new Promise((resolve) => setTimeout(resolve, 600))
          if (typeof value === "string" && value.toLowerCase() === "error") {
            throw new Error("The server rejected this value.")
          }
          setData((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          )
        }}
        onRowAdd={(afterRowId) => {
          const row = {
            id: crypto.randomUUID(),
            ...getDataGridRowDefaults(table),
          } as Contact
          setData((prev) => {
            if (afterRowId == null) return [...prev, row]
            const index = prev.findIndex((r) => r.id === afterRowId)
            return [...prev.slice(0, index + 1), row, ...prev.slice(index + 1)]
          })
        }}
        onRowDelete={deleteRow}
      />
      <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.length} rows
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmBulkDelete(false)
                // Reuses the single-row onRowDelete path — there's no
                // separate bulk-delete callback.
                selectedIds.forEach(deleteRow)
                setRowSelection({})
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
