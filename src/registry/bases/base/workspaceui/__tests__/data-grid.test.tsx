import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataGrid } from "../data-grid"
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
}: {
  data?: Person[]
  onCellEdit: OnCellEdit
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
  return <DataGrid table={table} onCellEdit={onCellEdit} />
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
})
