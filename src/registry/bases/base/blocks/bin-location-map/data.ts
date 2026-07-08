// ── Types ──────────────────────────────────────────────────────────────────

export type BinStatus = "active" | "blocked" | "quarantine"

export interface Bin {
  id: string
  code: string
  warehouse: string
  row: number
  col: number
  capacity: number
  /** `null` means the bin is empty. */
  sku: string | null
  qty: number
  status: BinStatus
}

export type BinDraft = Pick<
  Bin,
  "code" | "warehouse" | "row" | "col" | "capacity" | "status"
>

export interface Assignment {
  sku: string
  qty: number
}

// ── Constants ──────────────────────────────────────────────────────────────

export const WAREHOUSES = ["WH-CEN", "WH-NW", "WH-W"]

export const SKUS = [
  "SKU-1001",
  "SKU-1002",
  "SKU-1003",
  "SKU-1004",
  "SKU-1005",
  "SKU-1006",
]

export const BIN_STATUSES: BinStatus[] = ["active", "blocked", "quarantine"]

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (warehouse: string): BinDraft => ({
  code: "",
  warehouse,
  row: 0,
  col: 0,
  capacity: 100,
  status: "active",
})

export const isDraftValid = (d: BinDraft): boolean =>
  d.code.trim() !== "" && d.capacity > 0 && d.row >= 0 && d.col >= 0

/** No two bins in the same warehouse can share a grid position. */
export const isPositionTaken = (
  bins: Bin[],
  draft: BinDraft,
  excludingId?: string
): boolean =>
  bins.some(
    (b) =>
      b.id !== excludingId &&
      b.warehouse === draft.warehouse &&
      b.row === draft.row &&
      b.col === draft.col
  )

export const remainingCapacity = (b: Bin): number => b.capacity - b.qty

export const isOccupied = (b: Bin): boolean => b.sku !== null && b.qty > 0

/** Fill ratio 0–100, drives the grid cell's fill color. */
export const fillPct = (b: Bin): number =>
  b.capacity <= 0 ? 0 : Math.min(100, Math.round((b.qty / b.capacity) * 100))

/**
 * The core rule: a bin only accepts an assignment when it's active, and
 * either empty or already holding the same SKU with room for more — a
 * blocked/quarantine bin rejects it outright, and mixing a second SKU into
 * an occupied bin or exceeding capacity both reject it too.
 */
export function canAssign(bin: Bin, assignment: Assignment): boolean {
  if (bin.status !== "active") return false
  if (bin.sku !== null && bin.sku !== assignment.sku) return false
  if (assignment.qty <= 0) return false
  return bin.qty + assignment.qty <= bin.capacity
}

export const assign = (bin: Bin, assignment: Assignment): Bin => ({
  ...bin,
  sku: assignment.sku,
  qty: bin.qty + assignment.qty,
})

/** Frees the bin back up for a different SKU. */
export const clearBin = (bin: Bin): Bin => ({ ...bin, sku: null, qty: 0 })

// ── Mock data ──────────────────────────────────────────────────────────────

export const BINS: Bin[] = [
  // WH-CEN — 2 rows x 4 cols
  { id: "1", code: "CEN-A1", warehouse: "WH-CEN", row: 0, col: 0, capacity: 200, sku: "SKU-1001", qty: 180, status: "active" },
  { id: "2", code: "CEN-A2", warehouse: "WH-CEN", row: 0, col: 1, capacity: 200, sku: "SKU-1002", qty: 40, status: "active" },
  { id: "3", code: "CEN-A3", warehouse: "WH-CEN", row: 0, col: 2, capacity: 150, sku: null, qty: 0, status: "active" },
  { id: "4", code: "CEN-A4", warehouse: "WH-CEN", row: 0, col: 3, capacity: 150, sku: "SKU-1004", qty: 150, status: "active" },
  { id: "5", code: "CEN-B1", warehouse: "WH-CEN", row: 1, col: 0, capacity: 100, sku: null, qty: 0, status: "blocked" },
  { id: "6", code: "CEN-B2", warehouse: "WH-CEN", row: 1, col: 1, capacity: 200, sku: "SKU-1001", qty: 60, status: "active" },
  { id: "7", code: "CEN-B3", warehouse: "WH-CEN", row: 1, col: 2, capacity: 120, sku: "SKU-1006", qty: 30, status: "quarantine" },
  { id: "8", code: "CEN-B4", warehouse: "WH-CEN", row: 1, col: 3, capacity: 150, sku: null, qty: 0, status: "active" },
  // WH-NW — 2 rows x 3 cols
  { id: "9", code: "NW-A1", warehouse: "WH-NW", row: 0, col: 0, capacity: 180, sku: "SKU-1004", qty: 120, status: "active" },
  { id: "10", code: "NW-A2", warehouse: "WH-NW", row: 0, col: 1, capacity: 180, sku: null, qty: 0, status: "active" },
  { id: "11", code: "NW-A3", warehouse: "WH-NW", row: 0, col: 2, capacity: 100, sku: "SKU-1005", qty: 100, status: "active" },
  { id: "12", code: "NW-B1", warehouse: "WH-NW", row: 1, col: 0, capacity: 150, sku: null, qty: 0, status: "quarantine" },
  { id: "13", code: "NW-B2", warehouse: "WH-NW", row: 1, col: 1, capacity: 150, sku: "SKU-1002", qty: 45, status: "active" },
  { id: "14", code: "NW-B3", warehouse: "WH-NW", row: 1, col: 2, capacity: 100, sku: null, qty: 0, status: "active" },
  // WH-W — 2 rows x 4 cols
  { id: "15", code: "W-A1", warehouse: "WH-W", row: 0, col: 0, capacity: 250, sku: "SKU-1006", qty: 200, status: "active" },
  { id: "16", code: "W-A2", warehouse: "WH-W", row: 0, col: 1, capacity: 200, sku: "SKU-1001", qty: 90, status: "active" },
  { id: "17", code: "W-A3", warehouse: "WH-W", row: 0, col: 2, capacity: 150, sku: null, qty: 0, status: "blocked" },
  { id: "18", code: "W-A4", warehouse: "WH-W", row: 0, col: 3, capacity: 150, sku: "SKU-1003", qty: 20, status: "active" },
  { id: "19", code: "W-B1", warehouse: "WH-W", row: 1, col: 0, capacity: 120, sku: null, qty: 0, status: "active" },
  { id: "20", code: "W-B2", warehouse: "WH-W", row: 1, col: 1, capacity: 120, sku: "SKU-1002", qty: 100, status: "active" },
]
