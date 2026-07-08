// ── Types ──────────────────────────────────────────────────────────────────

export type AttendanceStatus = "present" | "late" | "absent" | "leave"

export interface AttendanceEntry {
  id: string
  employee: string
  /** ISO date. */
  date: string
  /** "HH:MM", or "" when absent / on leave. */
  clockIn: string
  clockOut: string
  status: AttendanceStatus
}

export type AttendanceDraft = Omit<AttendanceEntry, "id" | "status">

/** Anything later than this counts as late. */
export const SHIFT_START = "09:00"

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): AttendanceDraft => ({
  employee: "",
  date: new Date().toISOString().slice(0, 10),
  clockIn: "",
  clockOut: "",
})

/** Hours between clock-in and clock-out, rounded to 0.1; 0 if incomplete. */
export function hoursWorked(entry: {
  clockIn: string
  clockOut: string
}): number {
  if (!entry.clockIn || !entry.clockOut) return 0
  const mins = toMinutes(entry.clockOut) - toMinutes(entry.clockIn)
  if (mins <= 0) return 0
  return Math.round(mins / 6) / 10
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

/** Status is derived from the punches, never entered by hand. */
export function deriveStatus(draft: AttendanceDraft): AttendanceStatus {
  if (!draft.clockIn) return "absent"
  return toMinutes(draft.clockIn) > toMinutes(SHIFT_START) ? "late" : "present"
}

export const isValid = (d: AttendanceDraft): boolean =>
  d.employee.trim() !== "" &&
  d.date !== "" &&
  (d.clockOut === "" || hoursWorked(d) > 0)

export const totalHours = (entries: AttendanceEntry[]): number =>
  Math.round(entries.reduce((sum, e) => sum + hoursWorked(e), 0) * 10) / 10

// ── Mock data ──────────────────────────────────────────────────────────────

export const ATTENDANCE: AttendanceEntry[] = [
  { id: "1", employee: "Ava Chen", date: "2026-07-07", clockIn: "08:56", clockOut: "17:32", status: "present" },
  { id: "2", employee: "Marcus Webb", date: "2026-07-07", clockIn: "09:24", clockOut: "18:05", status: "late" },
  { id: "3", employee: "Priya Nair", date: "2026-07-07", clockIn: "", clockOut: "", status: "leave" },
  { id: "4", employee: "Tom Okafor", date: "2026-07-07", clockIn: "", clockOut: "", status: "absent" },
  { id: "5", employee: "Lena Fischer", date: "2026-07-07", clockIn: "08:45", clockOut: "16:30", status: "present" },
  { id: "6", employee: "Ava Chen", date: "2026-07-06", clockIn: "09:02", clockOut: "17:48", status: "late" },
]
