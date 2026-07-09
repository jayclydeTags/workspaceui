import type { PickCompletion } from "@/registry/bases/base/blocks/outbound-picking/data"

// Re-exported so this block's own modules import the contract from one place.
export type { PickCompletion }

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * `shipped` covers what a carrier would call in-transit — the warehouse hands
 * the parcel over once and doesn't hear about it again until it lands.
 */
export type ShipmentStatus =
  "ready-to-ship" | "shipped" | "delivered" | "exception" | "cancelled"

export interface Shipment {
  id: string
  /** The completed pick this shipment ships. One pick, one shipment. */
  pickId: string
  /** Denormalised off the pick so the table can name the order without a join. */
  orderId: string
  /** Both null until someone books the carrier — a shipment exists before that. */
  carrier: string | null
  trackingNumber: string | null
  /** Set when the parcel leaves the dock. The in-transit marker. */
  shippedAt: string | null
  deliveredAt: string | null
  /** What the carrier reported went wrong. Outranks every other state. */
  exception: string | null
  cancelled: boolean
}

// ── Constants ──────────────────────────────────────────────────────────────

export const CARRIERS = ["DHL", "FedEx", "UPS", "LBC Express"]

// ── Helpers ────────────────────────────────────────────────────────────────

/** Units short on a line. Zero when the pick took everything the order wanted. */
export const lineShortfall = (line: PickCompletion["lines"][number]): number =>
  line.requestedQty - line.pickedQty

/**
 * A pick that came up short on any line. Outbound lets a picker close a line
 * short, so this is a real state the contract produces, not a defensive check.
 */
export const isPartiallyPicked = (pick: PickCompletion): boolean =>
  pick.lines.some((l) => lineShortfall(l) > 0)

/** Total units short across the whole pick — what the order won't receive. */
export const totalShortfall = (pick: PickCompletion): number =>
  pick.lines.reduce((n, l) => n + lineShortfall(l), 0)

/**
 * Status is derived, never stored — mirroring the sibling WMS blocks. The order
 * is the precedence: a cancelled shipment never shipped, and an exception
 * outranks delivery because damaged-on-arrival is reported after the scan.
 */
export function shipmentStatus(shipment: Shipment): ShipmentStatus {
  if (shipment.cancelled) return "cancelled"
  if (shipment.exception !== null) return "exception"
  if (shipment.deliveredAt !== null) return "delivered"
  if (shipment.shippedAt !== null) return "shipped"
  return "ready-to-ship"
}

/** Blank-safe presence check — `""` must not satisfy a required field. */
const filled = (value: string | null): boolean =>
  value !== null && value.trim() !== ""

/**
 * You cannot ship an order that wasn't picked in full.
 *
 * ponytail: a short pick is terminally unshippable here. The remedies — a
 * back-order or a re-pick — belong to Outbound, which owns the pick. Add a
 * partial-acceptance path when there's a back-order block to hand the
 * shortfall to.
 */
export const canShip = (pick: PickCompletion): boolean =>
  !isPartiallyPicked(pick)

/** The ship gate: a full pick, a booked carrier, and a tracking number. */
export const canMarkShipped = (
  shipment: Shipment,
  pick: PickCompletion
): boolean =>
  shipmentStatus(shipment) === "ready-to-ship" &&
  canShip(pick) &&
  filled(shipment.carrier) &&
  filled(shipment.trackingNumber)

/** Once it's on the truck it's the carrier's problem — cancel is off the table. */
export const canCancel = (shipment: Shipment): boolean =>
  shipmentStatus(shipment) === "ready-to-ship"

/** Only a shipment in flight can land. */
export const canDeliver = (shipment: Shipment): boolean =>
  shipmentStatus(shipment) === "shipped"

/**
 * An exception needs something to have gone wrong *in transit*, so it requires
 * a prior ship. Delivered shipments stay eligible: refused, damaged, and
 * wrong-address all surface after the carrier marks it delivered.
 *
 * ponytail: exceptions are terminal — no resolve action. Add one when there's
 * a resolution workflow (who clears it, what evidence closes it) to hang it on.
 */
