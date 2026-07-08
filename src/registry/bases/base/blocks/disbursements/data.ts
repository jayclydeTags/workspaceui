// ── Types ──────────────────────────────────────────────────────────────────

export type DisbursementStatus = "scheduled" | "released" | "failed"
export type Method = "ach" | "wire" | "check"

export interface Disbursement {
  id: string
  loan: string
  borrower: string
  /** Whole currency units. */
  amount: number
  method: Method
  /** ISO date the funds are due to move. */
  date: string
  status: DisbursementStatus
}

export type DisbursementDraft = Omit<Disbursement, "id" | "status">

export const METHODS: Method[] = ["ach", "wire", "check"]

/** Approved principal per loan — a tranche can never overdraw it. */
export const LOAN_PRINCIPAL: Record<string, number> = {
  "LN-2041": 60000,
  "LN-2043": 150000,
  "LN-2045": 18000,
}

export const LOANS = Object.keys(LOAN_PRINCIPAL)

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): DisbursementDraft => ({
  loan: LOANS[0],
  borrower: "",
  amount: 0,
  method: "ach",
  date: new Date().toISOString().slice(0, 10),
})

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

/** Money already committed to a loan — released or still scheduled. */
export function committed(
  disbursements: Disbursement[],
  loan: string,
  exceptId?: string
): number {
  return disbursements
    .filter((d) => d.loan === loan && d.status !== "failed" && d.id !== exceptId)
    .reduce((sum, d) => sum + d.amount, 0)
}

/** Headroom left on a loan's approved principal. */
export const remaining = (
  disbursements: Disbursement[],
  loan: string,
  exceptId?: string
): number => (LOAN_PRINCIPAL[loan] ?? 0) - committed(disbursements, loan, exceptId)

/** The core rule: tranches can't exceed the approved principal. */
export const wouldOverdraw = (
  disbursements: Disbursement[],
  draft: DisbursementDraft,
  exceptId?: string
): boolean => draft.amount > remaining(disbursements, draft.loan, exceptId)

export const isValid = (d: DisbursementDraft): boolean =>
  d.borrower.trim() !== "" && d.amount > 0 && d.date !== ""

/** Only a scheduled disbursement can be released or edited. */
export const isPending = (d: Disbursement): boolean => d.status === "scheduled"

export const releasedTotal = (disbursements: Disbursement[]): number =>
  disbursements
    .filter((d) => d.status === "released")
    .reduce((sum, d) => sum + d.amount, 0)

// ── Mock data ──────────────────────────────────────────────────────────────

export const DISBURSEMENTS: Disbursement[] = [
  { id: "1", loan: "LN-2041", borrower: "Iris Muller", amount: 40000, method: "ach", date: "2026-06-15", status: "released" },
  { id: "2", loan: "LN-2041", borrower: "Iris Muller", amount: 20000, method: "ach", date: "2026-07-15", status: "scheduled" },
  { id: "3", loan: "LN-2043", borrower: "Nadia Rahman", amount: 100000, method: "wire", date: "2026-06-01", status: "released" },
  { id: "4", loan: "LN-2043", borrower: "Nadia Rahman", amount: 25000, method: "wire", date: "2026-07-20", status: "scheduled" },
  { id: "5", loan: "LN-2045", borrower: "Sofia Marchetti", amount: 18000, method: "check", date: "2026-06-28", status: "failed" },
]
