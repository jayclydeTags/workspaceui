import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { InventoryAdjustments } from "../page"
import {
  VARIANCE_THRESHOLD_PCT,
  adjustmentPosting,
  adjustmentStatus,
  canApprove,
  canRequest,
  delta,
  isBinLocked,
  isDirectionLegal,
  isStale,
  needsApproval,
  postAdjustment,
  seedBins,
  variancePct,
  type AdjustmentRequest,
  type Bin,
} from "../data"

const bin = (over: Partial<Bin> = {}): Bin => ({
  id: "b",
  code: "CEN-A1",
  warehouse: "WH-CEN",
  row: 0,
  col: 0,
  capacity: 200,
  sku: "SKU-1001",
  qty: 100,
  status: "active",
  ...over,
})

const req = (over: Partial<AdjustmentRequest> = {}): AdjustmentRequest => ({
  id: "r",
  binId: "b",
  countedQty: 90,
  reason: "cycle-count",
  note: "counted short",
  requestedBy: "Mara",
  approvedBy: null,
  rejected: false,
  ...over,
})

describe("variance", () => {
  it("derives a signed delta against the bin's live qty", () => {
    expect(delta(req({ countedQty: 90 }), bin({ qty: 100 }))).toBe(-10)
    expect(delta(req({ countedQty: 120 }), bin({ qty: 100 }))).toBe(20)
  })

  it("scales the threshold to the bin's size", () => {
    // 10 units off a 100-unit bin is exactly at the threshold, so it posts.
    expect(needsApproval(req({ countedQty: 90 }), bin({ qty: 100 }))).toBe(
      false
    )
    // The same 10 units off a 50-unit bin is 20% — over.
    expect(needsApproval(req({ countedQty: 40 }), bin({ qty: 50 }))).toBe(true)
  })

  it("treats any nonzero count against an empty bin as infinite variance", () => {
    expect(variancePct(req({ countedQty: 25 }), bin({ qty: 0 }))).toBe(Infinity)
    expect(needsApproval(req({ countedQty: 25 }), bin({ qty: 0 }))).toBe(true)
    // A zero count on an empty bin is no variance at all, not a divide-by-zero.
    expect(variancePct(req({ countedQty: 0 }), bin({ qty: 0 }))).toBe(0)
  })
})

describe("reason codes constrain direction", () => {
  it("lets cycle-count and receipt-error move either way", () => {
    expect(isDirectionLegal("cycle-count", 20)).toBe(true)
    expect(isDirectionLegal("cycle-count", -20)).toBe(true)
    expect(isDirectionLegal("receipt-error", 20)).toBe(true)
  })

  it("forbids damage and shrinkage from increasing a count", () => {
    expect(isDirectionLegal("damage", -20)).toBe(true)
    expect(isDirectionLegal("damage", 20)).toBe(false)
    expect(isDirectionLegal("shrinkage", 20)).toBe(false)
    // A zero delta is not an increase.
    expect(isDirectionLegal("shrinkage", 0)).toBe(true)
  })
})

describe("canRequest", () => {
  const draft = {
    binId: "b",
    countedQty: 90,
    reason: "damage" as const,
    note: "n",
  }

  it("accepts a legal decrease with a note", () => {
    expect(canRequest(draft, bin({ qty: 100 }))).toBe(true)
  })

  it("rejects an increase against a decrease-only reason", () => {
    expect(canRequest({ ...draft, countedQty: 110 }, bin({ qty: 100 }))).toBe(
      false
    )
  })

  it("rejects a negative count — an absolute count can't take a bin below zero", () => {
    expect(canRequest({ ...draft, countedQty: -1 }, bin({ qty: 100 }))).toBe(
      false
    )
  })

  it("rejects a blank note", () => {
    expect(canRequest({ ...draft, note: "   " }, bin({ qty: 100 }))).toBe(false)
  })

  it("rejects a locked bin", () => {
    // Bin 9 is mid-pick in the BIN_LOCKS contract.
    expect(isBinLocked("9")).toBe(true)
    expect(
      canRequest({ ...draft, binId: "9" }, bin({ id: "9", qty: 100 }))
    ).toBe(false)
  })
})

