// ── Types ──────────────────────────────────────────────────────────────────

export type EntryStatus = "draft" | "submitted" | "approved"

export interface TimeEntry {
  id: string
  member: string
  project: string
  task: string
  /** ISO date. */
  date: string
  hours: number
  billable: boolean
  status: EntryStatus
}

export type TimeEntryDraft = Omit<TimeEntry, "id" | "status">

export const PROJECTS = [
  "PRJ-101 Billing migration",
  "PRJ-102 Mobile app rewrite",
  "PRJ-103 Warehouse rollout",
]

/** A day can't hold more than this; anything over is a typo, not overtime. */
export const MAX_HOURS_PER_ENTRY = 24

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): TimeEntryDraft => ({
  member: "",
  project: PROJECTS[0],
  task: "",
  date: new Date().toISOString().slice(0, 10),
  hours: 0,
  billable: true,
})

export const isValid = (d: TimeEntryDraft): boolean =>
  d.member.trim() !== "" &&
  d.date !== "" &&
  d.hours > 0 &&
  d.hours <= MAX_HOURS_PER_ENTRY

const round1 = (n: number) => Math.round(n * 10) / 10

export const totalHours = (entries: TimeEntry[]): number =>
  round1(entries.reduce((sum, e) => sum + e.hours, 0))

export const billableHours = (entries: TimeEntry[]): number =>
  round1(entries.filter((e) => e.billable).reduce((sum, e) => sum + e.hours, 0))

/** Billable share of logged hours, 0–100. */
export function utilization(entries: TimeEntry[]): number {
  const total = totalHours(entries)
  if (total === 0) return 0
  return Math.round((billableHours(entries) / total) * 100)
}

/** Only a draft entry is still editable — submitting it locks it. */
export const isLocked = (entry: TimeEntry): boolean => entry.status !== "draft"

// ── Mock data ──────────────────────────────────────────────────────────────

export const TIME_ENTRIES: TimeEntry[] = [
  { id: "1", member: "Ava Chen", project: PROJECTS[0], task: "Map legacy billing tables", date: "2026-07-06", hours: 6.5, billable: true, status: "approved" },
  { id: "2", member: "Ava Chen", project: PROJECTS[0], task: "Dual-write shim", date: "2026-07-07", hours: 7, billable: true, status: "submitted" },
  { id: "3", member: "Marcus Webb", project: PROJECTS[1], task: "Navigation refactor", date: "2026-07-07", hours: 5, billable: true, status: "draft" },
  { id: "4", member: "Priya Nair", project: PROJECTS[2], task: "Site survey", date: "2026-07-07", hours: 3.5, billable: false, status: "draft" },
  { id: "5", member: "Tom Okafor", project: PROJECTS[1], task: "Internal standup", date: "2026-07-06", hours: 1, billable: false, status: "approved" },
]
