import * as React from "react"
import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"
import { resizeTo } from "@/test/setup"

import {
  DataGrid,
  getDataGridRowDefaults,
  type DataGridColumnLayout,
} from "../data-grid"
import "../data-grid-types"

interface Person {
  id: string
  name: string
  role: string
}

const defaultData: Person[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
]

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "role", header: "Role", meta: { type: "text" } },
]

type OnCellEdit = (
  rowId: string,
  columnId: string,
  value: unknown
) => void | Promise<void>

function Harness({
  data = defaultData,
  onCellEdit,
  onRowAdd,
  onRowDelete,
}: {
  data?: Person[]
  onCellEdit: OnCellEdit
  onRowAdd?: (afterRowId?: string) => void | Promise<void>
  onRowDelete?: (rowId: string) => void | Promise<void>
}) {
  // useReactTable() intentionally returns fresh functions each render — see
  // the same eslint-disable precedent in data-table.tsx.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })
  return (
    <DataGrid
      table={table}
      onCellEdit={onCellEdit}
      onRowAdd={onRowAdd}
      onRowDelete={onRowDelete}
    />
  )
}

// A 3-row fixture so range selection (anchor to a target two rows away) is
// actually meaningful — the 2-row Person data above can't exercise a
// multi-row extension.
const selectableData: Person[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
  { id: "3", name: "Katherine", role: "Mathematician" },
]

// Row selection is TanStack's own default-enabled table feature, so this
// harness controls it (state.rowSelection + onRowSelectionChange) only to
// make selection observable/assertable from the test, not to turn it on.
function SelectableHarness({
  onRowDelete,
}: {
  onRowDelete?: (rowId: string) => void | Promise<void>
}) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: selectableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  })
  return (
    <DataGrid table={table} onCellEdit={vi.fn()} onRowDelete={onRowDelete} />
  )
}

// The only opt-out: a consumer who doesn't want row selection at all turns
// it off the same way they would on any plain TanStack table.
function UnselectableHarness() {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: selectableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: false,
  })
  return <DataGrid table={table} onCellEdit={vi.fn()} />
}

// Mirrors the docs live example's composition: BulkToolbar (from the
// bulk-actions-toolbar block) reused verbatim above the grid, a "Delete"
// button that opens a confirm dialog, and onRowDelete looped over the
// selected ids on confirm — DataGrid itself has no bulk-action prop at all.
function BulkDeleteHarness({
  onRowDelete,
}: {
  onRowDelete: (rowId: string) => void
}) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: selectableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  })
  const selectedIds = Object.keys(rowSelection)

  return (
    <div>
      <BulkToolbar
        count={selectedIds.length}
        onClear={() => setRowSelection({})}
      >
        <Button size="sm" onClick={() => setConfirmBulkDelete(true)}>
          Delete
        </Button>
      </BulkToolbar>
      <DataGrid table={table} onCellEdit={vi.fn()} onRowDelete={onRowDelete} />
      <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.length} rows
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              setConfirmBulkDelete(false)
              selectedIds.forEach((rowId) => onRowDelete(rowId))
              setRowSelection({})
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

let nextNewRowId = 0

// Owns real data state and mutates it the way a consumer would: appends or
// inserts a row seeded via getDataGridRowDefaults, so the autofocus effect
// (which fires off an observed rowCount increase) has something real to
// react to.
function AddableHarness() {
  const [data, setData] = React.useState(defaultData)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  function handleRowAdd(afterRowId?: string) {
    const row: Person = {
      id: `new-${nextNewRowId++}`,
      name: "",
      role: "",
    }
    setData((prev) => {
      if (afterRowId == null) return [...prev, row]
      const idx = prev.findIndex((p) => p.id === afterRowId)
      return [...prev.slice(0, idx + 1), row, ...prev.slice(idx + 1)]
    })
  }

  return <DataGrid table={table} onCellEdit={vi.fn()} onRowAdd={handleRowAdd} />
}

interface Employee {
  id: string
  name: string
  email: string
  team: string
}

const employeeData: Employee[] = [
  { id: "1", name: "Ada", email: "ada@example.com", team: "Eng" },
  { id: "2", name: "Grace", email: "grace@example.com", team: "Navy" },
]

const employeeColumns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "email", header: "Email", meta: { type: "text" } },
  { accessorKey: "team", header: "Team", meta: { type: "text" } },
]

// A separate 3-column dataset/harness: the existing Person/columns fixtures
// above are hardcoded to 2 columns in several places (getCell, exact
// gridcell counts), and resize/pin/reorder need at least 3 to be meaningful.
function LayoutHarness({
  onColumnLayoutChange,
}: {
  onColumnLayoutChange?: (layout: DataGridColumnLayout) => void
}) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: employeeData,
    columns: employeeColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })
  return (
    <DataGrid
      table={table}
      onCellEdit={vi.fn()}
      onColumnLayoutChange={onColumnLayoutChange}
    />
  )
}

// Only this harness wires getSortedRowModel, so it's the one that surfaces the
// header's sort affordance (LayoutHarness above deliberately doesn't).
function SortableHarness() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: employeeData,
    columns: employeeColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    state: { sorting },
    onSortingChange: setSorting,
  })
  return <DataGrid table={table} onCellEdit={vi.fn()} />
}

interface Widget {
  id: string
  qty: number
  price: number
  status: string
  active: boolean
  shipsOn: string
}

const widgetData: Widget[] = [
  {
    id: "1",
    qty: 5,
    price: 9.5,
    status: "open",
    active: false,
    shipsOn: "2026-01-01",
  },
]

const widgetColumns: ColumnDef<Widget>[] = [
  { accessorKey: "qty", header: "Qty", meta: { type: "number" } },
  { accessorKey: "price", header: "Price", meta: { type: "currency" } },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "select",
      options: [
        { value: "open", label: "Open" },
        { value: "closed", label: "Closed" },
      ],
    },
  },
  { accessorKey: "active", header: "Active", meta: { type: "boolean" } },
  { accessorKey: "shipsOn", header: "Ships on", meta: { type: "date" } },
]

// One row, five typed columns — a dedicated fixture so each new editor gets
// its own commit-path test without disturbing the 2-column Person harness
// every other describe block indexes into.
function TypedHarness({ onCellEdit }: { onCellEdit: OnCellEdit }) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: widgetData,
    columns: widgetColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })
  return <DataGrid table={table} onCellEdit={onCellEdit} />
}

function renderTypedGrid() {
  const onCellEdit = vi.fn<OnCellEdit>()
  render(<TypedHarness onCellEdit={onCellEdit} />)
  return { onCellEdit }
}

interface Task {
  id: string
  tags: string[]
  owner: string | null
}

const tagOptions = [
  { value: "bug", label: "Bug" },
  { value: "urgent", label: "Urgent" },
  { value: "feature", label: "Feature" },
]

const gridUsers = [
  { id: "u1", name: "Ada Lovelace" },
  { id: "u2", name: "Grace Hopper" },
]

const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "tags",
    header: "Tags",
    meta: { type: "multiSelect", options: tagOptions, maxChips: 2 },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    meta: { type: "user", users: gridUsers },
  },
]

const taskData: Task[] = [{ id: "1", tags: [], owner: null }]

