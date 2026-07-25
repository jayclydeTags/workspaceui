import { act, fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { resizeTo } from "@/test/setup"
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
  assignee: string | null
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
    assignee: "u1",
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
    assignee: null,
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
    assignee: "u2",
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
  {
    accessorKey: "tags",
    header: "Tags",
    meta: {
      type: "multiSelect",
      options: [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ],
    },
    filterFn: dataGridFilterFn,
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
    filterFn: dataGridFilterFn,
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
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  })
  return (
    <div>
      <DataFilter table={table} />
      {/* DataGrid owns real header-click sorting; this stands in for it so
          narrow-branch tests can exercise a pre-existing multi-column sort
          without depending on that component. */}
      <button
        type="button"
        onClick={() =>
          table.setSorting([
            { id: "qty", desc: false },
            { id: "price", desc: true },
          ])
        }
      >
        set wide multi-sort
      </button>
      <ul aria-label="results">
        {table.getRowModel().rows.map((row) => (
          <li key={row.id}>{row.original.name}</li>
        ))}
      </ul>
    </div>
  )
}

function toolbar() {
  return screen.getByRole("toolbar", { name: "Sort and filter" })
}

function goNarrow() {
  act(() => resizeTo(toolbar(), 320))
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

  describe("multiSelect column", () => {
    it("filters with has any of", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Tags")
      await pickOperator(user, "has any of")
      await user.click(await screen.findByRole("option", { name: "A" }))
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Widget", "Gizmo"])
      const pill = chip("Tags has any of A")
      expect(
        within(pill).getByRole("button", { name: "has any of" })
      ).toBeInTheDocument()
    })

    it("filters with has all of", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Tags")
      await pickOperator(user, "has all of")
      await user.click(await screen.findByRole("option", { name: "A" }))
      await user.click(screen.getByRole("option", { name: "B" }))
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Gizmo"])
    })

    it("filters with has none of", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Tags")
      await pickOperator(user, "has none of")
      await user.click(await screen.findByRole("option", { name: "A" }))
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Gadget"])
    })

    it("has no value step for is empty, and no row has an empty tag list", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Tags")
      await pickOperator(user, "is empty")

      expect(visibleNames()).toEqual([])
      expect(chip("Tags is empty")).toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Apply" })
      ).not.toBeInTheDocument()
    })
  })

  describe("user column", () => {
    it("filters with is", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Assignee")
      await pickOperator(user, "is")
      await user.click(await screen.findByRole("option", { name: "Ann" }))

      expect(visibleNames()).toEqual(["Widget"])
      expect(chip("Assignee is Ann")).toBeInTheDocument()
    })

    it("filters with is not", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Assignee")
      await pickOperator(user, "is not")
      await user.click(await screen.findByRole("option", { name: "Bob" }))

      expect(visibleNames()).toEqual(["Widget", "Gadget"])
    })

    it("treats Unassigned as a pickable value, not a dedicated operator", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Assignee")
      await pickOperator(user, "is")
      await user.click(
        await screen.findByRole("option", { name: "Unassigned" })
      )

      expect(visibleNames()).toEqual(["Gadget"])
      expect(chip("Assignee is Unassigned")).toBeInTheDocument()
    })

    it("filters with is any of, including Unassigned in the picked set", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Assignee")
      await pickOperator(user, "is any of")
      await user.click(
        await screen.findByRole("option", { name: "Unassigned" })
      )
      await user.click(screen.getByRole("button", { name: "Apply" }))

      expect(visibleNames()).toEqual(["Gadget"])
      expect(chip("Assignee is any of Unassigned")).toBeInTheDocument()
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

  describe("narrow container", () => {
    it("replaces the popover chain with sheet-backed toolbar buttons below 448px", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      // Wide: the "Filter" trigger opens the column-pick popover instantly.
      await openNewFilter(user)
      expect(
        await screen.findByRole("option", { name: "Name" })
      ).toBeInTheDocument()
      await user.keyboard("{Escape}")

      goNarrow()

      expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument()
      // Narrow: the same-labelled "Filter" trigger opens a Sheet instead —
      // no column options render until "Add filter" is tapped inside it.
      await user.click(screen.getByRole("button", { name: "Filter" }))
      expect(screen.getByRole("dialog")).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Add filter" })
      ).toBeInTheDocument()
      expect(screen.queryByRole("option", { name: "Name" })).toBeNull()
    })

    it("shows a count badge on the Filter button and doesn't open the wide popover chain", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Active")
      await pickOperator(user, "is true")

      goNarrow()

      const filterButton = screen.getByRole("button", { name: "Filter 1" })
      expect(filterButton).toBeInTheDocument()
      // Column-pick popover options only ever render once a trigger is
      // clicked, so their absence here just confirms nothing auto-opened.
      expect(screen.queryByRole("option", { name: "Name" })).toBeNull()
    })

    it("filter sheet lists active filters as full-width rows with a persistent Add filter, and adds one via the second-step chain", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Active")
      await pickOperator(user, "is true")
      expect(visibleNames()).toEqual(["Widget", "Gizmo"])

      goNarrow()
      await user.click(screen.getByRole("button", { name: "Filter 1" }))

      expect(
        screen.getByRole("button", { name: "Active is true" })
      ).toBeInTheDocument()
      const addFilter = screen.getByRole("button", { name: "Add filter" })
      expect(addFilter).toBeInTheDocument()

      await user.click(addFilter)
      await pickColumn(user, "Qty")
      await pickOperator(user, ">")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "10" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      // Back on the list step inside the still-open sheet.
      expect(
        screen.getByRole("button", { name: "Active is true" })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Qty > 10" })
      ).toBeInTheDocument()

      // The rest of the page is inert while the sheet is open — close it to
      // check the underlying table state the chain actually wrote.
      await user.keyboard("{Escape}")
      expect(visibleNames()).toEqual(["Gizmo"])
    })

    it("tapping an existing row edits it, skipping straight to the operator step", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Qty")
      await pickOperator(user, ">")
      fireEvent.change(screen.getByPlaceholderText("Value"), {
        target: { value: "10" },
      })
      await user.click(screen.getByRole("button", { name: "Apply" }))

      goNarrow()
      await user.click(screen.getByRole("button", { name: "Filter 1" }))
      await user.click(screen.getByRole("button", { name: "Qty > 10" }))

      // Landed on the operator step directly — no column list shown.
      expect(screen.queryByPlaceholderText("Filter by column...")).toBeNull()
      expect(screen.getByRole("button", { name: "<" })).toBeInTheDocument()
    })

    it("removes a row from the sheet's list step", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await openNewFilter(user)
      await pickColumn(user, "Active")
      await pickOperator(user, "is true")

      goNarrow()
      await user.click(screen.getByRole("button", { name: "Filter 1" }))
      await user.click(
        screen.getByRole("button", { name: "Remove Active filter" })
      )
      expect(
        screen.queryByRole("button", { name: "Active is true" })
      ).toBeNull()

      await user.keyboard("{Escape}")
      expect(visibleNames()).toEqual(["Widget", "Gadget", "Gizmo"])
      expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument()
    })

    it("Sort button is labelled Sort when unsorted, and cycles asc -> desc -> off on the tapped column", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      goNarrow()

      // Each tap in the sheet commits and closes it (per spec), so the
      // trigger and the sheet's list button never coexist — each step below
      // re-finds the trigger by its current label, then scopes the tap to
      // the freshly-opened dialog.
      expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument()

      await user.click(screen.getByRole("button", { name: "Sort" }))
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Qty",
        })
      )
      expect(screen.getByRole("button", { name: "Qty" })).toBeInTheDocument()

      // asc -> desc
      await user.click(screen.getByRole("button", { name: "Qty" }))
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Qty",
        })
      )
      expect(screen.getByRole("button", { name: "Qty" })).toBeInTheDocument()

      // desc -> off: back to the unlabelled "Sort" trigger.
      await user.click(screen.getByRole("button", { name: "Qty" }))
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Qty",
        })
      )
      expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument()
    })

    it("an existing wide multi-sort shows as primary + '+1 more', untouched until a new pick replaces it", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await user.click(
        screen.getByRole("button", { name: "set wide multi-sort" })
      )
      goNarrow()

      expect(
        screen.getByRole("button", { name: /^Qty\s*\+1 more$/ })
      ).toBeInTheDocument()

      await user.click(screen.getByRole("button", { name: /^Qty/ }))
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Price",
        })
      )

      // Picking a new column replaces the whole array — no more "+1 more".
      expect(screen.getByRole("button", { name: "Price" })).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: /\+1 more$/ })).toBeNull()
    })

    it("tapping the current primary column of a wide multi-sort cycles its own direction instead of resetting to asc", async () => {
      const user = userEvent.setup()
      render(<Harness />)
      await user.click(
        screen.getByRole("button", { name: "set wide multi-sort" })
      )
      goNarrow()

      // Wide state: Qty asc (primary), Price desc.
      await user.click(screen.getByRole("button", { name: /^Qty/ }))
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Qty",
        })
      )

      // Qty was asc -> cycles to desc (not reset back to asc), and the
      // extra "Price" column is gone since narrow enforces single-column.
      expect(screen.getByRole("button", { name: "Qty" })).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: /\+1 more$/ })).toBeNull()

      await user.click(screen.getByRole("button", { name: "Qty" }))
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Qty",
        })
      )
      // desc -> off.
      expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument()
    })

    it("does not share an observer with anything else — resizing back above 448px restores the chip chain", () => {
      render(<Harness />)
      goNarrow()
      expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument()

      act(() => resizeTo(toolbar(), 800))

      expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: "Sort" })).toBeNull()
    })
  })
})
