// ── Types ──────────────────────────────────────────────────────────────────

export type PayrollStatus = "draft" | "processing" | "paid"

export interface Payslip {
  id: string
  employee: string
  role: string
  gross: number
  deductions: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const STATUS_LABEL: Record<PayrollStatus, string> = {
  draft: "Draft",
  processing: "Processing",
  paid: "Paid",
}

export const netPay = (p: Payslip): number => p.gross - p.deductions

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ── Mock data ──────────────────────────────────────────────────────────────

export const PAYROLL_RUN = {
  period: "March 2026",
  payDate: "2026-03-31",
  status: "processing" as PayrollStatus,
}

export const PAYSLIPS: Payslip[] = [
  { id: "1", employee: "Sarah Chen", role: "Engineering", gross: 8200, deductions: 1968 },
  { id: "2", employee: "Mike Johnson", role: "Sales", gross: 6400, deductions: 1472 },
  { id: "3", employee: "Emma Davis", role: "Design", gross: 5900, deductions: 1357 },
  { id: "4", employee: "David Lee", role: "Support", gross: 4800, deductions: 1056 },
  { id: "5", employee: "Priya Nair", role: "Engineering", gross: 7600, deductions: 1824 },
]
