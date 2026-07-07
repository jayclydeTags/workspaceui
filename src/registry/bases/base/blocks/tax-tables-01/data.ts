// ── Types ──────────────────────────────────────────────────────────────────

export type FilingStatus = "single" | "married" | "head_of_household"

export interface TaxBracket {
  id: string
  jurisdiction: string
  filingStatus: FilingStatus
  minIncome: number
  maxIncome: number | null // null = no upper bound
  rate: number // decimal, e.g. 0.22
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const FILING_STATUS_LABEL: Record<FilingStatus, string> = {
  single: "Single",
  married: "Married filing jointly",
  head_of_household: "Head of household",
}

const currency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

export const formatRange = (min: number, max: number | null) =>
  max === null ? `${currency(min)}+` : `${currency(min)} – ${currency(max)}`

export const formatRate = (rate: number) => `${(rate * 100).toFixed(1)}%`

// ── Mock data ──────────────────────────────────────────────────────────────

export const TAX_YEAR = 2026

export const TAX_BRACKETS: TaxBracket[] = [
  // Federal — single
  { id: "f-s-1", jurisdiction: "Federal", filingStatus: "single", minIncome: 0, maxIncome: 11925, rate: 0.1 },
  { id: "f-s-2", jurisdiction: "Federal", filingStatus: "single", minIncome: 11925, maxIncome: 48475, rate: 0.12 },
  { id: "f-s-3", jurisdiction: "Federal", filingStatus: "single", minIncome: 48475, maxIncome: 103350, rate: 0.22 },
  { id: "f-s-4", jurisdiction: "Federal", filingStatus: "single", minIncome: 103350, maxIncome: 197300, rate: 0.24 },
  { id: "f-s-5", jurisdiction: "Federal", filingStatus: "single", minIncome: 197300, maxIncome: null, rate: 0.32 },
  // Federal — married filing jointly
  { id: "f-m-1", jurisdiction: "Federal", filingStatus: "married", minIncome: 0, maxIncome: 23850, rate: 0.1 },
  { id: "f-m-2", jurisdiction: "Federal", filingStatus: "married", minIncome: 23850, maxIncome: 96950, rate: 0.12 },
  { id: "f-m-3", jurisdiction: "Federal", filingStatus: "married", minIncome: 96950, maxIncome: 206700, rate: 0.22 },
  { id: "f-m-4", jurisdiction: "Federal", filingStatus: "married", minIncome: 206700, maxIncome: null, rate: 0.24 },
  // California — single
  { id: "ca-s-1", jurisdiction: "California", filingStatus: "single", minIncome: 0, maxIncome: 10756, rate: 0.01 },
  { id: "ca-s-2", jurisdiction: "California", filingStatus: "single", minIncome: 10756, maxIncome: 25499, rate: 0.02 },
  { id: "ca-s-3", jurisdiction: "California", filingStatus: "single", minIncome: 25499, maxIncome: 40245, rate: 0.04 },
  { id: "ca-s-4", jurisdiction: "California", filingStatus: "single", minIncome: 40245, maxIncome: null, rate: 0.06 },
  // New York — single
  { id: "ny-s-1", jurisdiction: "New York", filingStatus: "single", minIncome: 0, maxIncome: 8500, rate: 0.04 },
  { id: "ny-s-2", jurisdiction: "New York", filingStatus: "single", minIncome: 8500, maxIncome: 11700, rate: 0.045 },
  { id: "ny-s-3", jurisdiction: "New York", filingStatus: "single", minIncome: 11700, maxIncome: null, rate: 0.0525 },
]

export const JURISDICTIONS = Array.from(
  new Set(TAX_BRACKETS.map((b) => b.jurisdiction))
)
