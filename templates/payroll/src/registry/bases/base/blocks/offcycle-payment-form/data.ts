// ── Types ──────────────────────────────────────────────────────────────────

export type PaymentType = "bonus" | "correction" | "reimbursement" | "commission"

export interface OffcyclePayment {
  employeeId: string
  type: PaymentType
  amount: string // raw input value
  payDate: string // ISO date
  reason: string
}

export interface Employee {
  id: string
  name: string
  role: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  bonus: "Bonus",
  correction: "Correction",
  reimbursement: "Reimbursement",
  commission: "Commission",
}

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

export const emptyPayment = (): OffcyclePayment => ({
  employeeId: "",
  type: "bonus",
  amount: "",
  payDate: "",
  reason: "",
})

export const isComplete = (p: OffcyclePayment): boolean =>
  Boolean(p.employeeId) &&
  Number(p.amount) > 0 &&
  Boolean(p.payDate) &&
  p.reason.trim().length > 0

// ── Mock data ──────────────────────────────────────────────────────────────

export const EMPLOYEES: Employee[] = [
  { id: "1", name: "Sarah Chen", role: "Senior Engineer" },
  { id: "2", name: "Mike Johnson", role: "Account Executive" },
  { id: "3", name: "Emma Davis", role: "Product Designer" },
  { id: "4", name: "David Lee", role: "Support Lead" },
  { id: "5", name: "Priya Nair", role: "Staff Engineer" },
]
