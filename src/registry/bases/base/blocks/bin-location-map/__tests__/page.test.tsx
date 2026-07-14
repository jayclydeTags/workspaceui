import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { BinLocationMap } from "../page"
import {
  BINS,
  assign,
  canAssign,
  clearBin,
  fillPct,
  isDraftValid,
  isPositionTaken,
  type Bin,
} from "../data"

const bin = (overrides: Partial<Bin> = {}): Bin => ({
  id: "x",
  code: "CEN-X1",
  warehouse: "WH-CEN",
  row: 0,
  col: 0,
  capacity: 100,
  sku: null,
  qty: 0,
  status: "active",
  ...overrides,
})

describe("canAssign", () => {
  it("accepts an empty active bin within capacity", () => {
    expect(canAssign(bin(), { sku: "SKU-1001", qty: 50 })).toBe(true)
  })

  it("rejects assignment that would overflow capacity", () => {
    expect(canAssign(bin({ qty: 80 }), { sku: "SKU-1001", qty: 30 })).toBe(false)
  })

  it("rejects a blocked or quarantine bin outright, even with room", () => {
    expect(canAssign(bin({ status: "blocked" }), { sku: "SKU-1001", qty: 1 })).toBe(
      false
    )
    expect(
      canAssign(bin({ status: "quarantine" }), { sku: "SKU-1001", qty: 1 })
    ).toBe(false)
  })

  it("rejects mixing a second SKU into an occupied bin", () => {
    const occupied = bin({ sku: "SKU-1001", qty: 10 })
    expect(canAssign(occupied, { sku: "SKU-1002", qty: 5 })).toBe(false)
    expect(canAssign(occupied, { sku: "SKU-1001", qty: 5 })).toBe(true)
  })

  it("rejects a non-positive quantity", () => {
    expect(canAssign(bin(), { sku: "SKU-1001", qty: 0 })).toBe(false)
  })
})

describe("assign / clearBin", () => {
  it("tops up quantity and sets the SKU", () => {
    const result = assign(bin({ sku: "SKU-1001", qty: 10 }), {
      sku: "SKU-1001",
      qty: 5,
    })
    expect(result.qty).toBe(15)
    expect(result.sku).toBe("SKU-1001")
  })

  it("clears the SKU and quantity back to empty", () => {
    const result = clearBin(bin({ sku: "SKU-1001", qty: 10 }))
    expect(result.sku).toBeNull()
    expect(result.qty).toBe(0)
  })
})

describe("isPositionTaken", () => {
  it("flags a duplicate row/col within the same warehouse", () => {
    const bins = [bin({ id: "1", row: 0, col: 0 })]
    expect(
      isPositionTaken(bins, { code: "Y", warehouse: "WH-CEN", row: 0, col: 0, capacity: 10, status: "active" })
    ).toBe(true)
  })

  it("ignores a different warehouse at the same position", () => {
    const bins = [bin({ id: "1", warehouse: "WH-CEN", row: 0, col: 0 })]
    expect(
      isPositionTaken(bins, { code: "Y", warehouse: "WH-NW", row: 0, col: 0, capacity: 10, status: "active" })
    ).toBe(false)
  })

  it("excludes the bin being edited", () => {
    const bins = [bin({ id: "1", row: 0, col: 0 })]
    expect(
      isPositionTaken(
        bins,
        { code: "X", warehouse: "WH-CEN", row: 0, col: 0, capacity: 10, status: "active" },
        "1"
      )
    ).toBe(false)
  })
})

describe("fillPct / isDraftValid", () => {
  it("computes a clamped fill percentage", () => {
    expect(fillPct(bin({ capacity: 200, qty: 50 }))).toBe(25)
    expect(fillPct(bin({ capacity: 0, qty: 0 }))).toBe(0)
  })

  it("requires a code and positive capacity", () => {
    expect(
      isDraftValid({ code: "", warehouse: "WH-CEN", row: 0, col: 0, capacity: 10, status: "active" })
    ).toBe(false)
    expect(
      isDraftValid({ code: "A1", warehouse: "WH-CEN", row: 0, col: 0, capacity: 0, status: "active" })
    ).toBe(false)
    expect(
      isDraftValid({ code: "A1", warehouse: "WH-CEN", row: 0, col: 0, capacity: 10, status: "active" })
    ).toBe(true)
  })
})

