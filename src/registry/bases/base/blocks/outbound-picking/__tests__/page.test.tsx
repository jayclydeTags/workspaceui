import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { OutboundPicking } from "../page"
import {
  PICK_LISTS,
  canCompletePick,
  canPick,
  canPickFromBin,
  isLineClosed,
  pickCompletion,
  pickFromBin,
  pickStatus,
  pickedQty,
  remainingToPick,
  shortfall,
  type Bin,
  type PickLine,
  type PickList,
} from "../data"

const line = (over: Partial<PickLine> = {}): PickLine => ({
  id: "x",
  sku: "SKU-1001",
  requestedQty: 100,
  allocations: [],
  short: false,
  ...over,
})

const list = (over: Partial<PickList> = {}): PickList => ({
  id: "l",
  orderId: "SO-7001",
  warehouse: "WH-CEN",
  picker: "Dana",
  completed: false,
  lines: [line()],
  ...over,
})

const bin = (over: Partial<Bin> = {}): Bin => ({
  id: "b",
  code: "B",
  warehouse: "WH-CEN",
  row: 0,
  col: 0,
  capacity: 200,
  sku: "SKU-1001",
  qty: 100,
  status: "active",
  ...over,
})

describe("canPick", () => {
  it("only allows picking against an open order", () => {
    expect(canPick(list({ orderId: "SO-7001" }))).toBe(true)
    expect(canPick(list({ orderId: "SO-7003" }))).toBe(false) // closed
    expect(canPick(list({ orderId: "SO-7004" }))).toBe(false) // cancelled
  })
})

describe("pickedQty / remainingToPick / shortfall", () => {
  it("sums allocations and derives the gap", () => {
    const l = line({
      requestedQty: 100,
      allocations: [{ binId: "1", qty: 60 }, { binId: "6", qty: 30 }],
    })
    expect(pickedQty(l)).toBe(90)
    expect(remainingToPick(l)).toBe(10)
    expect(shortfall(l)).toBe(10)
  })
})

describe("isLineClosed", () => {
  it("closes on full pick", () => {
    expect(isLineClosed(line({ allocations: [{ binId: "1", qty: 100 }] }))).toBe(true)
  })
  it("closes on short-pick even when under-picked", () => {
    expect(isLineClosed(line({ allocations: [{ binId: "1", qty: 40 }], short: true }))).toBe(true)
  })
  it("stays open while partially picked and not shorted", () => {
    expect(isLineClosed(line({ allocations: [{ binId: "1", qty: 40 }] }))).toBe(false)
  })
})

describe("pickStatus", () => {
  it("is pending before anything is picked", () => {
    expect(pickStatus(list({ lines: [line()] }))).toBe("pending")
  })
  it("is picking while a line is still open", () => {
    expect(
      pickStatus(list({ lines: [line({ allocations: [{ binId: "1", qty: 40 }] })] }))
    ).toBe("picking")
  })
  it("is picked once every line is closed", () => {
    expect(
      pickStatus(list({ lines: [line({ allocations: [{ binId: "1", qty: 100 }] })] }))
    ).toBe("picked")
  })
  it("is completed when the flag is set, regardless of lines", () => {
    expect(pickStatus(list({ completed: true }))).toBe("completed")
  })
})

describe("canCompletePick", () => {
  it("needs a picker, every line closed, and not already completed", () => {
    const full = line({ allocations: [{ binId: "1", qty: 100 }] })
    expect(canCompletePick(list({ lines: [full] }))).toBe(true)
    expect(canCompletePick(list({ picker: null, lines: [full] }))).toBe(false)
    expect(canCompletePick(list({ lines: [line()] }))).toBe(false) // line open
    expect(canCompletePick(list({ completed: true, lines: [full] }))).toBe(false)
  })
  it("accepts a short-picked line as closed", () => {
    const shortLine = line({ allocations: [{ binId: "1", qty: 40 }], short: true })
    expect(canCompletePick(list({ lines: [shortLine] }))).toBe(true)
  })
})

