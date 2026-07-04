export type ApprovalStatus = "pending" | "approved" | "rejected"

export type ApprovalType = "Expense" | "Purchase Order" | "Time Off"

export interface ApprovalRequest {
  id: string
  title: string
  type: ApprovalType
  requester: string
  amount?: number
  submittedDate: string
  status: ApprovalStatus
}

export const STATUS_LABEL: Record<ApprovalStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
}

export const STATUS_COLUMNS: ApprovalStatus[] = ["pending", "approved", "rejected"]

export const INITIAL_REQUESTS: ApprovalRequest[] = [
  {
    id: "req-1",
    title: "Client dinner — Q2 kickoff",
    type: "Expense",
    requester: "Maria Chen",
    amount: 284.5,
    submittedDate: "2026-06-28",
    status: "pending",
  },
  {
    id: "req-2",
    title: "Warehouse racking — 20 units",
    type: "Purchase Order",
    requester: "David Okafor",
    amount: 6200,
    submittedDate: "2026-06-27",
    status: "pending",
  },
  {
    id: "req-3",
    title: "Vacation — Aug 10-14",
    type: "Time Off",
    requester: "Priya Nair",
    submittedDate: "2026-06-25",
    status: "pending",
  },
  {
    id: "req-4",
    title: "Conference travel — SaaStr",
    type: "Expense",
    requester: "Tom Whitfield",
    amount: 1120,
    submittedDate: "2026-06-20",
    status: "approved",
  },
  {
    id: "req-5",
    title: "Forklift maintenance contract",
    type: "Purchase Order",
    requester: "David Okafor",
    amount: 3400,
    submittedDate: "2026-06-18",
    status: "approved",
  },
  {
    id: "req-6",
    title: "Sick leave — Jun 22",
    type: "Time Off",
    requester: "Elena Vasquez",
    submittedDate: "2026-06-21",
    status: "rejected",
  },
]

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}
