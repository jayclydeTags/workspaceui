import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataFilter, dataGridFilterFn } from "../data-filter"
import "../data-grid-types"

interface Item {
  id: string
  name: string
  qty: number
  price: number
  status: string
  active: boolean
  joined: string
  tags: string[]
}

const data: Item[] = [
  {
    id: "1",
    name: "Widget",
    qty: 5,
    price: 9.99,
    status: "open",
    active: true,
    joined: "2024-01-10",
    tags: ["a"],
  },
  {
    id: "2",
    name: "Gadget",
    qty: 15,
    price: 29.99,
    status: "closed",
    active: false,
    joined: "2024-03-05",
    tags: ["b"],
  },
  {
    id: "3",
    name: "Gizmo",
    qty: 25,
    price: 49.99,
    status: "open",
    active: true,
    joined: "2024-06-20",
    tags: ["a", "b"],
  },
]

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: { type: "text" },
    filterFn: dataGridFilterFn,
  },
  {
    accessorKey: "qty",
    header: "Qty",
    meta: { type: "number" },
    filterFn: dataGridFilterFn,
  },
  {
    accessorKey: "price",
    header: "Price",
    meta: { type: "currency" },
    filterFn: dataGridFilterFn,
  },
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
    filterFn: dataGridFilterFn,
  },
  {
    accessorKey: "active",
    header: "Active",
    meta: { type: "boolean" },
    filterFn: dataGridFilterFn,
  },
  {
    accessorKey: "joined",
    header: "Joined",
    meta: { type: "date" },
    filterFn: dataGridFilterFn,
  },
  // multiSelect is out of scope for this ticket — present in the fixture
  // only to assert it's excluded from the "+ Filter" column list.
  {
    accessorKey: "tags",
    header: "Tags",
    meta: { type: "multiSelect" },
  },
]

function Harness() {
  // useReactTable() intentionally returns fresh functions each render — see
  // the same eslint-disable precedent in data-grid.test.tsx.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  })
  return (
    <div>
      <DataFilter table={table} />
      <ul aria-label="results">
        {table.getRowModel().rows.map((row) => (
          <li key={row.id}>{row.original.name}</li>
        ))}
      </ul>
    </div>
  )
}

function visibleNames() {
  // queryAllByRole (not getAllByRole) so an empty result set doesn't throw —
  // some assertions below deliberately drive a filter to zero matches.
  return within(screen.getByRole("list"))
    .queryAllByRole("listitem")
    .map((li) => li.textContent)
}

// A committed chip's [column | operator | value | x] wrapper, found by its
// aria-label — the same "column operator value" sentence formatFilterSummary
// produces.
function chip(summary: string) {
  return screen.getByRole("group", { name: summary })
}

async function openNewFilter(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Filter" }))
}

async function pickColumn(
  user: ReturnType<typeof userEvent.setup>,
  label: string
) {
  await user.click(await screen.findByRole("option", { name: label }))
}

async function pickOperator(
  user: ReturnType<typeof userEvent.setup>,
  label: string
) {
  await user.click(await screen.findByRole("button", { name: label }))
}