// Unlike TypedHarness, this one feeds a resolved edit back into its own data
// state — multiSelect's per-toggle dedup reads the *committed* table value
// on every toggle, so a realistic round trip needs the table to actually
// advance between toggles, not just record that onCellEdit was called.
function TaskHarness({
  onCellEdit,
  initialData = taskData,
}: {
  onCellEdit: OnCellEdit
  initialData?: Task[]
}) {
  const [data, setData] = React.useState(initialData)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: taskColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })
  return (
    <DataGrid
      table={table}
      onCellEdit={async (rowId, columnId, value) => {
        await onCellEdit(rowId, columnId, value)
        setData((prev) =>
          prev.map((row) =>
            row.id === rowId ? { ...row, [columnId]: value } : row
          )
        )
      }}
    />
  )
}

function renderTaskGrid(initialData?: Task[]) {
  const onCellEdit = vi.fn<OnCellEdit>().mockResolvedValue(undefined)
  render(<TaskHarness onCellEdit={onCellEdit} initialData={initialData} />)
  return { onCellEdit }
}

// A minimal DataTransfer stand-in — jsdom doesn't implement the real one,
// and getData() is only readable at drop time on the genuine API anyway.
function fakeDataTransfer() {
  let stored = ""
  return {
    effectAllowed: "",
    dropEffect: "",
    setData: (_type: string, value: string) => {
      stored = value
    },
    getData: () => stored,
  }
}

// jsdom's DragEvent constructor drops MouseEvent-only init fields like
// clientY (https://github.com/jsdom/jsdom/issues/1568 territory), so
// fireEvent.dragOver(el, { clientY }) silently no-ops it. Build the event via
// testing-library's own createEvent, then force clientY on afterward.
function fireDragOver(el: Element, dataTransfer: unknown, clientY: number) {
  const event = createEvent.dragOver(el, { dataTransfer })
  Object.defineProperty(event, "clientY", {
    value: clientY,
    configurable: true,
  })
  fireEvent(el, event)
}

function renderGrid(overrides: Partial<{ data: Person[] }> = {}) {
  const onCellEdit = vi.fn<OnCellEdit>()
  render(
    <Harness data={overrides.data ?? defaultData} onCellEdit={onCellEdit} />
  )
  return { onCellEdit }
}

function getCell(rowIndex: number, colIndex: number) {
  const cells = screen.getAllByRole("gridcell")
  return cells[rowIndex * 2 + colIndex]!
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

async function typeAndCommit(
  cell: HTMLElement,
  user: ReturnType<typeof userEvent.setup>,
  text: string
) {
  await user.click(cell)
  const input = within(cell).getByRole("textbox")
  await user.clear(input)
  await user.type(input, text)
  await user.tab()
}

// ── Narrow container fixture ────────────────────────────────────────────
// One row of every column type — text/number (positional summary), select,
// boolean, multiSelect, and user — so the drawer's per-type field rendering
// gets exercised in one harness rather than five.

interface Contact {
  id: string
  name: string
  email: string
  seats: number
  plan: string
  active: boolean
  tags: string[]
  owner: string | null
}

const planOptions = [
  { value: "starter", label: "Starter" },
  { value: "team", label: "Team" },
]

const contactTagOptions = [
  { value: "vip", label: "VIP" },
  { value: "risk", label: "Risk" },
]

const contactUsers = [
  { id: "u1", name: "Priya Patel" },
  { id: "u2", name: "Sam Okafor" },
]

const contactColumns: ColumnDef<Contact>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "email", header: "Email", meta: { type: "text" } },
  { accessorKey: "seats", header: "Seats", meta: { type: "number" } },
  {
    accessorKey: "plan",
    header: "Plan",
    meta: { type: "select", options: planOptions },
  },
  { accessorKey: "active", header: "Active", meta: { type: "boolean" } },
  {
    accessorKey: "tags",
    header: "Tags",
    meta: { type: "multiSelect", options: contactTagOptions },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    meta: { type: "user", users: contactUsers },
  },
]

// Same shape, but plan/active are flagged meta.summary instead of relying on
// column order — the override case.
const summaryFlaggedColumns: ColumnDef<Contact>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "email", header: "Email", meta: { type: "text" } },
  { accessorKey: "seats", header: "Seats", meta: { type: "number" } },
  {
    accessorKey: "plan",
    header: "Plan",
    meta: { type: "select", options: planOptions, summary: true },
  },
  {
    accessorKey: "active",
    header: "Active",
    meta: { type: "boolean", summary: true },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    meta: { type: "multiSelect", options: contactTagOptions },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    meta: { type: "user", users: contactUsers },
  },
]

const contactData: Contact[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    seats: 12,
    plan: "team",
    active: true,
    tags: ["vip"],
    owner: "u1",
  },
  {
    id: "2",
    name: "Grace Hopper",
    email: "grace@example.com",
    seats: 3,
    plan: "starter",
    active: false,
    tags: [],
    owner: null,
  },
]

function NarrowHarness({
  onCellEdit,
  onRowAdd,
  onRowDelete,
  narrowFallback,
  columns = contactColumns,
  initialData = contactData,
}: {
  onCellEdit: OnCellEdit
  onRowAdd?: (afterRowId?: string) => void | Promise<void>
  onRowDelete?: (rowId: string) => void | Promise<void>
  narrowFallback?: "cards" | "none"
  columns?: ColumnDef<Contact>[]
  initialData?: Contact[]
}) {
  const [data, setData] = React.useState(initialData)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })
  return (
    <DataGrid
      table={table}
      onCellEdit={async (rowId, columnId, value) => {
        await onCellEdit(rowId, columnId, value)
        setData((prev) =>
          prev.map((row) =>
            row.id === rowId ? { ...row, [columnId]: value } : row
          )
        )
      }}
      onRowAdd={onRowAdd}
      onRowDelete={onRowDelete}
      narrowFallback={narrowFallback}
    />
  )
}

function renderNarrow(
  overrides: Partial<{
    onRowAdd: (afterRowId?: string) => void | Promise<void>
    onRowDelete: (rowId: string) => void | Promise<void>
    narrowFallback: "cards" | "none"
    columns: ColumnDef<Contact>[]
    initialData: Contact[]
  }> = {}
) {
  const onCellEdit = vi.fn<OnCellEdit>().mockResolvedValue(undefined)
  const { container } = render(
    <NarrowHarness onCellEdit={onCellEdit} {...overrides} />
  )
  return { container, onCellEdit }
}

// DataGrid's own root div — the element containerRef/ResizeObserver
// actually watches — is the sole child Testing Library's own wrapper div,
// since NarrowHarness renders nothing else alongside <DataGrid />.
function gridRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function goNarrowGrid(container: HTMLElement, width = 320) {
  act(() => resizeTo(gridRoot(container), width))
}

