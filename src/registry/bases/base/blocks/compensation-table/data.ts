// ── Types ──────────────────────────────────────────────────────────────────

export type Band = "IC1" | "IC2" | "IC3" | "IC4" | "M1" | "M2"

export interface CompRecord {
  id: string
  name: string
  role: string
  band: Band
  base: number
  lastAdjustment: string // ISO date
  changePct: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

export const formatPct = (pct: number): string =>
  `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`

// ── Mock data ──────────────────────────────────────────────────────────────

export const COMP_RECORDS: CompRecord[] = [
  { id: "1", name: "Sarah Chen", role: "Senior Engineer", band: "IC4", base: 168000, lastAdjustment: "2026-01-01", changePct: 6.2 },
  { id: "2", name: "Mike Johnson", role: "Account Executive", band: "IC3", base: 132000, lastAdjustment: "2025-07-01", changePct: 4.0 },
  { id: "3", name: "Emma Davis", role: "Product Designer", band: "IC3", base: 128000, lastAdjustment: "2026-01-01", changePct: 3.5 },
  { id: "4", name: "David Lee", role: "Support Lead", band: "M1", base: 142000, lastAdjustment: "2025-10-01", changePct: 5.1 },
  { id: "5", name: "Priya Nair", role: "Staff Engineer", band: "M2", base: 205000, lastAdjustment: "2026-01-01", changePct: 8.4 },
  { id: "6", name: "Tom Alvarez", role: "Engineer", band: "IC2", base: 112000, lastAdjustment: "2025-04-01", changePct: 0 },
]
