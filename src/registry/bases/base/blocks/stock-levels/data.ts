// ── Types ──────────────────────────────────────────────────────────────────

export type StockStatus = "in-stock" | "low" | "out-of-stock"

export interface StockLevel {
  id: string
  sku: string
  product: string
  warehouse: string
  onHand: number
  reorderPoint: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Derived from `onHand` vs `reorderPoint` — never stored, so it can't drift. */
export const stockStatus = (s: StockLevel): StockStatus =>
  s.onHand <= 0 ? "out-of-stock" : s.onHand <= s.reorderPoint ? "low" : "in-stock"

export const needsReorder = (s: StockLevel): boolean =>
  stockStatus(s) !== "in-stock"

export const matchesQuery = (s: StockLevel, query: string): boolean => {
  const q = query.trim().toLowerCase()
  if (q === "") return true
  return (
    s.sku.toLowerCase().includes(q) ||
    s.product.toLowerCase().includes(q) ||
    s.warehouse.toLowerCase().includes(q)
  )
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const STOCK_LEVELS: StockLevel[] = [
  { id: "1", sku: "SKU-1001", product: "Aluminium Water Bottle 750ml", warehouse: "WH-CEN", onHand: 1240, reorderPoint: 300 },
  { id: "2", sku: "SKU-1001", product: "Aluminium Water Bottle 750ml", warehouse: "WH-W", onHand: 180, reorderPoint: 250 },
  { id: "3", sku: "SKU-1002", product: "Canvas Tote Bag", warehouse: "WH-CEN", onHand: 0, reorderPoint: 150 },
  { id: "4", sku: "SKU-1004", product: "Recycled Notebook A5", warehouse: "WH-NW", onHand: 620, reorderPoint: 200 },
  { id: "5", sku: "SKU-1004", product: "Recycled Notebook A5", warehouse: "WH-SE", onHand: 95, reorderPoint: 100 },
  { id: "6", sku: "SKU-1006", product: "Insulated Lunch Box", warehouse: "WH-W", onHand: 430, reorderPoint: 120 },
]
