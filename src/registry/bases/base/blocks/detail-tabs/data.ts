// Sample record for the detail-tabs view. Swap `Customer` + `CUSTOMER` and the
// related lists for your own entity to reuse the tabbed detail layout.

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "churned"
  since: string
  lifetimeValue: string
  plan: string
}

export interface Activity {
  id: string
  label: string
  at: string
}

export interface Order {
  id: string
  number: string
  date: string
  total: string
  status: "paid" | "refunded" | "pending"
}

export const CUSTOMER: Customer = {
  id: "1",
  name: "Sarah Chen",
  email: "sarah@acme.com",
  phone: "+1 (555) 018-2245",
  company: "Acme Inc.",
  status: "active",
  since: "Mar 2023",
  lifetimeValue: "$18,420",
  plan: "Enterprise",
}

export const ACTIVITY: Activity[] = [
  { id: "1", label: "Upgraded to Enterprise plan", at: "2 days ago" },
  { id: "2", label: "Opened support ticket #4821", at: "1 week ago" },
  { id: "3", label: "Invoice INV-1043 paid", at: "2 weeks ago" },
  { id: "4", label: "Added 3 team members", at: "1 month ago" },
]

export const ORDERS: Order[] = [
  { id: "1", number: "INV-1043", date: "May 2, 2026", total: "$2,400", status: "paid" },
  { id: "2", number: "INV-0991", date: "Apr 2, 2026", total: "$2,400", status: "paid" },
  { id: "3", number: "INV-0930", date: "Mar 2, 2026", total: "$1,200", status: "refunded" },
  { id: "4", number: "INV-1102", date: "Jun 2, 2026", total: "$2,400", status: "pending" },
]
