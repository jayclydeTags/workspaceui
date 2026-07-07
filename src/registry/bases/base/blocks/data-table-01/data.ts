// Generic data-table sample entity. Swap `Payment` + `PAYMENTS` for your own
// row type and the columns in `components/columns.tsx` to reuse this table.

export type PaymentStatus = "pending" | "processing" | "success" | "failed"

export interface Payment {
  id: string
  amount: number
  status: PaymentStatus
  email: string
}

export const PAYMENTS: Payment[] = [
  { id: "1", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "2", amount: 242, status: "success", email: "abe45@example.com" },
  { id: "3", amount: 837, status: "processing", email: "monserrat44@example.com" },
  { id: "4", amount: 874, status: "success", email: "silas22@example.com" },
  { id: "5", amount: 721, status: "failed", email: "carmella@example.com" },
  { id: "6", amount: 459, status: "pending", email: "jason78@example.com" },
  { id: "7", amount: 128, status: "processing", email: "maria.lopez@example.com" },
  { id: "8", amount: 603, status: "success", email: "devon.k@example.com" },
  { id: "9", amount: 92, status: "failed", email: "nina.patel@example.com" },
  { id: "10", amount: 540, status: "pending", email: "omar.said@example.com" },
  { id: "11", amount: 385, status: "success", email: "grace.liu@example.com" },
  { id: "12", amount: 267, status: "processing", email: "theo.m@example.com" },
]

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  )
