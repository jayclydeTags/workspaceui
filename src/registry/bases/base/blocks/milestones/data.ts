// ── Types ──────────────────────────────────────────────────────────────────

export interface Milestone {
  id: string
  name: string
  project: string
  owner: string
  /** ISO date. */
  due: string
  /** Tasks in scope, and how many are finished. */
  tasksTotal: number
  tasksDone: number
  /** Set once the milestone is signed off. */
  completedOn: string
}

export type MilestoneDraft = Omit<Milestone, "id" | "completedOn">

export type MilestoneState = "completed" | "overdue" | "at-risk" | "on-track"

export const STATE_LABEL: Record<MilestoneState, string> = {
  completed: "completed",
  overdue: "overdue",
  "at-risk": "at risk",
  "on-track": "on track",
}

/** Under this share of tasks done inside the last week reads as at-risk. */
export const AT_RISK_DAYS = 7

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): MilestoneDraft => ({
  name: "",
  project: "",
  owner: "",
  due: "",
  tasksTotal: 1,
  tasksDone: 0,
})

export const isValid = (d: MilestoneDraft): boolean =>
  d.name.trim() !== "" &&
  d.due !== "" &&
  d.tasksTotal > 0 &&
  d.tasksDone >= 0 &&
  d.tasksDone <= d.tasksTotal

export const progress = (m: Milestone | MilestoneDraft): number =>
  m.tasksTotal <= 0 ? 0 : Math.round((m.tasksDone / m.tasksTotal) * 100)

const daysUntil = (iso: string, today: Date) =>
  Math.ceil(
    (Date.parse(iso) - Date.parse(today.toISOString().slice(0, 10))) / 86_400_000
  )

/**
 * State is derived, never stored: signed off → completed; past due → overdue;
 * due within a week with work left → at risk; otherwise on track.
 */
export function state(m: Milestone, today = new Date()): MilestoneState {
  if (m.completedOn) return "completed"
  const days = daysUntil(m.due, today)
  if (days < 0) return "overdue"
  if (days <= AT_RISK_DAYS && progress(m) < 100) return "at-risk"
  return "on-track"
}

export const openCount = (milestones: Milestone[]): number =>
  milestones.filter((m) => !m.completedOn).length

// ── Mock data ──────────────────────────────────────────────────────────────

export const MILESTONES: Milestone[] = [
  { id: "1", name: "Schema frozen", project: "PRJ-101", owner: "Ava Chen", due: "2026-07-10", tasksTotal: 8, tasksDone: 6, completedOn: "" },
  { id: "2", name: "Dual-write live", project: "PRJ-101", owner: "Ava Chen", due: "2026-08-15", tasksTotal: 12, tasksDone: 3, completedOn: "" },
  { id: "3", name: "Beta cut", project: "PRJ-102", owner: "Marcus Webb", due: "2026-06-30", tasksTotal: 10, tasksDone: 7, completedOn: "" },
  { id: "4", name: "Discovery sign-off", project: "PRJ-103", owner: "Priya Nair", due: "2026-05-29", tasksTotal: 5, tasksDone: 5, completedOn: "2026-05-28" },
  { id: "5", name: "Pilot warehouse live", project: "PRJ-103", owner: "Priya Nair", due: "2026-11-01", tasksTotal: 20, tasksDone: 2, completedOn: "" },
]
