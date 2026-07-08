import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { StockLevels } from "../page"
import { stockStatus, type StockLevel } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

const level = (onHand: number, reorderPoint: number) =>
  ({ onHand, reorderPoint }) as StockLevel

describe("stockStatus", () => {
  it("is out-of-stock at zero", () => {
    expect(stockStatus(level(0, 100))).toBe("out-of-stock")
  })

  it("is low at or below the reorder point", () => {
    expect(stockStatus(level(100, 100))).toBe("low")
    expect(stockStatus(level(99, 100))).toBe("low")
  })

  it("is in-stock above the reorder point", () => {
    expect(stockStatus(level(101, 100))).toBe("in-stock")
  })
})

describe("StockLevels", () => {
  it("lists the seeded stock and counts the ones needing reorder", () => {
    render(<StockLevels />)
    expect(screen.getAllByText("Canvas Tote Bag").length).toBeGreaterThan(0)
    expect(screen.getByText("6 stock records")).toBeInTheDocument()
    // SKU-1001@WH-W (low), SKU-1002@WH-CEN (out), SKU-1004@WH-SE (low)
    expect(screen.getByText("3 need reorder")).toBeInTheDocument()
  })

  it("filters by search query", async () => {
    const user = userEvent.setup()
    render(<StockLevels />)

    await user.type(screen.getByLabelText("Search stock"), "notebook")

    expect(screen.getAllByText("Recycled Notebook A5").length).toBeGreaterThan(0)
    expect(screen.queryByText("Canvas Tote Bag")).not.toBeInTheDocument()
  })

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup()
    render(<StockLevels />)

    await user.type(screen.getByLabelText("Search stock"), "zzzz")

    expect(screen.getByText("No stock records")).toBeInTheDocument()
  })

  it("adjusts on-hand quantity and re-derives status", async () => {
    const user = userEvent.setup()
    render(<StockLevels />)

    await user.click(
      screen.getAllByRole("button", { name: "Adjust SKU-1002 at WH-CEN" })[0]
    )
    const onHand = screen.getByLabelText("On hand")
    await user.clear(onHand)
    await user.type(onHand, "500")
    await user.click(screen.getByRole("button", { name: "Save adjustment" }))

    expect(screen.getAllByText("500").length).toBeGreaterThan(0)
    // Was the only out-of-stock row; now only the two "low" rows remain.
    expect(screen.queryByText("Out of stock")).not.toBeInTheDocument()
    expect(screen.getByText("2 need reorder")).toBeInTheDocument()
  })
})
