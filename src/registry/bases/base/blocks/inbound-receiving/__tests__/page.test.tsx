import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { InboundReceiving } from "../page"
import {
  RECEIPTS,
  availableQty,
  canPutAway,
  canReceive,
  receiptStatus,
  variance,
  type Bin,
  type ReceiptLine,
} from "../data"

const line = (over: Partial<ReceiptLine> = {}): ReceiptLine => ({
  id: "x",
  sku: "SKU-1002",
  expectedQty: 100,
  receivedQty: 0,
  qc: "pending",
  putAwayQty: 0,
  binId: null,
  ...over,
})

const bin = (over: Partial<Bin> = {}): Bin => ({
  id: "b",
  code: "B",
  warehouse: "WH-CEN",
  row: 0,
  col: 0,
  capacity: 200,
  sku: null,
  qty: 0,
  status: "active",
  ...over,
})

describe("canReceive", () => {
  it("only allows receiving against an open PO", () => {
    expect(canReceive("PO-5001")).toBe(true)
    expect(canReceive("PO-5003")).toBe(false) // closed
    expect(canReceive("PO-5004")).toBe(false) // cancelled
  })
})

describe("variance", () => {
  it("is received minus expected", () => {
    expect(variance(line({ expectedQty: 100, receivedQty: 90 }))).toBe(-10)
    expect(variance(line({ expectedQty: 100, receivedQty: 110 }))).toBe(10)
  })
})

describe("receiptStatus", () => {
  it("is expected before anything arrives", () => {
    expect(receiptStatus([line({ receivedQty: 0 })])).toBe("expected")
  })

  it("is partial while any line is short", () => {
    expect(
      receiptStatus([
        line({ expectedQty: 100, receivedQty: 100 }),
        line({ expectedQty: 50, receivedQty: 20 }),
      ])
    ).toBe("partial")
  })

  it("is received once every line is full but stock isn't put away", () => {
    expect(receiptStatus([line({ expectedQty: 100, receivedQty: 100 })])).toBe(
      "received"
    )
  })

  it("is put-away only when every received unit is in a bin", () => {
    expect(
      receiptStatus([
        line({ expectedQty: 100, receivedQty: 100, qc: "passed", putAwayQty: 100 }),
      ])
    ).toBe("put-away")
  })
})

describe("availableQty", () => {
  it("counts only QC-passed, put-away units", () => {
    expect(availableQty(line({ qc: "passed", putAwayQty: 40 }))).toBe(40)
    expect(availableQty(line({ qc: "pending", putAwayQty: 40 }))).toBe(0)
    expect(availableQty(line({ qc: "failed", putAwayQty: 40 }))).toBe(0)
  })
})

describe("canPutAway", () => {
  const passed = line({ sku: "SKU-1002", receivedQty: 100, qc: "passed" })

  it("needs a QC pass", () => {
    expect(canPutAway(line({ ...passed, qc: "pending" }), bin())).toBe(false)
    expect(canPutAway(line({ ...passed, qc: "failed" }), bin())).toBe(false)
  })

  it("rejects a bin that can't take the remaining units", () => {
    expect(canPutAway(passed, bin({ capacity: 50 }))).toBe(false) // over capacity
    expect(canPutAway(passed, bin({ sku: "SKU-9999", qty: 10 }))).toBe(false) // wrong SKU
    expect(canPutAway(passed, bin({ status: "blocked" }))).toBe(false)
  })

  it("accepts a bin with room for the same SKU", () => {
    expect(canPutAway(passed, bin())).toBe(true)
    expect(canPutAway(passed, bin({ sku: "SKU-1002", qty: 50 }))).toBe(true)
  })

  it("rejects a line already fully put away", () => {
    expect(canPutAway(line({ ...passed, putAwayQty: 100 }), bin())).toBe(false)
  })
})

describe("InboundReceiving", () => {
  it("summarises how many receipts still await put-away", () => {
    render(<InboundReceiving />)
    // 3 receipts, receipt 3 is already put away.
    expect(
      screen.getByText("3 receipts · 2 awaiting put-away")
    ).toBeInTheDocument()
  })

  it("blocks receiving against a closed PO", async () => {
    const user = userEvent.setup()
    render(<InboundReceiving />)

    await user.click(screen.getByRole("button", { name: "Open receipt PO-5003" }))

    expect(
      await screen.findByText(/is closed — no more stock can be received/)
    ).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Record" })).not.toBeInTheDocument()
  })

  it("receives, QC-passes, and puts away a receipt through to put-away", async () => {
    const user = userEvent.setup()
    render(<InboundReceiving />)

    // Only receipt 3 starts put away.
    expect(screen.getAllByText("put away")).toHaveLength(1)

    await user.click(screen.getByRole("button", { name: "Open receipt PO-5001" }))

    // Line 1a: record (defaults to expected qty), pass QC, put away.
    await user.click(screen.getAllByRole("button", { name: "Record" })[0])
    await user.click(screen.getByRole("button", { name: "Pass QC" }))
    await user.click(screen.getByLabelText("Bin for SKU-1002"))
    await user.click(await screen.findByRole("option", { name: "CEN-A2" }))
    await user.click(screen.getByRole("button", { name: "Put away" }))

    // Line 1b: same.
    await user.click(screen.getAllByRole("button", { name: "Record" })[1])
    await user.click(screen.getByRole("button", { name: "Pass QC" }))
    await user.click(screen.getByLabelText("Bin for SKU-1006"))
    await user.click(await screen.findByRole("option", { name: "CEN-A3" }))
    await user.click(screen.getByRole("button", { name: "Put away" }))

    // Receipt 1 now joins receipt 3 as put away.
    expect(screen.getAllByText("put away")).toHaveLength(2)
  })

  it("keeps the fixtures free of stored status", () => {
    // Status is derived, never stored — the fixture shape has no status field.
    expect(RECEIPTS[0]).not.toHaveProperty("status")
  })
})
