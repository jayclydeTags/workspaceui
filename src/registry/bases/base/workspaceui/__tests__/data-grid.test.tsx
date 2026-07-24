import { render, screen, waitFor, within } from "@testing-library/react"
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
})
