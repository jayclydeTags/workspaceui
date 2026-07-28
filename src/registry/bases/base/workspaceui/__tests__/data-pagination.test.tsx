import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataPagination } from "../data-pagination"

interface Item {
  id: string
  name: string
}

const data: Item[] = Array.from({ length: 42 }, (_, i) => ({
  id: String(i + 1),
  name: `Item ${i + 1}`,
}))

const columns: ColumnDef<Item>[] = [{ accessorKey: "name", header: "Name" }]

function Harness({ enableRowSelection }: { enableRowSelection?: boolean }) {
  // useReactTable() intentionally returns fresh functions each render — see
  // the same eslint-disable precedent in data-search.test.tsx.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    enableRowSelection,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <DataPagination table={table} />
      {/* Labelled so it isn't confused with Pagination's own <li> controls. */}
      <ul aria-label="rows">
        {table.getRowModel().rows.map((row) => (
          <li key={row.id}>{row.original.name}</li>
        ))}
      </ul>
    </div>
  )
}

const rowNames = () =>
  within(screen.getByRole("list", { name: "rows" }))
    .getAllByRole("listitem")
    .map((li) => li.textContent)

describe("DataPagination", () => {
  it("paginates rows and reports the current page", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(rowNames()).toHaveLength(10)
    expect(rowNames()[0]).toBe("Item 1")
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument()
    expect(screen.getByText("0 of 42 row(s) selected")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Go to next page" }))
    expect(rowNames()[0]).toBe("Item 11")
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Go to last page" }))
    expect(rowNames()).toHaveLength(2)
    expect(screen.getByText("Page 5 of 5")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Go to first page" }))
    expect(rowNames()[0]).toBe("Item 1")
  })

  it("disables the boundary controls on the first and last page", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(
      screen.getByRole("button", { name: "Go to first page" })
    ).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "Go to previous page" })
    ).toBeDisabled()

    await user.click(screen.getByRole("button", { name: "Go to last page" }))
    expect(
      screen.getByRole("button", { name: "Go to next page" })
    ).toBeDisabled()
  })

  it("changes the page size", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole("combobox", { name: "Rows per page" }))
    await user.click(await screen.findByRole("option", { name: "20" }))

    expect(rowNames()).toHaveLength(20)
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
  })

  it("drops the selection wording when row selection is off", () => {
    render(<Harness enableRowSelection={false} />)
    expect(screen.getByText("42 row(s)")).toBeInTheDocument()
  })
})
