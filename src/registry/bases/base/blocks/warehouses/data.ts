// ── Types ──────────────────────────────────────────────────────────────────

export type WarehouseStatus = "active" | "inactive"

export interface Warehouse {
  id: string
  code: string
  name: string
  location: string
  capacity: number
  used: number
  status: WarehouseStatus
}

export type WarehouseDraft = Omit<Warehouse, "id" | "used">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): WarehouseDraft => ({
  code: "",
  name: "",
  location: "",
  capacity: 0,
  status: "active",
})

export const isValid = (d: WarehouseDraft): boolean =>
  d.code.trim() !== "" && d.name.trim() !== "" && d.capacity > 0

/** Percentage of `capacity` currently occupied, clamped to 0–100. */
export const utilization = (w: Warehouse): number =>
  w.capacity <= 0 ? 0 : Math.min(100, Math.round((w.used / w.capacity) * 100))

// ── Mock data ──────────────────────────────────────────────────────────────

export const WAREHOUSES: Warehouse[] = [
  { id: "1", code: "WH-NW", name: "Northwest Distribution", location: "Portland, OR", capacity: 12000, used: 9400, status: "active" },
  { id: "2", code: "WH-CEN", name: "Central Fulfilment", location: "Kansas City, MO", capacity: 20000, used: 7200, status: "active" },
  { id: "3", code: "WH-SE", name: "Southeast Depot", location: "Atlanta, GA", capacity: 8000, used: 7900, status: "active" },
  { id: "4", code: "WH-NE", name: "Northeast Overflow", location: "Newark, NJ", capacity: 5000, used: 0, status: "inactive" },
  { id: "5", code: "WH-W", name: "West Coast Hub", location: "Long Beach, CA", capacity: 30000, used: 18500, status: "active" },
]
