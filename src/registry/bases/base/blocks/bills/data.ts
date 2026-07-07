// ── Types ──────────────────────────────────────────────────────────────────

export type BillStatus = "draft" | "open" | "paid" | "overdue"

export interface Bill {
  id: string
  vendor: string
  billNumber: string
  dueDate: string // ISO date
  amount: number
  status: BillStatus
}

export type BillDraft = Omit<Bill, "id">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): BillDraft => ({
  vendor: "",
  billNumber: "",
  dueDate: new Date().toISOString().slice(0, 10),
  amount: 0,
  status: "draft",
})

export const isValid = (d: BillDraft): boolean =>
  d.vendor.trim() !== "" && d.billNumber.trim() !== "" && d.amount > 0

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ── Mock data ──────────────────────────────────────────────────────────────

export const BILLS: Bill[] = [
  { id: "1", vendor: "Acme Supply Co.", billNumber: "B-1001", dueDate: "2026-07-15", amount: 4250, status: "open" },
  { id: "2", vendor: "Bluepeak Logistics", billNumber: "B-1002", dueDate: "2026-06-30", amount: 1875.5, status: "overdue" },
  { id: "3", vendor: "Northwind Traders", billNumber: "B-1003", dueDate: "2026-06-01", amount: 3200, status: "paid" },
  { id: "4", vendor: "Cascade Retail Group", billNumber: "B-1004", dueDate: "2026-07-20", amount: 980, status: "open" },
  { id: "5", vendor: "Harborline Freight", billNumber: "B-1005", dueDate: "2026-08-01", amount: 5600, status: "draft" },
  { id: "6", vendor: "Acme Supply Co.", billNumber: "B-1006", dueDate: "2026-05-15", amount: 2100, status: "paid" },
]
