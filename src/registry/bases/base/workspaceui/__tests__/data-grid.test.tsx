import * as React from "react"
import {
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
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

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

      const header = screen.getAllByRole("columnheader")[0]!
      expect(header).toHaveStyle({ width: "200px" })
    })

    it("double-clicking the resize handle resets the column to its default width", () => {
      render(<LayoutHarness />)
      const handle = screen.getByRole("separator", {
        name: "Resize Name column",
      })

      fireEvent.mouseDown(handle, { clientX: 0 })
      fireEvent.mouseMove(document, { clientX: 50 })
      fireEvent.mouseUp(document, { clientX: 50 })
      const header = screen.getAllByRole("columnheader")[0]!
      expect(header).toHaveStyle({ width: "200px" })

      fireEvent.doubleClick(handle)
      expect(header).toHaveStyle({ width: "150px" })
    })
  })

  describe("column pin", () => {
    it("cycles unpinned -> left -> right -> unpinned via the header pin button", () => {
      render(<LayoutHarness />)
      const header = screen.getAllByRole("columnheader")[0]!
      const pinButton = within(header).getByRole("button")
      expect(pinButton).toHaveAccessibleName("Pin column left")
      expect(header).not.toHaveStyle({ position: "sticky" })

      fireEvent.click(pinButton)
      expect(pinButton).toHaveAccessibleName("Pin column right")
      expect(header).toHaveStyle({ position: "sticky", left: "0px" })

      fireEvent.click(pinButton)
      expect(pinButton).toHaveAccessibleName("Unpin column")
      expect(header).toHaveStyle({ position: "sticky", right: "0px" })

      fireEvent.click(pinButton)
      expect(pinButton).toHaveAccessibleName("Pin column left")
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
  })

  describe("onColumnLayoutChange", () => {
    it("reports resize/pin/reorder changes when provided (controlled)", () => {
      const onColumnLayoutChange =
        vi.fn<(layout: DataGridColumnLayout) => void>()
      render(<LayoutHarness onColumnLayoutChange={onColumnLayoutChange} />)
      expect(onColumnLayoutChange).not.toHaveBeenCalled() // no fire on mount

      const header = screen.getAllByRole("columnheader")[0]!
      fireEvent.click(within(header).getByRole("button"))

      expect(onColumnLayoutChange).toHaveBeenCalledTimes(1)
      expect(onColumnLayoutChange).toHaveBeenCalledWith(
        expect.objectContaining({
          columnPinning: { left: ["name"], right: [] },
        })
      )
    })

    it("leaves resize/pin/reorder fully working when the callback is omitted (uncontrolled)", () => {
      render(<LayoutHarness />)
      const header = screen.getAllByRole("columnheader")[0]!
      const pinButton = within(header).getByRole("button")

      fireEvent.click(pinButton)

      expect(pinButton).toHaveAccessibleName("Pin column right")
      expect(header).toHaveStyle({ position: "sticky", left: "0px" })
    })
  })
})
