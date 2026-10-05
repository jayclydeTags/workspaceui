import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  DataSearch,
  dataGridGetColumnCanGlobalFilter,
  dataGridGlobalFilterFn,
} from "../data-search"

interface Item {
  id: string
  name: string
  qty: number
  tags: string[]
  assignee: string | null
}

const data: Item[] = [
  { id: "1", name: "Widget", qty: 5, tags: ["a"], assignee: "u1" },
  { id: "2", name: "Gadget", qty: 15, tags: ["b"], assignee: null },
  { id: "3", name: "Gizmo", qty: 25, tags: ["a", "b"], assignee: "u2" },
]

const columns: ColumnDef<Item>[] = [
  { accessorKey: "name", header: "Name", meta: { type: "text" } },
  { accessorKey: "qty", header: "Qty", meta: { type: "number" } },
  {
    accessorKey: "tags",
    header: "Tags",
    meta: {
      type: "multiSelect",
      options: [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
      ],
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    meta: {
      type: "user",
      users: [
        { id: "u1", name: "Ann" },
        { id: "u2", name: "Bob" },
      ],
    },
  },
]

function Harness() {
  // useReactTable() intentionally returns fresh functions each render — see
  // the same eslint-disable precedent in data-filter.test.tsx.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    globalFilterFn: dataGridGlobalFilterFn,
    getColumnCanGlobalFilter: dataGridGetColumnCanGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div>
      <DataSearch table={table} />
      <ul>
        {table.getRowModel().rows.map((row) => (
          <li key={row.id}>{row.original.name}</li>
        ))}
      </ul>
    </div>
  )
}

async function search(term: string) {
  const user = userEvent.setup()
  render(<Harness />)
  expect(screen.getAllByRole("listitem")).toHaveLength(3)
  await user.type(screen.getByRole("textbox", { name: "Search" }), term)
  await act(async () => {
    await new Promise((r) => setTimeout(r, 250))
  })
  return screen.getAllByRole("listitem")
}

describe("DataSearch", () => {
  it("filters rows by a matching primitive cell value, debounced", async () => {
    const items = await search("gadget")
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent("Gadget")
  })

  it("resolves a user column's id to its display name", async () => {
    const items = await search("ann")
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent("Widget")
  })

  it("matches 'unassigned' for a null user column", async () => {
    const items = await search("unassigned")
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent("Gadget")
  })

  it("resolves a multiSelect column's option values to their labels", async () => {
    const items = await search("alpha")
    expect(items.map((el) => el.textContent)).toEqual(["Widget", "Gizmo"])
  })

  it("clears the filter via the clear button", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole("textbox", { name: "Search" }), "gadget")
    await act(async () => {
      await new Promise((r) => setTimeout(r, 250))
    })
    expect(screen.getAllByRole("listitem")).toHaveLength(1)

    await user.click(screen.getByRole("button", { name: "Clear search" }))
    await act(async () => {
      await new Promise((r) => setTimeout(r, 250))
    })
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
  })
})
