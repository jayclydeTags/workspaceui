import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Shipments } from "../page"
import {
  canCancel,
  canDeliver,
  canFlagException,
  canMarkShipped,
  canShip,
  isPartiallyPicked,
  seedShipments,
  shipmentStatus,
  totalShortfall,
  type PickCompletion,
  type Shipment,
} from "../data"

const full: PickCompletion = {
  pickId: "p",
  orderId: "SO-1",
  lines: [{ sku: "SKU-1", requestedQty: 10, pickedQty: 10 }],
}

const short: PickCompletion = {
  pickId: "p",
  orderId: "SO-1",
  lines: [
    { sku: "SKU-1", requestedQty: 10, pickedQty: 10 },
    { sku: "SKU-2", requestedQty: 10, pickedQty: 4 },
  ],
}

const ship = (over: Partial<Shipment> = {}): Shipment => ({
  id: "s",
  pickId: "p",
  orderId: "SO-1",
  carrier: "DHL",
  trackingNumber: "DHL-1",
  shippedAt: null,
  deliveredAt: null,
  exception: null,
  cancelled: false,
  ...over,
})

describe("shipmentStatus", () => {
  it("reads ready-to-ship until something happens to it", () => {
    expect(shipmentStatus(ship())).toBe("ready-to-ship")
  })

  it("collapses shipped and in-transit into one state", () => {
    expect(shipmentStatus(ship({ shippedAt: "2026-06-01" }))).toBe("shipped")
  })

  it("ranks exception over delivery — damage is reported after the scan", () => {
    const delivered = ship({
      shippedAt: "2026-06-01",
      deliveredAt: "2026-06-03",
    })
    expect(shipmentStatus(delivered)).toBe("delivered")
    expect(shipmentStatus({ ...delivered, exception: "refused" })).toBe(
      "exception"
    )
  })

  it("ranks cancelled over everything", () => {
    expect(shipmentStatus(ship({ cancelled: true, exception: "x" }))).toBe(
      "cancelled"
    )
  })
})

describe("partial picks can't ship", () => {
  it("spots a shortfall on any line", () => {
    expect(isPartiallyPicked(full)).toBe(false)
    expect(isPartiallyPicked(short)).toBe(true)
    expect(totalShortfall(short)).toBe(6)
  })

  it("blocks shipping a short pick even with carrier and tracking set", () => {
    expect(canShip(short)).toBe(false)
    expect(canMarkShipped(ship(), short)).toBe(false)
    // The same shipment against a full pick ships fine.
    expect(canMarkShipped(ship(), full)).toBe(true)
  })

  it("still lets a short-picked shipment be cancelled", () => {
    expect(canCancel(ship())).toBe(true)
  })
})

describe("canMarkShipped", () => {
  it("requires a carrier", () => {
    expect(canMarkShipped(ship({ carrier: null }), full)).toBe(false)
  })

  it("requires a tracking number", () => {
    expect(canMarkShipped(ship({ trackingNumber: null }), full)).toBe(false)
  })

  it("rejects whitespace-only values — blank must not satisfy the gate", () => {
    expect(canMarkShipped(ship({ carrier: "  " }), full)).toBe(false)
    expect(canMarkShipped(ship({ trackingNumber: "  " }), full)).toBe(false)
  })

  it("won't re-ship a shipment already in transit", () => {
    expect(canMarkShipped(ship({ shippedAt: "2026-06-01" }), full)).toBe(false)
  })
})

describe("canCancel", () => {
  it("allows cancelling before the parcel leaves the dock", () => {
    expect(canCancel(ship())).toBe(true)
  })

  it("refuses once it's in transit", () => {
    expect(canCancel(ship({ shippedAt: "2026-06-01" }))).toBe(false)
  })

  it("refuses a delivered, excepted, or already-cancelled shipment", () => {
    const shipped = { shippedAt: "2026-06-01" }
    expect(canCancel(ship({ ...shipped, deliveredAt: "2026-06-03" }))).toBe(
      false
    )
    expect(canCancel(ship({ ...shipped, exception: "lost" }))).toBe(false)
    expect(canCancel(ship({ cancelled: true }))).toBe(false)
  })
})

