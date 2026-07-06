// ── Types ──────────────────────────────────────────────────────────────────

export type TaskStatus = "pending" | "overdue" | "completed"

export interface PayrollTask {
  id: string
  title: string
  employee: string
  dueDate: string // ISO yyyy-mm-dd
  status: TaskStatus
  summary?: string // filled in on completion
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "Pending",
  overdue: "Overdue",
  completed: "Completed",
}

export const STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  overdue: "destructive",
  completed: "secondary",
}

// Client-side stand-in for the "overview aggregation" endpoint.
export const countByStatus = (tasks: PayrollTask[]) =>
  tasks.reduce(
    (acc, t) => {
      acc[t.status] += 1
      return acc
    },
    { pending: 0, overdue: 0, completed: 0 } as Record<TaskStatus, number>
  )

// ── Mock data ──────────────────────────────────────────────────────────────

export const TASKS: PayrollTask[] = [
  { id: "1", title: "Approve March timesheet", employee: "Sarah Chen", dueDate: "2026-07-10", status: "pending" },
  { id: "2", title: "Verify tax withholding", employee: "Mike Johnson", dueDate: "2026-07-02", status: "overdue" },
  { id: "3", title: "Submit expense reimbursement", employee: "Emma Davis", dueDate: "2026-07-12", status: "pending" },
  { id: "4", title: "Confirm bank details", employee: "David Lee", dueDate: "2026-06-28", status: "overdue" },
  { id: "5", title: "Sign payslip acknowledgement", employee: "Priya Nair", dueDate: "2026-06-20", status: "completed", summary: "Signed and returned." },
  { id: "6", title: "Update emergency contact", employee: "Tom Wu", dueDate: "2026-07-15", status: "pending" },
]
