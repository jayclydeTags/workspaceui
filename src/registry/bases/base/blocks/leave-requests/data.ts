// ── Types ──────────────────────────────────────────────────────────────────

export type LeaveType = "vacation" | "sick" | "personal" | "unpaid"
export type LeaveStatus = "pending" | "approved" | "rejected"

export interface LeaveRequest {
  id: string
  employee: string
  type: LeaveType
  /** ISO date, inclusive. */
  start: string
  /** ISO date, inclusive. */
  end: string
  reason: string
  status: LeaveStatus
}

export type LeaveRequestDraft = Omit<LeaveRequest, "id" | "status">

export const LEAVE_TYPES: LeaveType[] = [
  "vacation",
  "sick",
  "personal",
  "unpaid",
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): LeaveRequestDraft => ({
  employee: "",
  type: "vacation",
  start: "",
  end: "",
  reason: "",
})

/** Inclusive day count; 0 when the range is empty or inverted. */
export function dayCount(start: string, end: string): number {
  if (!start || !end) return 0
  const ms = Date.parse(end) - Date.parse(start)
  if (Number.isNaN(ms) || ms < 0) return 0
  return Math.round(ms / 86_400_000) + 1
}

export const isValid = (d: LeaveRequestDraft): boolean =>
  d.employee.trim() !== "" && dayCount(d.start, d.end) > 0

export const pendingCount = (requests: LeaveRequest[]): number =>
  requests.filter((r) => r.status === "pending").length

// ── Mock data ──────────────────────────────────────────────────────────────

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "1", employee: "Ava Chen", type: "vacation", start: "2026-07-13", end: "2026-07-17", reason: "Family trip", status: "pending" },
  { id: "2", employee: "Marcus Webb", type: "sick", start: "2026-07-06", end: "2026-07-06", reason: "Flu", status: "approved" },
  { id: "3", employee: "Priya Nair", type: "personal", start: "2026-07-20", end: "2026-07-21", reason: "Moving apartments", status: "pending" },
  { id: "4", employee: "Tom Okafor", type: "unpaid", start: "2026-08-03", end: "2026-08-14", reason: "Sabbatical", status: "rejected" },
  { id: "5", employee: "Lena Fischer", type: "vacation", start: "2026-09-01", end: "2026-09-05", reason: "Wedding", status: "approved" },
]
