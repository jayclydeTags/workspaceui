export interface LineItem {
  id: string
  item: string
  quantity: number
  unitCost: number
}

export interface PODetails {
  vendor: string
  requestedBy: string
  neededBy: string
  notes: string
}

export const VENDORS: string[] = [
  "Acme Supply Co.",
  "Bluepeak Logistics",
  "Northwind Traders",
  "Cascade Retail Group",
  "Harborline Freight",
]

export function emptyDetails(): PODetails {
  return { vendor: "", requestedBy: "", neededBy: "", notes: "" }
}

export function emptyLineItem(): LineItem {
  return { id: crypto.randomUUID(), item: "", quantity: 1, unitCost: 0 }
}

export function lineItemsTotal(items: LineItem[]): number {
  return items.reduce((sum, li) => sum + li.quantity * li.unitCost, 0)
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}
