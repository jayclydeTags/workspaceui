// ── Types ──────────────────────────────────────────────────────────────────

export type TaskStatus = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  title: string
  assignee: string
  status: TaskStatus
  dueDate: string
  description: string
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const TASKS: Task[] = [
  { id: "1", title: "Migrate billing to Stripe", assignee: "Sarah Chen", status: "in-progress", dueDate: "2026-07-12", description: "Swap the legacy invoicing gateway for Stripe Billing across all active subscriptions." },
  { id: "2", title: "Redesign onboarding flow", assignee: "Emma Davis", status: "todo", dueDate: "2026-07-18", description: "Simplify the 5-step signup wizard down to 2 steps based on the latest funnel analysis." },
  { id: "3", title: "Fix flaky checkout tests", assignee: "Mike Johnson", status: "in-progress", dueDate: "2026-07-09", description: "The checkout E2E suite fails intermittently on CI — investigate the race condition in payment confirmation." },
  { id: "4", title: "Write Q3 roadmap doc", assignee: "David Lee", status: "todo", dueDate: "2026-07-20", description: "Draft the Q3 roadmap for engineering leadership review." },
  { id: "5", title: "Audit third-party dependencies", assignee: "Priya Nair", status: "done", dueDate: "2026-07-01", description: "Review all npm dependencies for known vulnerabilities and license compatibility." },
]
