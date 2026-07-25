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

// Every example wraps its grid in min-w-0 — inside a flex/grid ancestor a
// wide table otherwise refuses to shrink below its intrinsic width (the
// classic flexbox min-width:auto trap), which pushes it past the preview
// shell instead of scrolling inside it.
function PreviewFrame({ children }: { children: React.ReactNode }) {
  return <div className="w-full min-w-0">{children}</div>
}

// ── Basic editing ───────────────────────────────────────────────────────

interface Task {
  id: string
  title: string
  estimate: number
}

const basicColumns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title", meta: { type: "text" } },
  { accessorKey: "estimate", header: "Estimate (h)", meta: { type: "number" } },
]

export function DataGridBasicDemo() {
  const [data, setData] = React.useState<Task[]>([
    { id: "1", title: "Design onboarding flow", estimate: 8 },
    { id: "2", title: "Fix invoice rounding bug", estimate: 3 },
  ])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: basicColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    <PreviewFrame>
      <DataGrid
        table={table}
        onCellEdit={(rowId, columnId, value) => {
          setData((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          )
        }}
      />
    </PreviewFrame>
  )
}

// ── All column types ────────────────────────────────────────────────────

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

const allTypesData: Contact[] = [
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
]

const allTypesColumns: ColumnDef<Contact>[] = [
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

export function DataGridAllColumnTypesDemo() {
  const [data, setData] = React.useState(allTypesData)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: allTypesColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    <PreviewFrame>
      <DataGrid
        table={table}
        onCellEdit={(rowId, columnId, value) => {
          setData((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          )
        }}
      />
    </PreviewFrame>
  )
}

// ── Row add & delete ────────────────────────────────────────────────────

const addDeleteColumns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title", meta: { type: "text" } },
  { accessorKey: "estimate", header: "Estimate (h)", meta: { type: "number" } },
]

export function DataGridAddDeleteDemo() {
  const [data, setData] = React.useState<Task[]>([
    { id: "1", title: "Design onboarding flow", estimate: 8 },
    { id: "2", title: "Fix invoice rounding bug", estimate: 3 },
  ])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: addDeleteColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    <PreviewFrame>
      <DataGrid
        table={table}
        onCellEdit={(rowId, columnId, value) => {
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
          } as Task
          setData((prev) => {
            if (afterRowId == null) return [...prev, row]
            const index = prev.findIndex((r) => r.id === afterRowId)
            return [...prev.slice(0, index + 1), row, ...prev.slice(index + 1)]
          })
        }}
        onRowDelete={(rowId) => {
          setData((prev) => prev.filter((row) => row.id !== rowId))
        }}
      />
    </PreviewFrame>
  )
}

// ── Row selection & bulk delete ─────────────────────────────────────────

const selectionColumns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title", meta: { type: "text" } },
  { accessorKey: "estimate", header: "Estimate (h)", meta: { type: "number" } },
]

export function DataGridSelectionDemo() {
  const [data, setData] = React.useState<Task[]>([
    { id: "1", title: "Design onboarding flow", estimate: 8 },
    { id: "2", title: "Fix invoice rounding bug", estimate: 3 },
    { id: "3", title: "Write Q3 report", estimate: 5 },
  ])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: selectionColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  })

  function deleteRow(rowId: string) {
    setData((prev) => prev.filter((row) => row.id !== rowId))
  }

  const selectedIds = Object.keys(rowSelection)

  return (
    <PreviewFrame>
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
          onCellEdit={(rowId, columnId, value) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === rowId ? { ...row, [columnId]: value } : row
              )
            )
          }}
        />
        <AlertDialog
          open={confirmBulkDelete}
          onOpenChange={setConfirmBulkDelete}
        >
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
    </PreviewFrame>
  )
}

// ── Read-only & editable columns mixed ──────────────────────────────────

interface Order {
  id: string
  reference: string
  customer: string
  status: string
}

const mixedColumns: ColumnDef<Order>[] = [
  // No meta.type — renders through its normal TanStack cell, read-only.
  { accessorKey: "reference", header: "Order #" },
  { accessorKey: "customer", header: "Customer", meta: { type: "text" } },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
      ],
    },
  },
]

export function DataGridMixedEditableDemo() {
  const [data, setData] = React.useState<Order[]>([
    {
      id: "1",
      reference: "#1001",
      customer: "Ada Lovelace",
      status: "pending",
    },
    {
      id: "2",
      reference: "#1002",
      customer: "Grace Hopper",
      status: "shipped",
    },
  ])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: mixedColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    <PreviewFrame>
      <DataGrid
        table={table}
        onCellEdit={(rowId, columnId, value) => {
          setData((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          )
        }}
      />
    </PreviewFrame>
  )
}

// ── Narrow container (card view) ────────────────────────────────────────

const narrowColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    meta: { type: "text", summary: true },
  },
  {
    accessorKey: "estimate",
    header: "Estimate (h)",
    meta: { type: "number", summary: true },
  },
]

export function DataGridNarrowDemo() {
  const [data, setData] = React.useState<Task[]>([
    { id: "1", title: "Design onboarding flow", estimate: 8 },
    { id: "2", title: "Fix invoice rounding bug", estimate: 3 },
  ])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: narrowColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })

  return (
    // Below DataGrid's 448px measured-container breakpoint, forcing the
    // card/drawer fallback without needing to resize the browser window.
    <div className="mx-auto w-[320px] min-w-0">
      <DataGrid
        table={table}
        onCellEdit={(rowId, columnId, value) => {
          setData((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          )
        }}
      />
    </div>
  )
}