describe("canPickFromBin", () => {
  it("draws only from an active bin holding enough of the SKU", () => {
    expect(canPickFromBin(bin(), "SKU-1001", 100)).toBe(true)
    expect(canPickFromBin(bin({ qty: 50 }), "SKU-1001", 100)).toBe(false) // not enough
    expect(canPickFromBin(bin({ sku: "SKU-9999" }), "SKU-1001", 10)).toBe(false) // wrong SKU
    expect(canPickFromBin(bin({ status: "blocked" }), "SKU-1001", 10)).toBe(false)
    expect(canPickFromBin(bin(), "SKU-1001", 0)).toBe(false)
  })
})

describe("pickFromBin", () => {
  it("decrements on-hand and empties the slot at zero", () => {
    expect(pickFromBin(bin({ qty: 100 }), 40).qty).toBe(60)
    const emptied = pickFromBin(bin({ qty: 100 }), 100)
    expect(emptied.qty).toBe(0)
    expect(emptied.sku).toBeNull()
  })
})

describe("pickCompletion", () => {
  it("carries per-SKU requested vs picked — a short surfaces as a gap", () => {
    const done = pickCompletion(
      list({
        id: "9",
        orderId: "SO-7002",
        lines: [
          line({ sku: "SKU-1001", requestedQty: 100, allocations: [{ binId: "1", qty: 100 }] }),
          line({ sku: "SKU-1004", requestedQty: 80, allocations: [{ binId: "9", qty: 60 }], short: true }),
        ],
      })
    )
    expect(done).toEqual({
      pickId: "9",
      orderId: "SO-7002",
      lines: [
        { sku: "SKU-1001", requestedQty: 100, pickedQty: 100 },
        { sku: "SKU-1004", requestedQty: 80, pickedQty: 60 },
      ],
    })
  })
})

describe("OutboundPicking", () => {
  it("summarises how many lists are still open to pick", () => {
    render(<OutboundPicking />)
    // 3 lists: list 3 is a closed order, so only lists 1 and 2 are pickable.
    expect(screen.getByText("3 pick lists · 2 to pick")).toBeInTheDocument()
  })

  it("blocks picking against a closed order", async () => {
    const user = userEvent.setup()
    render(<OutboundPicking />)

    await user.click(screen.getByRole("button", { name: "Open pick list SO-7003" }))

    expect(
      await screen.findByText(/is closed — it can no longer be picked/)
    ).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Allocate" })).not.toBeInTheDocument()
  })

  it("claims, allocates across a bin, and completes a pick list", async () => {
    const user = userEvent.setup()
    render(<OutboundPicking />)

    await user.click(screen.getByRole("button", { name: "Open pick list SO-7001" }))

    // Unclaimed — claim it first.
    await user.click(screen.getByRole("button", { name: "Claim to start picking" }))

    // Line 1a wants 200 of SKU-1001; CEN-A1 holds 180 — allocate it, then short the rest.
    await user.click(screen.getByLabelText("Bin for SKU-1001"))
    await user.click(await screen.findByRole("option", { name: /CEN-A1/ }))
    await user.click(screen.getAllByRole("button", { name: "Allocate" })[0])
    // 180 of 200 picked, line still open — short-pick to close it.
    await user.click(screen.getAllByRole("button", { name: "Short-pick" })[0])

    // Line 1b wants 100 of SKU-1004; CEN-A4 holds 150 — full pick.
    await user.click(screen.getByLabelText("Bin for SKU-1004"))
    await user.click(await screen.findByRole("option", { name: /CEN-A4/ }))
    await user.click(screen.getByRole("button", { name: "Allocate" }))

    // Both lines closed — complete is enabled.
    const complete = screen.getByRole("button", { name: "Complete pick" })
    expect(complete).toBeEnabled()
    await user.click(complete)
    expect(screen.getByRole("button", { name: "Completed" })).toBeDisabled()
  })

  it("keeps the fixtures free of derived line status", () => {
    // pickedQty/remaining are derived from allocations, never stored.
    expect(PICK_LISTS[0].lines[0]).not.toHaveProperty("pickedQty")
  })
})
