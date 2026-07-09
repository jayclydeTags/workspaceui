import {
  BINS,
  canAssign,
  type Bin,
} from "@/registry/bases/base/blocks/bin-location-map/data"

// Re-exported so this block's own modules import the bin type from one place.
export type { Bin }

// ── Types ──────────────────────────────────────────────────────────────────

export type ReceiptStatus = "expected" | "partial" | "received" | "put-away"

/** A received line is unavailable until it passes a quality check. */
export type QcVerdict = "pending" | "passed" | "failed"

export interface ReceiptLine {
  id: string
  sku: string
  /** Quantity the purchase order says to expect. */
  expectedQty: number
  /** Quantity physically checked in so far. */
  receivedQty: number
  qc: QcVerdict
  /** Quantity moved into a bin. Never exceeds `receivedQty`. */
  putAwayQty: number
  /** Bin the stock was put away into, or `null` before put-away. */
  binId: string | null
}

export interface Receipt {
  id: string
  /** Purchase order this delivery is booked against. */
  po: string
  vendor: string
  warehouse: string
  lines: ReceiptLine[]
}

// ── PO status contract ──────────────────────────────────────────────────────

/** Stock can only be received against an `"open"` purchase order. */
export const PO_STATUS: Record<string, "open" | "closed" | "cancelled"> = {
  "PO-5001": "open",
  "PO-5002": "open",
  "PO-5003": "closed",
  "PO-5004": "cancelled",
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** A receipt can only take stock while its PO is still open. */
export const canReceive = (po: string): boolean => PO_STATUS[po] === "open"

/** Received minus expected — negative is a short shipment, positive an over. */
export const variance = (line: ReceiptLine): number =>
  line.receivedQty - line.expectedQty

/** Received units not yet put away. */
export const remainingToPutAway = (line: ReceiptLine): number =>
  line.receivedQty - line.putAwayQty

/**
 * The QC availability gate: only quality-checked, put-away stock counts as
 * available — unchecked or failed goods contribute nothing.
 */
export const availableQty = (line: ReceiptLine): number =>
  line.qc === "passed" ? line.putAwayQty : 0

const sum = (lines: ReceiptLine[], f: (l: ReceiptLine) => number): number =>
  lines.reduce((n, l) => n + f(l), 0)

/**
 * Status is derived from the lines, never stored — so the list can't show
 * "received" while a line is still short, mirroring how repayment-schedule
 * derives its instalment states.
 */
export function receiptStatus(lines: ReceiptLine[]): ReceiptStatus {
  const received = sum(lines, (l) => l.receivedQty)
  if (received === 0) return "expected"
  const anyShort = lines.some((l) => l.receivedQty < l.expectedQty)
  if (anyShort) return "partial"
  // Fully received: it's only "put away" once every received unit is in a bin.
  // A QC-failed line can't be put away, so it holds the receipt at "received".
  const putAway = sum(lines, (l) => l.putAwayQty)
  return putAway === received ? "put-away" : "received"
}

/**
 * The core put-away rule: the line must have passed QC, still have units
 * waiting, and the bin must accept them — capacity and single-SKU occupancy
 * are delegated to the bin/location-map contract, not reimplemented here.
 */
export function canPutAway(line: ReceiptLine, bin: Bin): boolean {
  if (line.qc !== "passed") return false
  const qty = remainingToPutAway(line)
  if (qty <= 0) return false
  return canAssign(bin, { sku: line.sku, qty })
}

/** Bins in a warehouse that would accept the line's remaining units. */
export const eligibleBins = (
  line: ReceiptLine,
  bins: Bin[],
  warehouse: string
): Bin[] =>
  bins.filter((b) => b.warehouse === warehouse && canPutAway(line, b))

// ── Mock data ──────────────────────────────────────────────────────────────

// SKUs, warehouses, and bin ids line up with bin-location-map's BINS so
// put-away lands in real bins in the demo.
export const RECEIPTS: Receipt[] = [
  {
    id: "1",
    po: "PO-5001",
    vendor: "Acme Supply Co.",
    warehouse: "WH-CEN",
    lines: [
      { id: "1a", sku: "SKU-1002", expectedQty: 120, receivedQty: 0, qc: "pending", putAwayQty: 0, binId: null },
      { id: "1b", sku: "SKU-1006", expectedQty: 60, receivedQty: 0, qc: "pending", putAwayQty: 0, binId: null },
    ],
  },
  {
    id: "2",
    po: "PO-5002",
    vendor: "Northwind Traders",
    warehouse: "WH-NW",
    lines: [
      { id: "2a", sku: "SKU-1004", expectedQty: 50, receivedQty: 50, qc: "passed", putAwayQty: 0, binId: null },
      { id: "2b", sku: "SKU-1002", expectedQty: 80, receivedQty: 30, qc: "pending", putAwayQty: 0, binId: null },
    ],
  },
  {
    id: "3",
    po: "PO-5003",
    vendor: "Bluepeak Logistics",
    warehouse: "WH-W",
    lines: [
      { id: "3a", sku: "SKU-1003", expectedQty: 40, receivedQty: 40, qc: "passed", putAwayQty: 40, binId: "18" },
    ],
  },
]

/** Fresh copy of the bin fixtures so put-away can mutate occupancy locally. */
export const seedBins = (): Bin[] => BINS.map((b) => ({ ...b }))
