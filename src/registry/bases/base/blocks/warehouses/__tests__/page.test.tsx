import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Warehouses } from "../page"
import { utilization, type Warehouse } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

const wh = (capacity: number, used: number) =>
  ({ capacity, used }) as Warehouse

describe("utilization", () => {
  it("returns a rounded percentage", () => {
    expect(utilization(wh(12000, 9400))).toBe(78)
  })

  it("guards against a zero capacity", () => {
    expect(utilization(wh(0, 100))).toBe(0)
  })

  it("clamps over-capacity to 100", () => {
    expect(utilization(wh(100, 250))).toBe(100)
  })
})

describe("Warehouses", () => {
  it("lists the seeded warehouses", () => {
    render(<Warehouses />)
    expect(screen.getAllByText("Central Fulfilment").length).toBeGreaterThan(0)
    expect(screen.getAllByText("WH-NW").length).toBeGreaterThan(0)
    expect(screen.getByText("5 warehouses")).toBeInTheDocument()
  })

  it("creates a new warehouse, starting empty", async () => {
    const user = userEvent.setup()
    render(<Warehouses />)

    await user.click(screen.getByRole("button", { name: /new warehouse/i }))
    await user.type(screen.getByLabelText("Name"), "Gulf Coast Annex")
    await user.type(screen.getByLabelText("Code"), "WH-GC")
    await user.type(screen.getByLabelText("Capacity (units)"), "4000")
    await user.click(screen.getByRole("button", { name: "Create warehouse" }))

    expect(screen.getAllByText("Gulf Coast Annex").length).toBeGreaterThan(0)
    expect(screen.getByText("6 warehouses")).toBeInTheDocument()
    expect(screen.getAllByText(/0 \/ 4,000 \(0%\)/).length).toBeGreaterThan(0)
  })

  it("edits an existing warehouse", async () => {
    const user = userEvent.setup()
    render(<Warehouses />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for WH-SE" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const nameInput = screen.getByLabelText("Name")
    await user.clear(nameInput)
    await user.type(nameInput, "Southeast Regional Depot")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(
      screen.getAllByText("Southeast Regional Depot").length
    ).toBeGreaterThan(0)
    expect(screen.queryByText("Southeast Depot")).not.toBeInTheDocument()
  })

  it("deletes a warehouse after confirmation", async () => {
    const user = userEvent.setup()
    render(<Warehouses />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for WH-NE" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("WH-NE")).not.toBeInTheDocument()
    expect(screen.getByText("4 warehouses")).toBeInTheDocument()
  })
})