describe("canDeliver / canFlagException", () => {
  it("only delivers a shipment that's in transit", () => {
    expect(canDeliver(ship())).toBe(false)
    expect(canDeliver(ship({ shippedAt: "2026-06-01" }))).toBe(true)
  })

  it("requires a prior ship before an exception — otherwise it's a cancel", () => {
    expect(canFlagException(ship())).toBe(false)
    expect(canFlagException(ship({ shippedAt: "2026-06-01" }))).toBe(true)
  })

  it("keeps a delivered shipment eligible — damage surfaces after the scan", () => {
    expect(
      canFlagException(
        ship({ shippedAt: "2026-06-01", deliveredAt: "2026-06-03" })
      )
    ).toBe(true)
  })

  it("treats exception and cancellation as terminal", () => {
    const excepted = ship({ shippedAt: "2026-06-01", exception: "lost" })
    expect(canFlagException(excepted)).toBe(false)
    expect(canDeliver(excepted)).toBe(false)
    expect(canCancel(excepted)).toBe(false)

    const cancelled = ship({ cancelled: true })
    expect(canFlagException(cancelled)).toBe(false)
    expect(canDeliver(cancelled)).toBe(false)
  })
})

describe("<Shipments />", () => {
  it("renders the fixture shipments with derived status badges", () => {
    render(<Shipments />)
    expect(screen.getByText("Shipments")).toBeInTheDocument()

    const inTransit = screen.getByRole("row", { name: /SO-7002/ })
    expect(within(inTransit).getByText("shipped")).toBeInTheDocument()

    const refused = screen.getByRole("row", { name: /SO-7006/ })
    expect(within(refused).getByText("exception")).toBeInTheDocument()
  })

  it("flags the short-picked shipment and blocks shipping it", async () => {
    const user = userEvent.setup()
    render(<Shipments />)

    // SO-7001 has carrier and tracking set, and still can't ship.
    await user.click(
      screen.getByRole("button", { name: "Open shipment for SO-7001" })
    )
    expect(screen.getByText("Order was not picked in full")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Mark shipped" })).toBeDisabled()
    // Cancelling it is still the way out.
    expect(
      screen.getByRole("button", { name: "Cancel shipment" })
    ).toBeEnabled()
  })

  it("blocks shipping a full pick until carrier and tracking are filled", async () => {
    const user = userEvent.setup()
    render(<Shipments />)

    await user.click(
      screen.getByRole("button", { name: "Open shipment for SO-7003" })
    )
    const shipButton = screen.getByRole("button", { name: "Mark shipped" })
    expect(shipButton).toBeDisabled()

    await user.click(screen.getByLabelText("Carrier"))
    await user.click(await screen.findByRole("option", { name: "UPS" }))
    expect(shipButton).toBeDisabled()

    await user.type(screen.getByLabelText("Tracking number"), "1Z-000111")
    expect(shipButton).toBeEnabled()

    await user.click(shipButton)
    const row = screen.getByRole("row", { name: /SO-7003/ })
    expect(within(row).getByText("shipped")).toBeInTheDocument()
  })

  it("cancels a shipment that hasn't left the dock", async () => {
    const user = userEvent.setup()
    render(<Shipments />)

    await user.click(
      screen.getByRole("button", { name: "Open shipment for SO-7003" })
    )
    await user.click(screen.getByRole("button", { name: "Cancel shipment" }))

    const row = screen.getByRole("row", { name: /SO-7003/ })
    expect(within(row).getByText("cancelled")).toBeInTheDocument()
  })

  it("offers no cancel on an in-transit shipment, but does offer delivery", async () => {
    const user = userEvent.setup()
    render(<Shipments />)

    await user.click(
      screen.getByRole("button", { name: "Open shipment for SO-7002" })
    )
    expect(
      screen.queryByRole("button", { name: "Cancel shipment" })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Mark delivered" }))
    const row = screen.getByRole("row", { name: /SO-7002/ })
    expect(within(row).getByText("delivered")).toBeInTheDocument()
  })

  it("flags an exception on a delivered shipment, requiring a reason", async () => {
    const user = userEvent.setup()
    render(<Shipments />)

    await user.click(
      screen.getByRole("button", { name: "Open shipment for SO-7005" })
    )
    const flag = screen.getByRole("button", { name: "Flag exception" })
    expect(flag).toBeDisabled()

    await user.type(screen.getByLabelText("Exception reason"), "  ")
    expect(flag).toBeDisabled()

    await user.type(screen.getByLabelText("Exception reason"), "Damaged carton")
    await user.click(flag)

    const row = screen.getByRole("row", { name: /SO-7005/ })
    expect(within(row).getByText("exception")).toBeInTheDocument()
  })

  it("seedShipments hands out a fresh copy each call", () => {
    const a = seedShipments()
    const b = seedShipments()
    a[0].cancelled = true
    expect(b[0].cancelled).toBe(false)
  })
})
