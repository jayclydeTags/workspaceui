import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { StockMovements } from "../page"
import { isValid, netChange, emptyDraft, type Movement } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("data helpers", () => {
  it("sums signed quantities", () => {
    expect(netChange([{ quantity: 500 }, { quantity: -150 }] as Movement[])).toBe(350)
  })

  it("rejects a zero-quantity movement", () => {
    const draft = { ...emptyDraft(), sku: "SKU-1", warehouse: "WH-1" }
    expect(isValid({ ...draft, quantity: 0 })).toBe(false)
    expect(isValid({ ...draft, quantity: -5 })).toBe(true)
  })

  it("requires a sku and a warehouse", () => {
    expect(isValid({ ...emptyDraft(), quantity: 5 })).toBe(false)
  })
})

describe("StockMovements", () => {
  it("lists the seeded movements with the net change", () => {
    render(<StockMovements />)
    expect(screen.getAllByText("PO-8841").length).toBeGreaterThan(0)
    // 500 - 150 - 5 - 220 + 300 - 80
    expect(screen.getByText("6 movements · net +345")).toBeInTheDocument()
  })

  it("filters by movement type", async () => {
    const user = userEvent.setup()
    render(<StockMovements />)

    await user.click(screen.getByLabelText("Filter by type"))
    await user.click(await screen.findByRole("option", { name: /^receipt$/i }))

    expect(screen.getAllByText("PO-8841").length).toBeGreaterThan(0)
    expect(screen.queryByText("SO-2290")).not.toBeInTheDocument()
  })

  it("records a new movement at the top of the ledger", async () => {
    const user = userEvent.setup()
    render(<StockMovements />)

    await user.click(screen.getByRole("button", { name: /record movement/i }))
    await user.type(screen.getByLabelText("SKU"), "SKU-1002")
    await user.type(screen.getByLabelText("Warehouse"), "WH-CEN")
    await user.type(screen.getByLabelText("Quantity"), "-40")
    await user.type(screen.getByLabelText("Reference"), "SO-2300")
    await user.click(screen.getByRole("button", { name: "Save movement" }))

    expect(screen.getAllByText("SO-2300").length).toBeGreaterThan(0)
    expect(screen.getByText("7 movements · net +305")).toBeInTheDocument()
  })
})
