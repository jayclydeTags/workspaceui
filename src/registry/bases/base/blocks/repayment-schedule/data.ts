// ── Types ──────────────────────────────────────────────────────────────────

export type InstalmentStatus = "paid" | "due" | "overdue" | "scheduled"

export interface Loan {
  reference: string
  borrower: string
  principal: number
  /** Annual nominal rate, percent. */
  rate: number
  termMonths: number
  /** ISO date of the first instalment. */
  firstDue: string
}

export interface Instalment {
  /** 1-based instalment number. */
  n: number
  /** ISO due date. */
  due: string
  payment: number
  interest: number
  principal: number
  /** Balance remaining after this instalment. */
  balance: number
  paid: boolean
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

/** Standard amortising payment: P·r / (1 − (1+r)^−n). */
export function monthlyPayment(
  principal: number,
  annualRatePct: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / termMonths
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths))
}

const addMonths = (iso: string, months: number): string => {
  const d = new Date(iso)
  d.setUTCMonth(d.getUTCMonth() + months)
  return d.toISOString().slice(0, 10)
}

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Builds the full amortisation schedule. The last instalment absorbs the
 * rounding drift so the balance lands exactly on zero — the whole point of
 * generating the table rather than storing it.
 */
export function buildSchedule(loan: Loan, paidThrough = 0): Instalment[] {
  const payment = round2(monthlyPayment(loan.principal, loan.rate, loan.termMonths))
  const r = loan.rate / 100 / 12
  const rows: Instalment[] = []
  let balance = loan.principal

  for (let n = 1; n <= loan.termMonths; n++) {
    const interest = round2(balance * r)
    const last = n === loan.termMonths
    const principalPart = last ? balance : round2(payment - interest)
    const due = round2(principalPart + interest)
    balance = round2(balance - principalPart)

    rows.push({
      n,
      due: addMonths(loan.firstDue, n - 1),
      payment: due,
      interest,
      principal: principalPart,
      balance,
      paid: n <= paidThrough,
    })
  }

  return rows
}

/** Status is derived from paid + due date, never stored. */
export function status(
  instalment: Instalment,
  today = new Date()
): InstalmentStatus {
  if (instalment.paid) return "paid"
  const now = Date.parse(today.toISOString().slice(0, 10))
  const due = Date.parse(instalment.due)
  if (due < now) return "overdue"
  if (due === now) return "due"
  return "scheduled"
}

/** Only the earliest unpaid instalment can be settled — no paying out of order. */
export const nextUnpaid = (rows: Instalment[]): Instalment | undefined =>
  rows.find((row) => !row.paid)

export const totalInterest = (rows: Instalment[]): number =>
  round2(rows.reduce((sum, row) => sum + row.interest, 0))

/** Balance after the last settled instalment; the original principal if none. */
export const remainingBalance = (rows: Instalment[]): number => {
  if (rows.length === 0) return 0
  const lastPaid = [...rows].reverse().find((row) => row.paid)
  return lastPaid ? lastPaid.balance : round2(rows[0].balance + rows[0].principal)
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const LOAN: Loan = {
  reference: "LN-2041",
  borrower: "Iris Muller",
  principal: 12000,
  rate: 7.5,
  termMonths: 12,
  firstDue: "2026-02-01",
}

/** Instalments 1–5 already settled. */
export const PAID_THROUGH = 5
