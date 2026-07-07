// ── Types ──────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  date: string // ISO date
  description: string
  amount: number // signed: positive = deposit, negative = withdrawal
  cleared: boolean
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

export const formatSigned = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "always",
  })

export const clearedBalance = (
  openingBalance: number,
  transactions: Transaction[]
): number =>
  transactions.reduce(
    (sum, t) => (t.cleared ? sum + t.amount : sum),
    openingBalance
  )

// ── Mock data ──────────────────────────────────────────────────────────────

export const OPENING_BALANCE = 18420.5
// Equals opening balance + every transaction below, so marking every row
// cleared drives the difference to $0.00 — a "fully reconciled" demo state.
export const STATEMENT_BALANCE = 16308.75
export const STATEMENT_DATE = "2026-06-30"

export const TRANSACTIONS: Transaction[] = [
  { id: "1", date: "2026-06-02", description: "Customer payment — Acme Co.", amount: 5400, cleared: true },
  { id: "2", date: "2026-06-04", description: "Rent — June", amount: -3200, cleared: true },
  { id: "3", date: "2026-06-08", description: "Vendor payment — Bluepeak Logistics", amount: -1875.5, cleared: true },
  { id: "4", date: "2026-06-11", description: "Customer payment — Northwind Traders", amount: 3200, cleared: true },
  { id: "5", date: "2026-06-15", description: "Payroll run", amount: -6100, cleared: false },
  { id: "6", date: "2026-06-18", description: "Card processing fees", amount: -142.25, cleared: true },
  { id: "7", date: "2026-06-22", description: "Customer payment — Cascade Retail", amount: 980, cleared: false },
  { id: "8", date: "2026-06-27", description: "Office supplies", amount: -374, cleared: true },
]
