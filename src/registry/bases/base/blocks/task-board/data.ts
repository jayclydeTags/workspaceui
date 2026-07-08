// ── Types ──────────────────────────────────────────────────────────────────

export type TaskStatus = "todo" | "in-progress" | "review" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  assignee: string
  priority: TaskPriority
  /** ISO date, or "" when unscheduled. */
  due: string
  status: TaskStatus
}

export type TaskDraft = Omit<Task, "id">

export const STATUS_COLUMNS: TaskStatus[] = [
  "todo",
  "in-progress",
  "review",
  "done",
]

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  review: "In review",
  done: "Done",
}

export const PRIORITIES: TaskPriority[] = ["low", "medium", "high"]

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): TaskDraft => ({
  title: "",
  assignee: "",
  priority: "medium",
  due: "",
  status: "todo",
})

export const isValid = (d: TaskDraft): boolean => d.title.trim() !== ""

export const initials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

/** Share of tasks in the `done` column, 0–100. */
export function completion(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === "done").length
  return Math.round((done / tasks.length) * 100)
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const TASKS: Task[] = [
  { id: "1", title: "Map legacy billing tables", assignee: "Ava Chen", priority: "high", due: "2026-07-14", status: "in-progress" },
  { id: "2", title: "Draft migration runbook", assignee: "Marcus Webb", priority: "medium", due: "2026-07-20", status: "todo" },
  { id: "3", title: "Backfill invoice fixtures", assignee: "Priya Nair", priority: "low", due: "", status: "todo" },
  { id: "4", title: "Dual-write shim", assignee: "Ava Chen", priority: "high", due: "2026-07-10", status: "review" },
  { id: "5", title: "Retire the cron sync", assignee: "Tom Okafor", priority: "medium", due: "2026-07-02", status: "done" },
  { id: "6", title: "Spike: change-data-capture", assignee: "Lena Fischer", priority: "low", due: "2026-06-28", status: "done" },
]