describe("DataGrid", () => {
  describe("rendering", () => {
    it("exposes role=grid with row and gridcell semantics", () => {
      renderGrid()
      expect(screen.getByRole("grid")).toBeInTheDocument()
      expect(screen.getAllByRole("row")).toHaveLength(3) // header + 2 data rows
      expect(screen.getAllByRole("gridcell")).toHaveLength(4)
    })

    it("renders each cell's committed value in a textbox", () => {
      renderGrid()
      const cell = getCell(0, 0)
      expect(within(cell).getByRole("textbox")).toHaveValue("Ada")
    })

    it("renders a No results row when data is empty", () => {
      renderGrid({ data: [] })
      expect(screen.getByText("No results.")).toBeInTheDocument()
      expect(screen.queryAllByRole("gridcell")).toHaveLength(0)
    })
  })

  describe("roving tabindex", () => {
    it("keeps exactly one gridcell in the tab order", () => {
      renderGrid()
      const cells = screen.getAllByRole("gridcell")
      const tabbable = cells.filter((c) => c.getAttribute("tabindex") === "0")
      expect(tabbable).toHaveLength(1)
      expect(tabbable[0]).toBe(cells[0])
    })

    it("moves the tabbable cell on arrow key navigation", async () => {
      const user = userEvent.setup()
      renderGrid()
      getCell(0, 0).focus()
      await user.keyboard("{ArrowRight}")
      expect(getCell(0, 1)).toHaveAttribute("tabindex", "0")
      expect(getCell(0, 0)).toHaveAttribute("tabindex", "-1")
      expect(getCell(0, 1)).toHaveFocus()
    })

    it("Tab moves to the next cell and wraps at the last row", async () => {
      const user = userEvent.setup()
      renderGrid()
      getCell(1, 1).focus()
      await user.keyboard("{Tab}")
      expect(getCell(0, 0)).toHaveFocus()
    })

    it("Shift+Tab moves to the previous cell and wraps at the first row", async () => {
      const user = userEvent.setup()
      renderGrid()
      getCell(0, 0).focus()
      await user.keyboard("{Shift>}{Tab}{/Shift}")
      expect(getCell(1, 1)).toHaveFocus()
    })

    it("Enter/Shift+Enter move down/up without entering edit mode", async () => {
      const user = userEvent.setup()
      renderGrid()
      getCell(0, 0).focus()
      await user.keyboard("{Enter}")
      expect(getCell(1, 0)).toHaveFocus()
      expect(within(getCell(1, 0)).getByRole("textbox")).toHaveAttribute(
        "readonly"
      )
      await user.keyboard("{Shift>}{Enter}{/Shift}")
      expect(getCell(0, 0)).toHaveFocus()
    })
  })

  describe("editing", () => {
    it("clicking a cell enters edit mode and focuses the control", async () => {
      const user = userEvent.setup()
      renderGrid()
      const cell = getCell(0, 0)
      await user.click(cell)
      const input = within(cell).getByRole("textbox")
      expect(input).not.toHaveAttribute("readonly")
      expect(input).toHaveFocus()
    })

    it("commits the edit on blur", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderGrid()
      const cell = getCell(0, 0)
      await user.click(cell)
      const input = within(cell).getByRole("textbox")
      await user.clear(input)
      await user.type(input, "Updated")
      await user.tab()
      expect(onCellEdit).toHaveBeenCalledWith("1", "name", "Updated")
    })

    it("commits the edit on Enter", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderGrid()
      const cell = getCell(0, 0)
      await user.click(cell)
      const input = within(cell).getByRole("textbox")
      await user.clear(input)
      await user.type(input, "Updated{Enter}")
      expect(onCellEdit).toHaveBeenCalledWith("1", "name", "Updated")
    })

    it("Escape resets the live buffer and returns focus to the gridcell", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderGrid()
      const cell = getCell(0, 0)
      await user.click(cell)
      const input = within(cell).getByRole("textbox")
      await user.clear(input)
      await user.type(input, "Discard me")
      await user.keyboard("{Escape}")
      expect(onCellEdit).not.toHaveBeenCalled()
      expect(cell).toHaveFocus()
      expect(within(cell).getByRole("textbox")).toHaveValue("Ada")
    })

    it("F2 enters edit mode preserving content", async () => {
      const user = userEvent.setup()
      renderGrid()
      const cell = getCell(0, 0)
      cell.focus()
      await user.keyboard("{F2}")
      const input = within(cell).getByRole("textbox")
      expect(input).toHaveFocus()
      expect(input).toHaveValue("Ada")
    })

    it("typing a character enters edit mode replacing content", async () => {
      const user = userEvent.setup()
      renderGrid()
      const cell = getCell(0, 0)
      cell.focus()
      await user.keyboard("X")
      const input = within(cell).getByRole("textbox")
      expect(input).toHaveFocus()
      expect(input).toHaveValue("X")
    })
  })

  describe("typed cell editors", () => {
    it("number cells edit through a numeric input and commit a number", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTypedGrid()
      const cell = screen.getAllByRole("gridcell")[0]!
      await user.click(cell)
      const input = within(cell).getByRole("spinbutton")
      await user.clear(input)
      await user.type(input, "12")
      await user.tab()
      expect(onCellEdit).toHaveBeenCalledWith("1", "qty", 12)
    })

    it("currency cells render formatted and commit a number", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTypedGrid()
      const cell = screen.getAllByRole("gridcell")[1]!
      expect(within(cell).getByRole("textbox")).toHaveValue("$9.50")
      await user.click(cell)
      const input = within(cell).getByRole("textbox")
      await user.clear(input)
      await user.type(input, "19.99")
      await user.tab()
      expect(onCellEdit).toHaveBeenCalledWith("1", "price", 19.99)
    })

    it("select cells edit through a dropdown restricted to column.meta.options", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTypedGrid()
      const cell = screen.getAllByRole("gridcell")[2]!
      await user.click(cell)
      const select = within(cell).getByRole("combobox")
      expect(
        within(select)
          .getAllByRole("option")
          .map((o) => o.textContent)
      ).toEqual(["Open", "Closed"])
      await user.selectOptions(select, "closed")
      await user.tab()
      expect(onCellEdit).toHaveBeenCalledWith("1", "status", "closed")
    })

    it("boolean cells are a checkbox that toggles and commits in a single click", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTypedGrid()
      const cell = screen.getAllByRole("gridcell")[3]!
      const checkbox = within(cell).getByRole("checkbox")
      await user.click(checkbox)
      expect(onCellEdit).toHaveBeenCalledWith("1", "active", true)
    })

    it("date cells edit through a date input", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTypedGrid()
      const cell = screen.getAllByRole("gridcell")[4]!
      await user.click(cell)
      const input = cell.querySelector('input[type="date"]')
      expect(input).not.toBeNull()
      await user.clear(input!)
      await user.type(input!, "2026-02-15")
      await user.tab()
      expect(onCellEdit).toHaveBeenCalledWith("1", "shipsOn", "2026-02-15")
    })

    it("typing a character on a select cell preserves the value instead of seeding an invalid one", async () => {
      const user = userEvent.setup()
      renderTypedGrid()
      const cell = screen.getAllByRole("gridcell")[2]!
      cell.focus()
      await user.keyboard("z")
      const select = within(cell).getByRole("combobox")
      expect(select).toHaveFocus()
      expect(select).toHaveValue("open")
    })

    it("typing a character on a date cell preserves the value instead of seeding an invalid one", async () => {
      const user = userEvent.setup()
      renderTypedGrid()
      const cell = screen.getAllByRole("gridcell")[4]!
      cell.focus()
      await user.keyboard("2")
      const input = cell.querySelector('input[type="date"]')
      expect(input).toHaveValue("2026-01-01")
    })
  })

  describe("multiSelect and user cell editors", () => {
    it("multiSelect shows chips capped at meta.maxChips, then a +N overflow badge", () => {
      render(
        <TaskHarness
          onCellEdit={vi.fn()}
          initialData={[
            { id: "1", tags: ["bug", "urgent", "feature"], owner: null },
          ]}
        />
      )
      const cell = screen.getAllByRole("gridcell")[0]!
      expect(within(cell).getByText("Bug")).toBeInTheDocument()
      expect(within(cell).getByText("Urgent")).toBeInTheDocument()
      expect(within(cell).queryByText("Feature")).not.toBeInTheDocument()
      expect(within(cell).getByText("+1")).toBeInTheDocument()
    })

    it("user shows an avatar plus name, or Unassigned when null", () => {
      render(
        <TaskHarness
          onCellEdit={vi.fn()}
          initialData={[{ id: "1", tags: [], owner: "u1" }]}
        />
      )
      const cells = screen.getAllByRole("gridcell")
      expect(within(cells[1]!).getByText("Ada Lovelace")).toBeInTheDocument()

      render(
        <TaskHarness
          onCellEdit={vi.fn()}
          initialData={[{ id: "2", tags: [], owner: null }]}
        />
      )
      expect(screen.getByText("Unassigned")).toBeInTheDocument()
    })

    it("multiSelect opens a searchable popover on click and commits per toggle with the popover staying open", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTaskGrid()
      const cell = screen.getAllByRole("gridcell")[0]!
      await user.click(within(cell).getByRole("button"))

      await user.click(await screen.findByRole("option", { name: "Bug" }))
      expect(onCellEdit).toHaveBeenCalledWith("1", "tags", ["bug"])
      // Still open: the search box (and the other options) are still there.
      expect(
        screen.getByPlaceholderText("Search options...")
      ).toBeInTheDocument()

      await user.click(await screen.findByRole("option", { name: "Feature" }))
      expect(onCellEdit).toHaveBeenCalledWith("1", "tags", ["bug", "feature"])
      expect(onCellEdit).toHaveBeenCalledTimes(2)
    })

    it("multiSelect commits a string array normalized to options order regardless of toggle order", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTaskGrid()
      const cell = screen.getAllByRole("gridcell")[0]!
      await user.click(within(cell).getByRole("button"))

      // Toggled in reverse of the declared options order (feature, then bug).
      await user.click(await screen.findByRole("option", { name: "Feature" }))
      await user.click(await screen.findByRole("option", { name: "Bug" }))

      expect(onCellEdit).toHaveBeenLastCalledWith("1", "tags", [
        "bug",
        "feature",
      ])
    })

    it("reordering the same set of values does not trigger a commit", async () => {
      const user = userEvent.setup()
      const onCellEdit = vi
        .fn<OnCellEdit>()
        .mockRejectedValueOnce(new Error("nope"))
      render(<TaskHarness onCellEdit={onCellEdit} />)
      const cell = screen.getAllByRole("gridcell")[0]!
      await user.click(within(cell).getByRole("button"))

      // Fires and rejects — the optimistic value stays on screen per the
      // async commit contract, but the table's own committed value never
      // advances past [].
      await user.click(await screen.findByRole("option", { name: "Urgent" }))
      await waitFor(() => expect(onCellEdit).toHaveBeenCalledTimes(1))

      // Toggling it back off returns to exactly the still-committed set
      // ([]) — normalized comparison recognizes that and clears the failed
      // attempt locally instead of firing a second, redundant commit.
      await user.click(await screen.findByRole("option", { name: "Urgent" }))
      expect(onCellEdit).toHaveBeenCalledTimes(1)
    })

    it("user commits-and-closes on pick", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTaskGrid()
      const cell = screen.getAllByRole("gridcell")[1]!
      await user.click(within(cell).getByRole("button"))

      // The item's accessible name includes the avatar fallback initials
      // ("GH") ahead of the visible name, so match loosely.
      await user.click(
        await screen.findByRole("option", { name: /Grace Hopper/ })
      )
      expect(onCellEdit).toHaveBeenCalledWith("1", "owner", "u2")
      expect(
        screen.queryByPlaceholderText("Search people...")
      ).not.toBeInTheDocument()
    })

    it('"Unassigned" is a pickable value on user columns', async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTaskGrid([
        { id: "1", tags: [], owner: "u1" },
      ])
      const cell = screen.getAllByRole("gridcell")[1]!
      await user.click(within(cell).getByRole("button"))

      await user.click(
        await screen.findByRole("option", { name: "Unassigned" })
      )
      expect(onCellEdit).toHaveBeenCalledWith("1", "owner", null)
    })

    it("Escape closes the multiSelect popover back to nav mode without undoing a toggle that already committed", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderTaskGrid()
      const cell = screen.getAllByRole("gridcell")[0]!
      await user.click(within(cell).getByRole("button"))

      await user.click(await screen.findByRole("option", { name: "Bug" }))
      await waitFor(() => expect(onCellEdit).toHaveBeenCalledTimes(1))

      await user.keyboard("{Escape}")
      expect(
        screen.queryByPlaceholderText("Search options...")
      ).not.toBeInTheDocument()
      expect(cell).toHaveFocus()
      // The already-committed toggle is still reflected on screen.
      expect(within(cell).getByText("Bug")).toBeInTheDocument()
      expect(onCellEdit).toHaveBeenCalledTimes(1)
    })
  })

  describe("validation", () => {
    it("marks an empty cell invalid, wired via aria-invalid/aria-describedby, and never commits it", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderGrid()
      const cell = getCell(0, 0)
      await user.click(cell)
      const input = within(cell).getByRole("textbox")
      await user.clear(input)
      expect(input).toHaveAttribute("aria-invalid", "true")
      const describedBy = input.getAttribute("aria-describedby")
      expect(describedBy).toBeTruthy()
      expect(document.getElementById(describedBy!)).toHaveTextContent(
        "Required"
      )

      await user.tab()
      expect(onCellEdit).not.toHaveBeenCalled()
    })

    it("keeps an invalid cell in edit mode on Enter/Tab instead of silently discarding it", async () => {
      const user = userEvent.setup()
      const { onCellEdit } = renderGrid()
      const cell = getCell(0, 0)
      await user.click(cell)
      const input = within(cell).getByRole("textbox")
      await user.clear(input)

      await user.keyboard("{Enter}")
      expect(onCellEdit).not.toHaveBeenCalled()
      expect(input).toHaveFocus()
      expect(input).toHaveAttribute("aria-invalid", "true")

      await user.tab()
      expect(onCellEdit).not.toHaveBeenCalled()
      expect(input).toHaveFocus()
    })
  })

  describe("async commit contract", () => {
    it("shows a spinner and disables the control while the commit is pending", async () => {
      const user = userEvent.setup()
      const { promise, resolve } = deferred<void>()
      const onCellEdit = vi.fn<OnCellEdit>().mockReturnValue(promise)
      render(<Harness onCellEdit={onCellEdit} />)
      const cell = getCell(0, 0)

      await typeAndCommit(cell, user, "Updated")

      expect(onCellEdit).toHaveBeenCalledWith("1", "name", "Updated")
      expect(within(cell).getByRole("textbox")).toBeDisabled()
      expect(cell.querySelector('[data-slot="spinner"]')).toBeInTheDocument()

      resolve()
      await waitFor(() =>
        expect(within(cell).getByRole("textbox")).not.toBeDisabled()
      )
      expect(
        cell.querySelector('[data-slot="spinner"]')
      ).not.toBeInTheDocument()
    })

    it("keeps the typed value on rejection and shows the error with the invalid-cell treatment", async () => {
      const user = userEvent.setup()
      const onCellEdit = vi
        .fn<OnCellEdit>()
        .mockRejectedValue(new Error("Server rejected"))
      render(<Harness onCellEdit={onCellEdit} />)
      const cell = getCell(0, 0)

      await typeAndCommit(cell, user, "Updated")

      await waitFor(() =>
        expect(within(cell).getByRole("textbox")).toHaveAttribute(
          "aria-invalid",
          "true"
        )
      )
      const input = within(cell).getByRole("textbox")
      expect(input).toHaveValue("Updated")
      expect(input).not.toBeDisabled()
      const describedBy = input.getAttribute("aria-describedby")
      expect(describedBy).toBeTruthy()
      expect(document.getElementById(describedBy!)).toHaveTextContent(
        "Server rejected"
      )
    })

    it("announces the rejection through aria-live with the cell's location, and stays silent while pending", async () => {
      const user = userEvent.setup()
      const { promise, reject } = deferred<void>()
      const onCellEdit = vi.fn<OnCellEdit>().mockReturnValue(promise)
      const { container } = render(<Harness onCellEdit={onCellEdit} />)
      const liveRegion = container.querySelector('[aria-live="polite"]')!
      const cell = getCell(0, 0)

      await typeAndCommit(cell, user, "Updated")
      expect(liveRegion).toHaveTextContent("")

      reject(new Error("Server rejected"))
      await waitFor(() =>
        expect(liveRegion).toHaveTextContent("Name, row 1: Server rejected")
      )
    })

    it("catches a synchronous throw the same way as a rejected promise", async () => {
      const user = userEvent.setup()
      const onCellEdit = vi.fn<OnCellEdit>().mockImplementation(() => {
        throw new Error("Sync boom")
      })
      render(<Harness onCellEdit={onCellEdit} />)
      const cell = getCell(0, 0)

      await typeAndCommit(cell, user, "Updated")

      await waitFor(() =>
        expect(within(cell).getByRole("textbox")).toHaveAttribute(
          "aria-invalid",
          "true"
        )
      )
      const input = within(cell).getByRole("textbox")
      expect(input).toHaveValue("Updated")
      const describedBy = input.getAttribute("aria-describedby")
      expect(document.getElementById(describedBy!)).toHaveTextContent(
        "Sync boom"
      )
    })

    it("retries a rejected commit when the same value is committed again", async () => {
      const user = userEvent.setup()
      const onCellEdit = vi
        .fn<OnCellEdit>()
        .mockRejectedValueOnce(new Error("Server rejected"))
        .mockResolvedValueOnce(undefined)
      render(<Harness onCellEdit={onCellEdit} />)
      const cell = getCell(0, 0)

      await typeAndCommit(cell, user, "Updated")
      await waitFor(() =>
        expect(within(cell).getByRole("textbox")).toHaveAttribute(
          "aria-invalid",
          "true"
        )
      )
      expect(onCellEdit).toHaveBeenCalledTimes(1)

      // Re-enter edit mode without changing the value and commit again —
      // dedup compares against the last *successful* commit, so an unchanged
      // retry still fires rather than no-opping.
      await user.click(cell)
      const retryInput = within(cell).getByRole("textbox")
      expect(retryInput).toHaveValue("Updated")
      await user.tab()

      await waitFor(() => expect(onCellEdit).toHaveBeenCalledTimes(2))
      expect(onCellEdit).toHaveBeenNthCalledWith(2, "1", "name", "Updated")
      await waitFor(() =>
        expect(within(cell).getByRole("textbox")).not.toHaveAttribute(
          "aria-invalid"
        )
      )
    })

    it("does not commit when the value is unchanged from the last successful commit", async () => {
      const user = userEvent.setup()
      const onCellEdit = vi.fn<OnCellEdit>()
      render(<Harness onCellEdit={onCellEdit} />)
      const cell = getCell(0, 0)

      await user.click(cell)
      await user.tab()

      expect(onCellEdit).not.toHaveBeenCalled()
    })
  })

  describe("row add", () => {
    it("renders no add affordances when onRowAdd is omitted", () => {
      renderGrid()
      expect(
        screen.queryByRole("button", { name: "New row" })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: /insert row/i })
      ).not.toBeInTheDocument()
    })

    it("renders a trailing New row control that appends with no afterRowId", async () => {
      const user = userEvent.setup()
      const onRowAdd = vi.fn()
      render(<Harness onCellEdit={vi.fn()} onRowAdd={onRowAdd} />)

      await user.click(screen.getByRole("button", { name: "New row" }))
      expect(onRowAdd).toHaveBeenCalledWith(undefined)
    })

    it("renders a between-row insert control that inserts via afterRowId", async () => {
      const user = userEvent.setup()
      const onRowAdd = vi.fn()
      render(<Harness onCellEdit={vi.fn()} onRowAdd={onRowAdd} />)

      await user.click(
        screen.getByRole("button", { name: "Insert row after row 1" })
      )
      expect(onRowAdd).toHaveBeenCalledWith("1")
    })

    it("does not render a between-row insert control after the last row", () => {
      render(<Harness onCellEdit={vi.fn()} onRowAdd={vi.fn()} />)
      expect(
        screen.queryByRole("button", { name: "Insert row after row 2" })
      ).not.toBeInTheDocument()
    })

    it("autofocuses the new row's first cell when appended", async () => {
      const user = userEvent.setup()
      render(<AddableHarness />)

      await user.click(screen.getByRole("button", { name: "New row" }))

      await waitFor(() => {
        const cells = screen.getAllByRole("gridcell")
        expect(cells).toHaveLength(6) // 3 rows x 2 cols
        expect(cells[4]).toHaveFocus()
      })
    })

    it("autofocuses the new row's first cell when inserted after a row", async () => {
      const user = userEvent.setup()
      render(<AddableHarness />)

      await user.click(
        screen.getByRole("button", { name: "Insert row after row 1" })
      )

      await waitFor(() => {
        const cells = screen.getAllByRole("gridcell")
        expect(cells).toHaveLength(6) // 3 rows x 2 cols
        expect(cells[2]).toHaveFocus() // the new row lands at index 1
      })
    })
  })

  describe("row delete", () => {
    it("renders no kebab menu when onRowDelete is omitted", () => {
      renderGrid()
      expect(
        screen.queryByRole("button", { name: /row 1 actions/i })
      ).not.toBeInTheDocument()
    })

    it("calls onRowDelete(rowId) only after confirming in the dialog", async () => {
      const user = userEvent.setup()
      const onRowDelete = vi.fn()
      render(<Harness onCellEdit={vi.fn()} onRowDelete={onRowDelete} />)

      await user.click(screen.getByRole("button", { name: "Row 1 actions" }))
      await user.click(
        await screen.findByRole("menuitem", { name: "Delete row" })
      )

      const dialog = screen.getByRole("alertdialog")
      await user.click(within(dialog).getByRole("button", { name: "Delete" }))

      expect(onRowDelete).toHaveBeenCalledWith("1")
    })

    it("does not call onRowDelete when the confirmation is cancelled", async () => {
      const user = userEvent.setup()
      const onRowDelete = vi.fn()
      render(<Harness onCellEdit={vi.fn()} onRowDelete={onRowDelete} />)

      await user.click(screen.getByRole("button", { name: "Row 1 actions" }))
      await user.click(
        await screen.findByRole("menuitem", { name: "Delete row" })
      )

      const dialog = screen.getByRole("alertdialog")
      await user.click(within(dialog).getByRole("button", { name: "Cancel" }))

      expect(onRowDelete).not.toHaveBeenCalled()
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    })
  })

  describe("row selection", () => {
    it("renders a leading checkbox column by default — TanStack's own row selection default", () => {
      renderGrid()
      expect(
        screen.getAllByRole("checkbox", { name: /^Select row/ })
      ).toHaveLength(2) // one per row
      expect(
        screen.getByRole("checkbox", { name: "Select all rows" })
      ).toBeInTheDocument()
    })

    it("renders no leading checkbox column when the consumer opts out via enableRowSelection: false", () => {
      render(<UnselectableHarness />)
      expect(screen.queryAllByRole("checkbox")).toHaveLength(0)
    })

    it("renders the checkbox column before the kebab column", () => {
      render(<SelectableHarness onRowDelete={vi.fn()} />)

      const rows = screen.getAllByRole("row").slice(1) // drop the header row
      expect(rows).toHaveLength(3)
      for (const row of rows) {
        const cells = Array.from(row.children)
        // Leading checkbox cell first, kebab-menu cell last.
        expect(
          within(cells[0] as HTMLElement).getByRole("checkbox")
        ).toBeInTheDocument()
        expect(
          within(cells[cells.length - 1] as HTMLElement).getByRole("button", {
            name: /actions/i,
          })
        ).toBeInTheDocument()
      }
    })

    it("Shift+Click on a checkbox extends the selection from the anchor row", async () => {
      const user = userEvent.setup()
      render(<SelectableHarness />)
      const checkboxes = screen.getAllByRole("checkbox", {
        name: /^Select row/,
      })

      await user.click(checkboxes[0]!) // anchor: row 0
      await user.keyboard("{Shift>}")
      await user.click(checkboxes[2]!) // extend to row 2
      await user.keyboard("{/Shift}")

      expect(checkboxes[0]).toBeChecked()
      expect(checkboxes[1]).toBeChecked()
      expect(checkboxes[2]).toBeChecked()
    })

    it("Shift+ArrowDown extends selection from a nav-mode gridcell", async () => {
      const user = userEvent.setup()
      render(<SelectableHarness />)
      const cells = screen.getAllByRole("gridcell")
      cells[0]!.focus() // row 0, col 0

      await user.keyboard("{Shift>}{ArrowDown}{ArrowDown}{/Shift}")

      const checkboxes = screen.getAllByRole("checkbox", {
        name: /^Select row/,
      })
      expect(checkboxes[0]).toBeChecked()
      expect(checkboxes[1]).toBeChecked()
      expect(checkboxes[2]).toBeChecked()
    })

    it("Shift+Left/Right stays unbound — no range selection, just plain column navigation", async () => {
      const user = userEvent.setup()
      render(<SelectableHarness />)
      const cells = screen.getAllByRole("gridcell")
      cells[0]!.focus() // row 0, col 0

      await user.keyboard("{Shift>}{ArrowRight}{/Shift}")

      expect(cells[1]).toHaveFocus()
      expect(
        screen
          .getAllByRole("checkbox", { name: /^Select row/ })
          .every((cb) => !(cb as HTMLInputElement).checked)
      ).toBe(true)
    })

    it("a consumer-composed bulk bar confirms once, then loops onRowDelete(rowId) over every selected row", async () => {
      const user = userEvent.setup()
      const onRowDelete = vi.fn()
      render(<BulkDeleteHarness onRowDelete={onRowDelete} />)
      const checkboxes = screen.getAllByRole("checkbox", {
        name: /^Select row/,
      })

      await user.click(checkboxes[0]!)
      await user.keyboard("{Shift>}")
      await user.click(checkboxes[1]!)
      await user.keyboard("{/Shift}")

      await user.click(screen.getByRole("button", { name: "Delete" }))
      const dialog = screen.getByRole("alertdialog")
      await user.click(within(dialog).getByRole("button", { name: "Delete" }))

      expect(onRowDelete).toHaveBeenCalledTimes(2)
      expect(onRowDelete).toHaveBeenNthCalledWith(1, "1")
      expect(onRowDelete).toHaveBeenNthCalledWith(2, "2")
      // Confirming once clears the selection and the bar along with it
      // (BulkToolbar animates its exit, so the node lingers briefly).
      await waitFor(() =>
        expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()
      )
    })
  })

  describe("getDataGridRowDefaults", () => {
    it("derives defaults per column.meta.type, omitting columns without one", () => {
      interface Row {
        id: string
        text: string
        num: number
        currency: number
        flag: boolean
        status: string
        tags: string[]
        owner: string | null
        due: string
        untyped: string
      }

      const allTypeColumns: ColumnDef<Row>[] = [
        { accessorKey: "text", header: "Text", meta: { type: "text" } },
        { accessorKey: "num", header: "Num", meta: { type: "number" } },
        {
          accessorKey: "currency",
          header: "Currency",
          meta: { type: "currency" },
        },
        { accessorKey: "flag", header: "Flag", meta: { type: "boolean" } },
        {
          accessorKey: "status",
          header: "Status",
          meta: {
            type: "select",
            options: [
              { value: "open", label: "Open" },
              { value: "closed", label: "Closed" },
            ],
          },
        },
        {
          accessorKey: "tags",
          header: "Tags",
          meta: { type: "multiSelect" },
        },
        { accessorKey: "owner", header: "Owner", meta: { type: "user" } },
        { accessorKey: "due", header: "Due", meta: { type: "date" } },
        { accessorKey: "untyped", header: "Untyped" },
      ]

      function Probe() {
        // eslint-disable-next-line react-hooks/incompatible-library
        const table = useReactTable({
          data: [] as Row[],
          columns: allTypeColumns,
          getCoreRowModel: getCoreRowModel(),
        })
        expect(getDataGridRowDefaults(table)).toEqual({
          text: "",
          num: 0,
          currency: 0,
          flag: false,
          status: "open",
          tags: [],
          owner: null,
          due: "",
        })
        return null
      }

      render(<Probe />)
    })
  })

  describe("column resize", () => {
    it("resizes a column via drag, committing on mouseup", () => {
      render(<LayoutHarness />)
      const handle = screen.getByRole("separator", {
        name: "Resize Name column",
      })

      fireEvent.mouseDown(handle, { clientX: 0 })
      fireEvent.mouseMove(document, { clientX: 50 })
      fireEvent.mouseUp(document, { clientX: 50 })

      // Non-pinned columns render a size-proportional % (200 of 500 total) so
      // they fill the table while the fixed-px selection cell stays put.
      const header = screen.getAllByRole("columnheader")[1]!
      expect(header).toHaveStyle({ width: "40%" })
    })

    it("double-clicking the resize handle resets the column to its default width", () => {
      render(<LayoutHarness />)
      const handle = screen.getByRole("separator", {
        name: "Resize Name column",
      })

      fireEvent.mouseDown(handle, { clientX: 0 })
      fireEvent.mouseMove(document, { clientX: 50 })
      fireEvent.mouseUp(document, { clientX: 50 })
      const header = screen.getAllByRole("columnheader")[1]!
      expect(header).toHaveStyle({ width: "40%" }) // 200 of 500 total

      fireEvent.doubleClick(handle)
      expect(header).toHaveStyle({ width: "33.3333%" }) // reset to 150 of 450
    })
  })

  describe("column pin", () => {
    it("cycles unpinned -> left -> right -> unpinned via the header options menu", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      const header = screen.getAllByRole("columnheader")[1]!
      // The pin action is a menu item under the header's "⋯" options button.
      const pin = async (name: string) => {
        await user.click(
          within(header).getByRole("button", { name: "Name column options" })
        )
        await user.click(await screen.findByRole("menuitem", { name }))
      }

      expect(header).not.toHaveStyle({ position: "sticky" })

      await pin("Pin column left")
      expect(header).toHaveStyle({ position: "sticky", left: "0px" })

      await pin("Pin column right")
      expect(header).toHaveStyle({ position: "sticky", right: "0px" })

      await pin("Unpin column")
      expect(header).not.toHaveStyle({ position: "sticky" })
    })
  })

  describe("column reorder", () => {
    it("opens a Columns panel from the toolbar listing columns with drag handles", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)

      await user.click(screen.getByRole("button", { name: "Columns" }))

      const items = await screen.findAllByRole("listitem")
      expect(items.map((li) => li.textContent)).toEqual([
        "Name",
        "Email",
        "Team",
      ])
      expect(items[0]).toHaveAttribute("draggable", "true")
    })

    it("reorders columns on drop using insert-before-target semantics", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      await user.click(screen.getByRole("button", { name: "Columns" }))
      const items = () => screen.getAllByRole("listitem")

      const dataTransfer = fakeDataTransfer()
      fireEvent.dragStart(items()[2]!, { dataTransfer }) // Team
      fireDragOver(items()[0]!, dataTransfer, -1) // before Name
      fireEvent.drop(items()[0]!, { dataTransfer })
      fireEvent.dragEnd(items()[2]!, { dataTransfer })

      await waitFor(() => {
        expect(items().map((li) => li.textContent)).toEqual([
          "Team",
          "Name",
          "Email",
        ])
      })
    })

    it("registers an adjacent swap via the midpoint check, unlike naive insert-before math", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      await user.click(screen.getByRole("button", { name: "Columns" }))
      const items = () => screen.getAllByRole("listitem")

      // Naive insert-before-target math would no-op here: removing "Name"
      // shifts "Email" back into the very slot the drop targeted.
      const dataTransfer = fakeDataTransfer()
      fireEvent.dragStart(items()[0]!, { dataTransfer }) // Name
      fireDragOver(items()[1]!, dataTransfer, 1) // after Email
      fireEvent.drop(items()[1]!, { dataTransfer })
      fireEvent.dragEnd(items()[0]!, { dataTransfer })

      await waitFor(() => {
        expect(items().map((li) => li.textContent)).toEqual([
          "Email",
          "Name",
          "Team",
        ])
      })
    })

    it("hides a column via the panel, moving it to a separate group with a Show control", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      await user.click(screen.getByRole("button", { name: "Columns" }))
      const headerTexts = () =>
        screen.getAllByRole("columnheader").map((h) => h.textContent)
      expect(headerTexts()).toContain("Email")

      await user.click(
        screen.getByRole("button", { name: "Hide Email column" })
      )

      // Leaves the grid, reappears in the panel with a Show toggle.
      expect(headerTexts()).not.toContain("Email")
      expect(
        screen.getByRole("button", { name: "Show Email column" })
      ).toBeInTheDocument()
      // Visible group keeps its order; the hidden one lands after it.
      expect(
        screen.getAllByRole("listitem").map((li) => li.textContent)
      ).toEqual(["Name", "Team", "Email"])
    })

    it("reveals a hidden column when dragged into the visible group", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      await user.click(screen.getByRole("button", { name: "Columns" }))
      await user.click(screen.getByRole("button", { name: "Hide Team column" }))
      const items = () => screen.getAllByRole("listitem")

      const dataTransfer = fakeDataTransfer()
      const teamItem = items().find((li) => li.textContent === "Team")!
      fireEvent.dragStart(teamItem, { dataTransfer })
      fireDragOver(items()[0]!, dataTransfer, -1) // before Name
      fireEvent.drop(items()[0]!, { dataTransfer })
      fireEvent.dragEnd(teamItem, { dataTransfer })

      await waitFor(() => {
        expect(items().map((li) => li.textContent)).toEqual([
          "Team",
          "Name",
          "Email",
        ])
      })
      // Back in the visible group — no hidden group, so no Show control left.
      expect(
        screen.queryByRole("button", { name: "Show Team column" })
      ).toBeNull()
    })

    it("moves a column left/right via the header options menu", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      // Drop the leading empty select-all column header.
      const headerTexts = () =>
        screen
          .getAllByRole("columnheader")
          .map((h) => h.textContent)
          .filter(Boolean)
      expect(headerTexts()).toEqual(["Name", "Email", "Team"])

      const menuAction = async (column: string, name: string) => {
        await user.click(
          screen.getByRole("button", { name: `${column} column options` })
        )
        await user.click(await screen.findByRole("menuitem", { name }))
      }

      await menuAction("Email", "Move left")
      expect(headerTexts()).toEqual(["Email", "Name", "Team"])

      await menuAction("Name", "Move right")
      expect(headerTexts()).toEqual(["Email", "Team", "Name"])
    })

    it("disables Move left on the first column and Move right on the last", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)

      await user.click(
        screen.getByRole("button", { name: "Name column options" })
      )
      expect(
        await screen.findByRole("menuitem", { name: "Move left" })
      ).toHaveAttribute("data-disabled")

      await user.keyboard("{Escape}")
      await user.click(
        screen.getByRole("button", { name: "Team column options" })
      )
      expect(
        await screen.findByRole("menuitem", { name: "Move right" })
      ).toHaveAttribute("data-disabled")
    })

    it("hides a column via the header options menu", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      const headerTexts = () =>
        screen.getAllByRole("columnheader").map((h) => h.textContent)
      expect(headerTexts()).toContain("Email")

      await user.click(
        screen.getByRole("button", { name: "Email column options" })
      )
      await user.click(
        await screen.findByRole("menuitem", { name: "Hide column" })
      )

      expect(headerTexts()).not.toContain("Email")
    })
  })

  describe("column sort", () => {
    it("shows no sort affordance when the table has no sorted row model", () => {
      // LayoutHarness wires only getCoreRowModel — a click would be a no-op, so
      // the header stays a plain label with only the options button.
      render(<LayoutHarness />)
      const header = screen.getAllByRole("columnheader")[1]!
      expect(
        within(header).queryByRole("button", { name: /^Sort by/ })
      ).toBeNull()
    })

    it("toggles asc -> desc -> unsorted by clicking the header, reordering rows", async () => {
      const user = userEvent.setup()
      render(<SortableHarness />)
      const nameSort = screen.getByRole("button", { name: "Sort by Name" })
      // First data cell of the name column tracks the sorted order.
      const firstName = () =>
        screen.getAllByRole("gridcell")[0]!.querySelector("input")!.value

      expect(firstName()).toBe("Ada") // unsorted = insertion order

      await user.click(nameSort)
      expect(firstName()).toBe("Ada") // asc

      await user.click(nameSort)
      expect(firstName()).toBe("Grace") // desc

      await user.click(nameSort)
      expect(firstName()).toBe("Ada") // back to unsorted
    })
  })

  describe("onColumnLayoutChange", () => {
    it("reports resize/pin/reorder changes when provided (controlled)", async () => {
      const user = userEvent.setup()
      const onColumnLayoutChange =
        vi.fn<(layout: DataGridColumnLayout) => void>()
      render(<LayoutHarness onColumnLayoutChange={onColumnLayoutChange} />)
      expect(onColumnLayoutChange).not.toHaveBeenCalled() // no fire on mount

      const header = screen.getAllByRole("columnheader")[1]!
      await user.click(
        within(header).getByRole("button", { name: "Name column options" })
      )
      await user.click(
        await screen.findByRole("menuitem", { name: "Pin column left" })
      )

      expect(onColumnLayoutChange).toHaveBeenCalledTimes(1)
      expect(onColumnLayoutChange).toHaveBeenCalledWith(
        expect.objectContaining({
          columnPinning: { left: ["name"], right: [] },
        })
      )
    })

    it("leaves resize/pin/reorder fully working when the callback is omitted (uncontrolled)", async () => {
      const user = userEvent.setup()
      render(<LayoutHarness />)
      const header = screen.getAllByRole("columnheader")[1]!

      await user.click(
        within(header).getByRole("button", { name: "Name column options" })
      )
      await user.click(
        await screen.findByRole("menuitem", { name: "Pin column left" })
      )

      expect(header).toHaveStyle({ position: "sticky", left: "0px" })
    })
  })

  describe("narrow container", () => {
    it("renders the wide grid by default; below 448px it swaps to a card list with no role=grid", () => {
      const { container } = renderNarrow()
      expect(screen.getByRole("grid")).toBeInTheDocument()

      goNarrowGrid(container)

      expect(screen.queryByRole("grid")).toBeNull()
      expect(screen.getByRole("list")).toBeInTheDocument()
    })

    it("card title is the first column and subtitle the next two, by column order", () => {
      const { container } = renderNarrow()
      goNarrowGrid(container)

      const item = within(screen.getByRole("list")).getAllByRole("listitem")[0]!
      expect(within(item).getByText("Ada Lovelace")).toBeInTheDocument()
      expect(within(item).getByText("ada@example.com · 12")).toBeInTheDocument()
    })

    it("meta.summary overrides which columns fill the title and subtitle", () => {
      const { container } = renderNarrow({ columns: summaryFlaggedColumns })
      goNarrowGrid(container)

      const item = within(screen.getByRole("list")).getAllByRole("listitem")[0]!
      expect(within(item).getByText("Team")).toBeInTheDocument()
      expect(within(item).getByText("Yes")).toBeInTheDocument()
      expect(within(item).queryByText("Ada Lovelace")).toBeNull()
    })

    it("tapping a card opens a bottom drawer with every column as a labelled, bordered field", async () => {
      const user = userEvent.setup()
      const { container } = renderNarrow()
      goNarrowGrid(container)

      await user.click(screen.getByText("Ada Lovelace"))
      const dialog = screen.getByRole("dialog")

      expect(within(dialog).getByLabelText("Name")).toHaveValue("Ada Lovelace")
      expect(within(dialog).getByLabelText("Email")).toHaveValue(
        "ada@example.com"
      )
      expect(within(dialog).getByLabelText("Seats")).toHaveValue(12)
      expect(within(dialog).getByLabelText("Plan")).toHaveValue("team")
      expect(
        within(dialog).getByRole("checkbox", { name: "Active" })
      ).toBeChecked()
      expect(within(dialog).getByLabelText("Tags")).toBeInTheDocument()
      expect(within(dialog).getByLabelText("Owner")).toBeInTheDocument()
      // Every field is bordered — the deliberate divergence from the wide
      // branch's borderless-at-rest styling.
      expect(within(dialog).getByLabelText("Tags")).toHaveClass("border")
    })

    it("drawer text field edits use the same onCellEdit callback and the same pending/error behavior as the wide branch", async () => {
      const user = userEvent.setup()
      const { container, onCellEdit } = renderNarrow()
      goNarrowGrid(container)
      await user.click(screen.getByText("Ada Lovelace"))
      const dialog = screen.getByRole("dialog")

      const pending = deferred<void>()
      onCellEdit.mockReturnValueOnce(pending.promise)

      const nameField = within(dialog).getByLabelText("Name")
      await user.clear(nameField)
      await user.type(nameField, "Ada K")
      await user.tab()

      expect(nameField).toBeDisabled()

      await act(async () => {
        pending.resolve()
        await pending.promise
      })

      expect(onCellEdit).toHaveBeenCalledWith("1", "name", "Ada K")

      // Now a rejection: the invalid-looking, red-text-under-the-field
      // treatment the wide branch also uses.
      const rejected = deferred<void>()
      onCellEdit.mockReturnValueOnce(rejected.promise)
      await user.clear(nameField)
      await user.type(nameField, "Ada Rejected")
      await user.tab()
      await act(async () => {
        rejected.reject(new Error("nope"))
        await rejected.promise.catch(() => {})
      })

      expect(screen.getByText("nope")).toBeInTheDocument()
    })

    it("multiSelect and user fields commit per-tap the same way the wide branch's popover does", async () => {
      const user = userEvent.setup()
      const { container, onCellEdit } = renderNarrow()
      goNarrowGrid(container)
      await user.click(screen.getByText("Ada Lovelace"))
      const dialog = screen.getByRole("dialog")

      await user.click(within(dialog).getByRole("button", { name: "Risk" }))
      expect(onCellEdit).toHaveBeenCalledWith("1", "tags", ["vip", "risk"])

      await user.click(
        within(dialog).getByRole("button", { name: "Sam Okafor" })
      )
      expect(onCellEdit).toHaveBeenCalledWith("1", "owner", "u2")
    })

    it("adding is append-only on narrow — no hover gap insert-after affordance", () => {
      const onRowAdd = vi.fn()
      const { container } = renderNarrow({ onRowAdd })
      goNarrowGrid(container)

      expect(
        screen.getByRole("button", { name: "New row" })
      ).toBeInTheDocument()
      expect(
        screen.queryByLabelText(/Insert row after row/)
      ).not.toBeInTheDocument()
    })

    it("delete lives in the drawer's footer on narrow, wired through the same confirm dialog", async () => {
      const user = userEvent.setup()
      const onRowDelete = vi.fn()
      const { container } = renderNarrow({ onRowDelete })
      goNarrowGrid(container)

      await user.click(screen.getByText("Ada Lovelace"))
      const dialog = screen.getByRole("dialog")
      await user.click(
        within(dialog).getByRole("button", { name: "Delete row" })
      )

      await user.click(screen.getByRole("button", { name: "Delete" }))
      expect(onRowDelete).toHaveBeenCalledWith("1")
    })

    it("shift range-select is absent on narrow — no row-selection checkboxes render", () => {
      const { container } = renderNarrow()
      goNarrowGrid(container)

      expect(screen.queryByRole("checkbox", { name: /Select row/ })).toBeNull()
    })

    it("resize, pin, and the Columns panel do not render on narrow", () => {
      const { container } = renderNarrow()
      goNarrowGrid(container)

      expect(screen.queryByRole("button", { name: "Columns" })).toBeNull()
      expect(screen.queryByRole("separator")).toBeNull()
      expect(screen.queryByRole("button", { name: /Pin column/ })).toBeNull()
    })

    it('narrowFallback="none" keeps the real grid at narrow widths, with the first column stuck sticky-left', () => {
      const { container } = renderNarrow({ narrowFallback: "none" })
      goNarrowGrid(container)

      expect(screen.getByRole("grid")).toBeInTheDocument()
      expect(screen.queryByRole("list")).toBeNull()

      const header = screen.getAllByRole("columnheader")[1]!
      expect(header).toHaveStyle({ position: "sticky", left: "0px" })
    })

    it("shares one aria-live region across both branches — resizing doesn't duplicate it", () => {
      const { container } = renderNarrow()
      expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1)

      goNarrowGrid(container)
      expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1)
    })
  })
})
