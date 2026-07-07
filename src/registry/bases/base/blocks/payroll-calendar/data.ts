// ── Types ──────────────────────────────────────────────────────────────────

export type PeriodStatus = "paid" | "processing" | "upcoming"

export interface PayPeriod {
  id: string
  period: string
  start: string // ISO date
  end: string // ISO date
  cutoff: string // ISO date — timesheet lock
  payDate: string // ISO date
  status: PeriodStatus
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const STATUS_LABEL: Record<PeriodStatus, string> = {
  paid: "Paid",
  processing: "Processing",
  upcoming: "Upcoming",
}

export const nextPeriod = (periods: PayPeriod[]): PayPeriod | undefined =>
  periods.find((p) => p.status !== "paid")

// ── Mock data ──────────────────────────────────────────────────────────────

export const PAY_PERIODS: PayPeriod[] = [
  { id: "1", period: "January 2026", start: "2026-01-01", end: "2026-01-31", cutoff: "2026-01-28", payDate: "2026-01-31", status: "paid" },
  { id: "2", period: "February 2026", start: "2026-02-01", end: "2026-02-28", cutoff: "2026-02-25", payDate: "2026-02-27", status: "paid" },
  { id: "3", period: "March 2026", start: "2026-03-01", end: "2026-03-31", cutoff: "2026-03-27", payDate: "2026-03-31", status: "processing" },
  { id: "4", period: "April 2026", start: "2026-04-01", end: "2026-04-30", cutoff: "2026-04-28", payDate: "2026-04-30", status: "upcoming" },
  { id: "5", period: "May 2026", start: "2026-05-01", end: "2026-05-31", cutoff: "2026-05-27", payDate: "2026-05-29", status: "upcoming" },
]