describe("canApprove", () => {
  it("approves a pending request on an unlocked bin", () => {
    expect(canApprove(req(), bin())).toBe(true)
  })

  it("refuses a request that isn't pending", () => {
    expect(canApprove(req({ approvedBy: "Dana" }), bin())).toBe(false)
    expect(canApprove(req({ rejected: true }), bin())).toBe(false)
  })

  it("refuses while the bin is locked mid-pick", () => {
    expect(canApprove(req({ binId: "9" }), bin({ id: "9" }))).toBe(false)
  })

  it("goes stale when the bin moves under a decrease-only request", () => {
    // Counted 140 against a bin recording 180 — a legal 40-unit damage loss.
    const damage = req({ countedQty: 140, reason: "damage" })
    expect(canApprove(damage, bin({ qty: 180 }))).toBe(true)
    expect(isStale(damage, bin({ qty: 180 }))).toBe(false)

    // A pick draws the bin to 130. The same request now implies a +10 increase,
    // which `damage` forbids — it can't post, and it isn't auto-rejected.
    expect(canApprove(damage, bin({ qty: 130 }))).toBe(false)
    expect(isStale(damage, bin({ qty: 130 }))).toBe(true)
    expect(adjustmentStatus(damage)).toBe("pending")
  })

  it("doesn't call a posted or rejected request stale", () => {
    const posted = req({
      countedQty: 140,
      reason: "damage",
      approvedBy: "Dana",
    })
    expect(isStale(posted, bin({ qty: 130 }))).toBe(false)
  })
})

describe("posting", () => {
  it("sets the bin to the counted quantity", () => {
    expect(postAdjustment(req({ countedQty: 90 }), bin({ qty: 100 })).qty).toBe(
      90
    )
  })

  it("frees the bin's SKU slot when the count is zero", () => {
    const cleared = postAdjustment(req({ countedQty: 0 }), bin({ qty: 100 }))
    expect(cleared.qty).toBe(0)
    expect(cleared.sku).toBeNull()
  })

  it("emits the stock-levels-facing posting record", () => {
    expect(
      adjustmentPosting(req({ countedQty: 90 }), bin({ qty: 100 }))
    ).toEqual({
      sku: "SKU-1001",
      warehouse: "WH-CEN",
      delta: -10,
    })
  })
})

describe("<InventoryAdjustments />", () => {
  it("renders the fixture requests with derived status badges", () => {
    render(<InventoryAdjustments />)
    expect(screen.getByText("Inventory Adjustments")).toBeInTheDocument()
    // Bin 1's 40-unit damage loss is 22% — pending, needs approval.
    const row = screen.getByRole("row", { name: /CEN-A1/ })
    expect(within(row).getByText("pending")).toBeInTheDocument()
    expect(within(row).getByText("needs approval")).toBeInTheDocument()
  })

  it("flags the locked bin's request and blocks approving it", async () => {
    const user = userEvent.setup()
    render(<InventoryAdjustments />)

    await user.click(
      screen.getByRole("button", { name: "Open adjustment for NW-A1" })
    )
    expect(screen.getByText("Bin locked")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Approve/ })).toBeDisabled()
  })

  it("posts an approved adjustment to the bin", async () => {
    const user = userEvent.setup()
    render(<InventoryAdjustments />)

    await user.click(
      screen.getByRole("button", { name: "Open adjustment for CEN-A1" })
    )
    await user.click(screen.getByRole("button", { name: /Approve/ }))

    // The bin's recorded qty moves to the counted 140, so both cells now read
    // 140 and the variance collapses to zero — that's what posting means.
    const row = screen.getByRole("row", { name: /CEN-A1/ })
    expect(within(row).getByText("posted")).toBeInTheDocument()
    expect(within(row).getAllByText("140")).toHaveLength(2)
    expect(within(row).getByText("0")).toBeInTheDocument()
  })

  it("rejects a request without posting it", async () => {
    const user = userEvent.setup()
    render(<InventoryAdjustments />)

    await user.click(
      screen.getByRole("button", { name: "Open adjustment for CEN-A1" })
    )
    await user.click(screen.getByRole("button", { name: "Reject" }))

    const row = screen.getByRole("row", { name: /CEN-A1/ })
    expect(within(row).getByText("rejected")).toBeInTheDocument()
    // Bin still records the original 180.
    expect(within(row).getByText("180")).toBeInTheDocument()
  })

  it("seedBins hands out a fresh copy each call", () => {
    const a = seedBins()
    const b = seedBins()
    a[0].qty = 999
    expect(b[0].qty).not.toBe(999)
  })

  it("keeps the threshold const in sync with the docs", () => {
    expect(VARIANCE_THRESHOLD_PCT).toBe(10)
  })
})
