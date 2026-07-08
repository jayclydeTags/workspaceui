// ── Types ──────────────────────────────────────────────────────────────────

export type LoanStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "approved"
  | "rejected"

export type LoanPurpose = "working-capital" | "equipment" | "expansion" | "refinance"

export interface LoanApplication {
  id: string
  reference: string
  borrower: string
  purpose: LoanPurpose
  /** Requested principal, whole currency units. */
  amount: number
  /** Annual nominal rate, percent. */
  rate: number
  /** Loan term in months. */
  termMonths: number
  /** Gross monthly income, used for the affordability check. */
  monthlyIncome: number
  /** Existing monthly debt obligations. */
  monthlyDebts: number
  status: LoanStatus
}

export type LoanDraft = Omit<LoanApplication, "id" | "status">

export const LOAN_STATUSES: LoanStatus[] = [
  "draft",
  "submitted",
  "under-review",
  "approved",
  "rejected",
]

export const LOAN_PURPOSES: LoanPurpose[] = [
  "working-capital",
  "equipment",
  "expansion",
  "refinance",
]

/** Above this debt-to-income ratio the application can't be approved. */
export const MAX_DTI = 0.43

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): LoanDraft => ({
  reference: "",
  borrower: "",
  purpose: "working-capital",
  amount: 0,
  rate: 8,
  termMonths: 36,
  monthlyIncome: 0,
  monthlyDebts: 0,
})

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

/**
 * Standard amortising payment: P·r / (1 − (1+r)^−n), with r the monthly rate.
 * Falls back to straight-line when the rate is zero.
 */
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

/** Debt-to-income including the payment on this loan; Infinity with no income. */
export function dti(app: LoanApplication | LoanDraft): number {
  if (app.monthlyIncome <= 0) return Infinity
  const payment = monthlyPayment(app.amount, app.rate, app.termMonths)
  return (app.monthlyDebts + payment) / app.monthlyIncome
}

/** An application over the DTI ceiling is never approvable — the core rule. */
export const isApprovable = (app: LoanApplication): boolean =>
  app.status !== "approved" && app.status !== "rejected" && dti(app) <= MAX_DTI

export const isValid = (d: LoanDraft): boolean =>
  d.reference.trim() !== "" &&
  d.borrower.trim() !== "" &&
  d.amount > 0 &&
  d.rate >= 0 &&
  d.termMonths > 0 &&
  d.monthlyIncome > 0 &&
  d.monthlyDebts >= 0

export const pipelineValue = (apps: LoanApplication[]): number =>
  apps
    .filter((a) => a.status !== "rejected")
    .reduce((sum, a) => sum + a.amount, 0)

// ── Mock data ──────────────────────────────────────────────────────────────

export const APPLICATIONS: LoanApplication[] = [
  { id: "1", reference: "LN-2041", borrower: "Iris Muller", purpose: "equipment", amount: 60000, rate: 7.5, termMonths: 48, monthlyIncome: 9000, monthlyDebts: 1200, status: "under-review" },
  { id: "2", reference: "LN-2042", borrower: "Devon Park", purpose: "working-capital", amount: 25000, rate: 9, termMonths: 24, monthlyIncome: 4000, monthlyDebts: 1500, status: "submitted" },
  { id: "3", reference: "LN-2043", borrower: "Nadia Rahman", purpose: "expansion", amount: 150000, rate: 6.8, termMonths: 60, monthlyIncome: 22000, monthlyDebts: 3000, status: "approved" },
  { id: "4", reference: "LN-2044", borrower: "Owen Blake", purpose: "refinance", amount: 40000, rate: 8.2, termMonths: 36, monthlyIncome: 3200, monthlyDebts: 900, status: "rejected" },
  { id: "5", reference: "LN-2045", borrower: "Sofia Marchetti", purpose: "equipment", amount: 18000, rate: 7.9, termMonths: 24, monthlyIncome: 6500, monthlyDebts: 400, status: "draft" },
]