describe("BinLocationMap", () => {
  it("summarises total bins and occupied count", () => {
    render(<BinLocationMap />)
    const occupied = BINS.filter((b) => b.sku !== null && b.qty > 0).length
    expect(
      screen.getByText(`${BINS.length} bins across 3 warehouses · ${occupied} occupied`)
    ).toBeInTheDocument()
  })

  it("switches warehouse tabs", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    expect(screen.getByRole("button", { name: /^Bin CEN-A1,/ })).toBeInTheDocument()
    await user.click(screen.getByRole("tab", { name: "WH-NW" }))
    expect(await screen.findByRole("button", { name: /^Bin NW-A1,/ })).toBeInTheDocument()
  })

  it("flags unavailable bins in the active warehouse", () => {
    render(<BinLocationMap />)
    expect(screen.getByText("Bins unavailable")).toBeInTheDocument()
    expect(screen.getByText(/CEN-B1 \(blocked\)/)).toBeInTheDocument()
  })

  it("opens the bin detail sheet and assigns stock into an empty bin", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    await user.click(screen.getByRole("button", { name: /^Bin CEN-A3,/ }))
    expect(await screen.findByRole("heading", { name: "CEN-A3" })).toBeInTheDocument()

    await user.type(screen.getByLabelText("Quantity"), "50")
    await user.click(screen.getByRole("button", { name: "Assign" }))

    expect(screen.getByText("50/150 used")).toBeInTheDocument()
  })

  it("blocks assigning past the bin's remaining capacity", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    // CEN-A1 already holds 180/200 SKU-1001.
    await user.click(screen.getByRole("button", { name: /^Bin CEN-A1,/ }))
    await user.type(screen.getByLabelText("Quantity"), "50")

    expect(screen.getByText("Only 20 units of room left.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add stock" })).toBeDisabled()
  })

  it("clears an occupied bin back to empty", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    await user.click(screen.getByRole("button", { name: /^Bin CEN-A1,/ }))
    await user.click(await screen.findByRole("button", { name: "Clear bin" }))

    expect(screen.getByText("0/200 used")).toBeInTheDocument()
  })

  it("rejects a bin added at a position already taken in that warehouse", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    await user.click(screen.getByRole("button", { name: /add bin/i }))
    await user.type(screen.getByLabelText("Code"), "CEN-DUPE")
    await user.type(screen.getByLabelText("Capacity"), "100")
    // Row/col default to 0,0, which CEN-A1 already occupies.

    expect(
      screen.getByText("Another bin in WH-CEN already sits at that position.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add bin" })).toBeDisabled()
  })

  it("adds a new bin at a free position", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    await user.click(screen.getAllByRole("button", { name: /add bin/i })[0])
    await user.type(screen.getByLabelText("Code"), "CEN-C1")
    await user.type(screen.getByLabelText("Row"), "2")
    await user.type(screen.getByLabelText("Capacity"), "100")
    await user.click(screen.getByRole("button", { name: "Add bin" }))

    expect(screen.getByRole("button", { name: /^Bin CEN-C1,/ })).toBeInTheDocument()
  })

  it("quick-adds a bin by clicking an empty floor slot, pre-seeding its position", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    // WH-CEN row 0 fills cols 0–3; the margin ghost slot sits at row 0, col 4.
    await user.click(
      screen.getByRole("button", { name: "Add slot at row 1, column 5" })
    )
    expect(screen.getByLabelText("Row")).toHaveValue(0)
    expect(screen.getByLabelText("Column")).toHaveValue(4)

    await user.type(screen.getByLabelText("Code"), "CEN-A5")
    await user.click(screen.getByRole("button", { name: "Add bin" }))

    expect(screen.getByRole("button", { name: /^Bin CEN-A5,/ })).toBeInTheDocument()
  })

  it("deletes a bin after confirmation", async () => {
    const user = userEvent.setup()
    render(<BinLocationMap />)

    await user.click(screen.getByRole("button", { name: /^Bin CEN-A3,/ }))
    await user.click(await screen.findByRole("button", { name: "Delete bin" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByRole("button", { name: /^Bin CEN-A3,/ })).not.toBeInTheDocument()
  })
})
