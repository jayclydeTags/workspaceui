// ── Types ──────────────────────────────────────────────────────────────────

export type MovementType = "receipt" | "shipment" | "adjustment" | "transfer"

export interface Movement {
  id: string
  date: string // ISO date
  sku: string
  warehouse: string
  type: MovementType
  /** Signed: positive adds stock, negative removes it. */
  quantity: number
  reference: string
}

export type MovementDraft = Omit<Movement, "id">

export const MOVEMENT_TYPES: MovementType[] = [
  "receipt",
  "shipment",
  "adjustment",
  "transfer",
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): MovementDraft => ({
  date: new Date().toISOString().slice(0, 10),
  sku: "",
  warehouse: "",
  type: "receipt",
  quantity: 0,
  reference: "",
})

// Quantity may be negative (a shipment) but never zero — a no-op movement is
// never a legitimate ledger entry.
export const isValid = (d: MovementDraft): boolean =>
  d.sku.trim() !== "" && d.warehouse.trim() !== "" && d.quantity !== 0

export const netChange = (movements: Movement[]): number =>
  movements.reduce((sum, m) => sum + m.quantity, 0)

export const formatQuantity = (quantity: number): string =>
  `${quantity > 0 ? "+" : ""}${quantity.toLocaleString()}`

// ── Mock data ──────────────────────────────────────────────────────────────

export const MOVEMENTS: Movement[] = [
  { id: "1", date: "2026-07-06", sku: "SKU-1001", warehouse: "WH-CEN", type: "receipt", quantity: 500, reference: "PO-8841" },
  { id: "2", date: "2026-07-05", sku: "SKU-1002", warehouse: "WH-CEN", type: "shipment", quantity: -150, reference: "SO-2290" },
  { id: "3", date: "2026-07-04", sku: "SKU-1004", warehouse: "WH-SE", type: "adjustment", quantity: -5, reference: "Cycle count" },
  { id: "4", date: "2026-07-03", sku: "SKU-1001", warehouse: "WH-W", type: "transfer", quantity: -220, reference: "TR-114 → WH-CEN" },
  { id: "5", date: "2026-07-03", sku: "SKU-1006", warehouse: "WH-W", type: "receipt", quantity: 300, reference: "PO-8836" },
  { id: "6", date: "2026-07-01", sku: "SKU-1004", warehouse: "WH-NW", type: "shipment", quantity: -80, reference: "SO-2281" },
]