export const canFlagException = (shipment: Shipment): boolean => {
  const status = shipmentStatus(shipment)
  return status === "shipped" || status === "delivered"
}

// ── Mock data ──────────────────────────────────────────────────────────────

/**
 * Pick completions this block ships against. Outbound owns the type; these are
 * local fixtures because `PICK_LISTS` has one completed pick and can't express
 * a delivered, excepted, or cancelled shipment.
 */
export const PICK_COMPLETIONS: PickCompletion[] = [
  {
    pickId: "3",
    orderId: "SO-7003",
    lines: [{ sku: "SKU-1006", requestedQty: 150, pickedQty: 150 }],
  },
  // Short on SKU-1004 by 30 — the pick completed, but the order can't ship.
  {
    pickId: "1",
    orderId: "SO-7001",
    lines: [
      { sku: "SKU-1001", requestedQty: 200, pickedQty: 200 },
      { sku: "SKU-1004", requestedQty: 100, pickedQty: 70 },
    ],
  },
  {
    pickId: "2",
    orderId: "SO-7002",
    lines: [
      { sku: "SKU-1004", requestedQty: 80, pickedQty: 80 },
      { sku: "SKU-1005", requestedQty: 60, pickedQty: 60 },
    ],
  },
  {
    pickId: "4",
    orderId: "SO-7005",
    lines: [{ sku: "SKU-1002", requestedQty: 40, pickedQty: 40 }],
  },
  {
    pickId: "5",
    orderId: "SO-7006",
    lines: [{ sku: "SKU-1003", requestedQty: 25, pickedQty: 25 }],
  },
  {
    pickId: "6",
    orderId: "SO-7007",
    lines: [{ sku: "SKU-1005", requestedQty: 90, pickedQty: 90 }],
  },
]

export const pickFor = (shipment: Shipment): PickCompletion =>
  PICK_COMPLETIONS.find((p) => p.pickId === shipment.pickId)!

export const SHIPMENTS: Shipment[] = [
  // Full pick, no carrier booked — ship is blocked on the missing fields.
  {
    id: "1",
    pickId: "3",
    orderId: "SO-7003",
    carrier: null,
    trackingNumber: null,
    shippedAt: null,
    deliveredAt: null,
    exception: null,
    cancelled: false,
  },
  // Short pick — carrier and tracking are set, and it still can't ship.
  {
    id: "2",
    pickId: "1",
    orderId: "SO-7001",
    carrier: "DHL",
    trackingNumber: "DHL-4471209",
    shippedAt: null,
    deliveredAt: null,
    exception: null,
    cancelled: false,
  },
  // In transit — cancel is closed, deliver and exception are open.
  {
    id: "3",
    pickId: "2",
    orderId: "SO-7002",
    carrier: "FedEx",
    trackingNumber: "FDX-8820174",
    shippedAt: "2026-06-30",
    deliveredAt: null,
    exception: null,
    cancelled: false,
  },
  // Delivered, and still eligible for an exception.
  {
    id: "4",
    pickId: "4",
    orderId: "SO-7005",
    carrier: "UPS",
    trackingNumber: "1Z-99A2B3C4",
    shippedAt: "2026-06-24",
    deliveredAt: "2026-06-27",
    exception: null,
    cancelled: false,
  },
  // Terminal: the consignee refused it at the door.
  {
    id: "5",
    pickId: "5",
    orderId: "SO-7006",
    carrier: "LBC Express",
    trackingNumber: "LBC-7710355",
    shippedAt: "2026-06-21",
    deliveredAt: "2026-06-25",
    exception: "Refused at delivery — consignee rejected two damaged cartons.",
    cancelled: false,
  },
  // Terminal: pulled before it ever reached the dock.
  {
    id: "6",
    pickId: "6",
    orderId: "SO-7007",
    carrier: null,
    trackingNumber: null,
    shippedAt: null,
    deliveredAt: null,
    exception: null,
    cancelled: true,
  },
]

/** Fresh copy of the shipment fixtures so actions can mutate state locally. */
export const seedShipments = (): Shipment[] => SHIPMENTS.map((s) => ({ ...s }))
