// Generic data-table sample entity. Swap `Payment` + `PAYMENTS` for your own
// row type and the columns in `components/columns.tsx` to reuse this table.
// Fields beyond status/email/amount exist to exercise DataGrid's other
// column types (date, boolean, multiSelect, user) with realistic data.

export type PaymentStatus = "pending" | "processing" | "success" | "failed"

export interface PaymentAgent {
  id: string
  name: string
}

export const PAYMENT_AGENTS: PaymentAgent[] = [
  { id: "a1", name: "Priya Patel" },
  { id: "a2", name: "Sam Okafor" },
]

export interface Payment {
  id: string
  amount: number
  status: PaymentStatus
  email: string
  paidAt: string
  flagged: boolean
  tags: string[]
  processedBy: string | null
}

export const PAYMENTS: Payment[] = [
  {
    id: "1",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
    paidAt: "2026-01-04",
    flagged: false,
    tags: ["recurring"],
    processedBy: null,
  },
  {
    id: "2",
    amount: 242,
    status: "success",
    email: "abe45@example.com",
    paidAt: "2026-01-06",
    flagged: false,
    tags: [],
    processedBy: null,
  },
  {
    id: "3",
    amount: 837,
    status: "processing",
    email: "monserrat44@example.com",
    paidAt: "2026-01-09",
    flagged: false,
    tags: ["high-value"],
    processedBy: "a1",
  },
  {
    id: "4",
    amount: 874,
    status: "success",
    email: "silas22@example.com",
    paidAt: "2026-01-10",
    flagged: false,
    tags: ["high-value", "recurring"],
    processedBy: null,
  },
  {
    id: "5",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
    paidAt: "2026-01-11",
    flagged: true,
    tags: ["disputed"],
    processedBy: "a2",
  },
  {
    id: "6",
    amount: 459,
    status: "pending",
    email: "jason78@example.com",
    paidAt: "2026-01-13",
    flagged: false,
    tags: [],
    processedBy: null,
  },
  {
    id: "7",
    amount: 128,
    status: "processing",
    email: "maria.lopez@example.com",
    paidAt: "2026-01-14",
    flagged: false,
    tags: ["recurring"],
    processedBy: "a1",
  },
  {
    id: "8",
    amount: 603,
    status: "success",
    email: "devon.k@example.com",
    paidAt: "2026-01-16",
    flagged: false,
    tags: [],
    processedBy: null,
  },
  {
    id: "9",
    amount: 92,
    status: "failed",
    email: "nina.patel@example.com",
    paidAt: "2026-01-18",
    flagged: true,
    tags: ["disputed", "refunded"],
    processedBy: "a2",
  },
  {
    id: "10",
    amount: 540,
    status: "pending",
    email: "omar.said@example.com",
    paidAt: "2026-01-19",
    flagged: false,
    tags: [],
    processedBy: null,
  },
  {
    id: "11",
    amount: 385,
    status: "success",
    email: "grace.liu@example.com",
    paidAt: "2026-01-21",
    flagged: false,
    tags: ["high-value"],
    processedBy: "a1",
  },
  {
    id: "12",
    amount: 267,
    status: "processing",
    email: "theo.m@example.com",
    paidAt: "2026-01-23",
    flagged: false,
    tags: ["refunded"],
    processedBy: "a2",
  },
]
