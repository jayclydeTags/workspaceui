// ── Types ──────────────────────────────────────────────────────────────────

export interface LineItem {
  label: string
  current: number
  ytd: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const sum = (items: LineItem[], key: "current" | "ytd"): number =>
  items.reduce((total, item) => total + item[key], 0)

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ── Mock data ──────────────────────────────────────────────────────────────

export const EMPLOYEE = {
  name: "Sarah Chen",
  role: "Senior Engineer",
  id: "EMP-0142",
  period: "March 2026",
  payDate: "2026-03-31",
}

export const EARNINGS: LineItem[] = [
  { label: "Base salary", current: 7500, ytd: 22500 },
  { label: "Overtime", current: 420, ytd: 980 },
  { label: "Bonus", current: 280, ytd: 280 },
]

export const DEDUCTIONS: LineItem[] = [
  { label: "Federal tax", current: 1240, ytd: 3720 },
  { label: "State tax", current: 468, ytd: 1404 },
  { label: "Health insurance", current: 180, ytd: 540 },
  { label: "401(k)", current: 80, ytd: 240 },
]

export const EMPLOYER_CONTRIBUTIONS: LineItem[] = [
  { label: "401(k) match", current: 160, ytd: 480 },
  { label: "Health insurance", current: 420, ytd: 1260 },
]
