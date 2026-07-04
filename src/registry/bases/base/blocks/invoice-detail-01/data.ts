// ── Types ──────────────────────────────────────────────────────────────────

export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft"

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  number: string
  customer: string
  status: InvoiceStatus
  issuedDate: string
  dueDate: string
  lineItems: LineItem[]
  notes: string
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const INVOICES: Invoice[] = [
  {
    id: "inv-1042",
    number: "INV-1042",
    customer: "Bluepeak Logistics",
    status: "overdue",
    issuedDate: "2026-05-12",
    dueDate: "2026-06-11",
    lineItems: [
      { id: "li-1", description: "Warehouse management license", quantity: 1, unitPrice: 4200 },
      { id: "li-2", description: "Onboarding support", quantity: 8, unitPrice: 150 },
    ],
    notes: "Second reminder sent 2026-06-20. Awaiting response from AP.",
  },
  {
    id: "inv-1043",
    number: "INV-1043",
    customer: "Northwind Traders",
    status: "paid",
    issuedDate: "2026-05-20",
    dueDate: "2026-06-19",
    lineItems: [
      { id: "li-1", description: "Inventory sync module", quantity: 1, unitPrice: 1800 },
    ],
    notes: "Paid in full via ACH.",
  },
  {
    id: "inv-1044",
    number: "INV-1044",
    customer: "Cascade Retail Group",
    status: "pending",
    issuedDate: "2026-06-01",
    dueDate: "2026-07-01",
    lineItems: [
      { id: "li-1", description: "Payroll processing — June", quantity: 1, unitPrice: 2600 },
      { id: "li-2", description: "Additional employee seats", quantity: 14, unitPrice: 12 },
    ],
    notes: "",
  },
  {
    id: "inv-1045",
    number: "INV-1045",
    customer: "Harborline Freight",
    status: "draft",
    issuedDate: "2026-06-28",
    dueDate: "2026-07-28",
    lineItems: [
      { id: "li-1", description: "Fleet maintenance tracking add-on", quantity: 1, unitPrice: 950 },
    ],
    notes: "Awaiting PO number before sending.",
  },
  {
    id: "inv-1046",
    number: "INV-1046",
    customer: "Summit Manufacturing",
    status: "pending",
    issuedDate: "2026-06-15",
    dueDate: "2026-07-15",
    lineItems: [
      { id: "li-1", description: "Stock reconciliation service", quantity: 3, unitPrice: 600 },
    ],
    notes: "",
  },
]

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  draft: "Draft",
}

export function invoiceTotal(invoice: Invoice): number {
  return invoice.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0)
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}
