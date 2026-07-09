import {
  BINS,
  type Bin,
} from "@/registry/bases/base/blocks/bin-location-map/data"

// Re-exported so this block's own modules import the bin type from one place.
export type { Bin }

// ── Types ──────────────────────────────────────────────────────────────────

export type PickStatus = "pending" | "picking" | "picked" | "completed"

/** One draw from a specific bin. `pickedQty` on a line is the sum of these. */
export interface Allocation {
  binId: string
  qty: number
}

export interface PickLine {
  id: string
  sku: string
  /** Units the outbound order wants picked. */
  requestedQty: number
  /** Bins this line has drawn from so far. */
  allocations: Allocation[]
  /** A short-picked line is closed at whatever was picked, shortfall and all. */
  short: boolean
}

export interface PickList {
  id: string
  /** Outbound/sales order this pick fulfils. Modelled elsewhere; only the id crosses. */
  orderId: string
  warehouse: string
  /** Picker who claimed the list, or `null` while unclaimed. */
  picker: string | null
  /**
   * Set when the picker completes the list — the one piece of non-derived
   * status, since completion is an explicit action, not a line-derived state.
   */
  completed: boolean
  lines: PickLine[]
}

// ── Order status contract ────────────────────────────────────────────────────

/** A pick list can only be worked while its outbound order is still open. */
export const ORDER_STATUS: Record<string, "open" | "closed" | "cancelled"> = {
  "SO-7001": "open",
  "SO-7002": "open",
  "SO-7003": "closed",
  "SO-7004": "cancelled",
}

/** The pick-completion record Shipments consumes — pickId + per-SKU picked qty. */
export interface PickCompletion {
  pickId: string
  orderId: string
  lines: { sku: string; requestedQty: number; pickedQty: number }[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Units picked on a line so far — the sum of its allocations. */
export const pickedQty = (line: PickLine): number =>
  line.allocations.reduce((n, a) => n + a.qty, 0)

/** Units still to pick before the line is full. */
export const remainingToPick = (line: PickLine): number =>
  Math.max(0, line.requestedQty - pickedQty(line))

/** Requested minus picked — a positive shortfall on a short-picked line. */
export const shortfall = (line: PickLine): number =>
  line.requestedQty - pickedQty(line)

/**
 * A line is closed once it's fully picked or explicitly short-picked — the
 * completion gate needs every line closed, not every line full.
 */
export const isLineClosed = (line: PickLine): boolean =>
  line.short || remainingToPick(line) === 0

/** A pick list can only be worked while its order is open. */
export const canPick = (list: PickList): boolean =>
  ORDER_STATUS[list.orderId] === "open"

/**
 * Status is derived from the lines, never stored — mirroring inbound/receiving.
 * `completed` is set explicitly on completion and preserved when present.
 */
export function pickStatus(list: PickList): PickStatus {
  if (list.completed) return "completed"
  const picked = list.lines.reduce((n, l) => n + pickedQty(l), 0)
  if (picked === 0 && !list.lines.some((l) => l.short)) return "pending"
  return list.lines.every(isLineClosed) ? "picked" : "picking"
}

/** Completion needs an assigned picker and every line closed (full or short). */
export const canCompletePick = (list: PickList): boolean =>
  list.picker !== null &&
  !list.completed &&
  list.lines.every(isLineClosed)

/**
 * The draw-down rule, the inverse of the bin block's `canAssign`: a bin can
 * source units only when it's active, actually holds the SKU, and has that
 * many on hand. Capacity/occupancy on the assign side stays in the bin block.
 */
export function canPickFromBin(bin: Bin, sku: string, qty: number): boolean {
  if (bin.status !== "active") return false
  if (bin.sku !== sku) return false
  if (qty <= 0) return false
  return bin.qty >= qty
}

/** Draws `qty` out of a bin, emptying its SKU slot when it hits zero. */
export function pickFromBin(bin: Bin, qty: number): Bin {
  const left = bin.qty - qty
  return left <= 0 ? { ...bin, sku: null, qty: 0 } : { ...bin, qty: left }
}

/** Bins in a warehouse that hold on-hand stock of the line's SKU. */
export const binsWithStock = (
  line: PickLine,
  bins: Bin[],
  warehouse: string
): Bin[] =>
  bins.filter(
    (b) =>
      b.warehouse === warehouse &&
      canPickFromBin(b, line.sku, 1) &&
      remainingToPick(line) > 0
  )

/** Builds the Shipments-facing record. Only valid once `canCompletePick`. */
export const pickCompletion = (list: PickList): PickCompletion => ({
  pickId: list.id,
  orderId: list.orderId,
  lines: list.lines.map((l) => ({
    sku: l.sku,
    requestedQty: l.requestedQty,
    pickedQty: pickedQty(l),
  })),
})

// ── Mock data ──────────────────────────────────────────────────────────────

// SKUs, warehouses, and bin ids line up with bin-location-map's BINS so picks
// draw from real bins in the demo.
export const PICK_LISTS: PickList[] = [
  {
    id: "1",
    orderId: "SO-7001",
    warehouse: "WH-CEN",
    picker: null,
    completed: false,
    lines: [
      { id: "1a", sku: "SKU-1001", requestedQty: 200, allocations: [], short: false },
      { id: "1b", sku: "SKU-1004", requestedQty: 100, allocations: [], short: false },
    ],
  },
  {
    id: "2",
    orderId: "SO-7002",
    warehouse: "WH-NW",
    picker: "Dana Cruz",
    completed: false,
    lines: [
      { id: "2a", sku: "SKU-1004", requestedQty: 80, allocations: [{ binId: "9", qty: 80 }], short: false },
      { id: "2b", sku: "SKU-1005", requestedQty: 60, allocations: [], short: false },
    ],
  },
  {
    id: "3",
    orderId: "SO-7003",
    warehouse: "WH-W",
    picker: "Rey Santos",
    completed: true,
    lines: [
      { id: "3a", sku: "SKU-1006", requestedQty: 150, allocations: [{ binId: "15", qty: 150 }], short: false },
    ],
  },
]

/** Fresh copy of the bin fixtures so picking can mutate occupancy locally. */
export const seedBins = (): Bin[] => BINS.map((b) => ({ ...b }))