describe("DataFilter", () => {
  it("renders all rows with no filters active", () => {
    render(<Harness />)
    expect(visibleNames()).toEqual(["Widget", "Gadget", "Gizmo"])
  })

  it("excludes multiSelect columns from the column-pick list (out of scope this ticket)", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await openNewFilter(user)
    expect(
      await screen.findByRole("option", { name: "Name" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("option", { name: "Tags" })
    ).not.toBeInTheDocument()
  })

  describe("text column", () => {
    it("filters with contains and commits a [column | operator | value | x] chip", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Name")
      await pickOperator(user, "contains")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "adg" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Gadget"])
      const pill = chip("Name contains adg")
      expect(within(pill).getByText("Name")).toBeInTheDocument()
      expect(
        within(pill).getByRole("button", { name: "contains" })
      ).toBeInTheDocument()
      expect(
        within(pill).getByRole("button", { name: "adg" })
      ).toBeInTheDocument()
    })
  })

  describe("number column", () => {
    it("filters with > (gt)", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Qty")
      await pickOperator(user, ">")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "10" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Gadget", "Gizmo"])
    })
  })

  describe("currency column", () => {
    it("filters with is between (two inputs)", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Price")
      await pickOperator(user, "is between")
      fireEvent.change(screen.getByPlaceholderText("From"), {
        target: { value: "10" },
      })
      fireEvent.change(screen.getByPlaceholderText("To"), {
        target: { value: "40" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Gadget"])
    })
  })

  describe("date column", () => {
    it("filters with is before", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Joined")
      await pickOperator(user, "is before")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "2024-04-01" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Widget", "Gadget"])
    })
  })

  describe("select column", () => {
    it("filters with is", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Status")
      await pickOperator(user, "is")
      await user.click(await screen.findByRole("option", { name: "Closed" }))

      expect(visibleNames()).toEqual(["Gadget"])
    })

    it("filters with is any of (multi-select + Apply)", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Status")
      await pickOperator(user, "is any of")
      await user.click(await screen.findByRole("option", { name: "Open" }))
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Widget", "Gizmo"])
      const pill = chip("Status is any of Open")
      expect(
        within(pill).getByRole("button", { name: "is any of" })
      ).toBeInTheDocument()
      expect(
        within(pill).getByRole("button", { name: "Open" })
      ).toBeInTheDocument()
    })
  })

  describe("boolean column", () => {
    it("has no value step — committing ends at the operator, and the chip has no value segment", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Active")
      await pickOperator(user, "is false")

      expect(visibleNames()).toEqual(["Gadget"])
      const pill = chip("Active is false")
      expect(
        within(pill).getByRole("button", { name: "is false" })
      ).toBeInTheDocument()
      // The popover closed immediately — no lingering value step.
      expect(screen.queryByPlaceholderText("Value")).not.toBeInTheDocument()
    })
  })

  describe("editing a chip", () => {
    it("operator segment opens a dropdown of operators; picking a same-shape one keeps the value", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Qty")
      await pickOperator(user, ">")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "10" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))
      expect(visibleNames()).toEqual(["Gadget", "Gizmo"])

      await user.click(
        within(chip("Qty > 10")).getByRole("button", { name: ">" })
      )
      expect(await screen.findByRole("button", { name: "<" })).toBeVisible()
      await user.click(screen.getByRole("button", { name: "<" }))

      // > and < share the same single-value shape, so "10" carries over.
      expect(visibleNames()).toEqual(["Widget"])
      expect(chip("Qty < 10")).toBeInTheDocument()
    })

    it("operator segment resets the value when switching to a different value shape", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Price")
      await pickOperator(user, "is between")
      fireEvent.change(screen.getByPlaceholderText("From"), {
        target: { value: "10" },
      })
      fireEvent.change(screen.getByPlaceholderText("To"), {
        target: { value: "40" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))
      expect(visibleNames()).toEqual(["Gadget"])

      await user.click(
        within(chip("Price is between 10 and 40")).getByRole("button", {
          name: "is between",
        })
      )
      await user.click(await screen.findByRole("button", { name: "=" }))

      // between (a tuple) and = (a single value) don't share a shape, so
      // the old value can't carry over — the value segment resets.
      expect(
        screen.getByRole("button", { name: "Set value" })
      ).toBeInTheDocument()
    })

    it("value segment reopens with the existing value loaded and applies a new one", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Qty")
      await pickOperator(user, ">")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "10" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))
      expect(visibleNames()).toEqual(["Gadget", "Gizmo"])

      await user.click(
        within(chip("Qty > 10")).getByRole("button", { name: "10" })
      )
      const valueInput = await screen.findByPlaceholderText("Value")
      expect(valueInput).toHaveValue(10)
      fireEvent.change(valueInput, { target: { value: "20" } })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Gizmo"])
    })
  })

  describe("removing a chip", () => {
    it("clears the filter through column.setFilterValue(undefined)", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Active")
      await pickOperator(user, "is true")
      expect(visibleNames()).toEqual(["Widget", "Gizmo"])

      await user.click(
        screen.getByRole("button", { name: "Remove Active filter" })
      )

      expect(visibleNames()).toEqual(["Widget", "Gadget", "Gizmo"])
      expect(
        screen.queryByRole("group", { name: /Active/ })
      ).not.toBeInTheDocument()
    })
  })

  describe("column pick list", () => {
    it("excludes a column that already has an active filter", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Name")
      await pickOperator(user, "is")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "Widget" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      await openNewFilter(user)
      expect(
        await screen.findByRole("option", { name: "Qty" })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole("option", { name: "Name" })
      ).not.toBeInTheDocument()
    })
  })
})
