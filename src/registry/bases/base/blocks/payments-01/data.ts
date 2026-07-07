// ── Types ──────────────────────────────────────────────────────────────────

export type PaymentMethod = "ach" | "check" | "card" | "wire"
export type PaymentStatus = "pending" | "cleared" | "failed"

export interface Payment {
  id: string
  payee: string
  method: PaymentMethod
  reference: string
  date: string // ISO date
  amount: number
  status: PaymentStatus
}

export type PaymentDraft = Omit<Payment, "id">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  ach: "ACH",
  check: "Check",
  card: "Card",
  wire: "Wire",
}

export const emptyDraft = (): PaymentDraft => ({
  payee: "",
  method: "ach",
  reference: "",
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  status: "pending",
})

export const isValid = (d: PaymentDraft): boolean =>
  d.payee.trim() !== "" && d.amount > 0

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ── Mock data ──────────────────────────────────────────────────────────────

export const PAYMENTS: Payment[] = [
  { id: "1", payee: "Acme Supply Co.", method: "ach", reference: "ACH-88213", date: "2026-06-02", amount: 2100, status: "cleared" },
  { id: "2", payee: "Bluepeak Logistics", method: "check", reference: "CHK-1042", date: "2026-06-10", amount: 1875.5, status: "pending" },
  { id: "3", payee: "Northwind Traders", method: "wire", reference: "WIRE-5521", date: "2026-06-01", amount: 3200, status: "cleared" },
  { id: "4", payee: "Cascade Retail Group", method: "card", reference: "CARD-9931", date: "2026-06-18", amount: 980, status: "failed" },
  { id: "5", payee: "Harborline Freight", method: "ach", reference: "ACH-88240", date: "2026-06-20", amount: 1500, status: "pending" },
]
