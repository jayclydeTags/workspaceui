// ── Types ──────────────────────────────────────────────────────────────────

export type KycStatus = "unverified" | "pending" | "verified"
export type RiskGrade = "A" | "B" | "C" | "D"

export interface Borrower {
  id: string
  name: string
  email: string
  phone: string
  /** 300–850, the classic FICO range. */
  creditScore: number
  kyc: KycStatus
  /** Loans currently outstanding — blocks removal. */
  activeLoans: number
  /** Whole currency units still owed across all loans. */
  outstanding: number
}

export type BorrowerDraft = Omit<Borrower, "id" | "activeLoans" | "outstanding">

export const KYC_STATUSES: KycStatus[] = ["unverified", "pending", "verified"]

export const MIN_SCORE = 300
export const MAX_SCORE = 850

/** Score cut-offs for each risk grade, high to low. */
export const GRADE_CUTOFFS: [RiskGrade, number][] = [
  ["A", 740],
  ["B", 670],
  ["C", 580],
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): BorrowerDraft => ({
  name: "",
  email: "",
  phone: "",
  creditScore: 700,
  kyc: "unverified",
})

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

/** Risk grade is derived from the credit score, never stored. */
export function riskGrade(creditScore: number): RiskGrade {
  const hit = GRADE_CUTOFFS.find(([, cutoff]) => creditScore >= cutoff)
  return hit ? hit[0] : "D"
}

/** Only a KYC-verified borrower can take a loan — the core rule. */
export const canBorrow = (b: Borrower): boolean => b.kyc === "verified"

/** A borrower with loans outstanding can't be removed. */
export const isRemovable = (b: Borrower): boolean => b.activeLoans === 0

export const isValid = (d: BorrowerDraft): boolean =>
  d.name.trim() !== "" &&
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) &&
  d.creditScore >= MIN_SCORE &&
  d.creditScore <= MAX_SCORE

export const totalOutstanding = (borrowers: Borrower[]): number =>
  borrowers.reduce((sum, b) => sum + b.outstanding, 0)

export const initials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

// ── Mock data ──────────────────────────────────────────────────────────────

export const BORROWERS: Borrower[] = [
  { id: "1", name: "Iris Muller", email: "iris@northwind.example", phone: "+1 503 555 0142", creditScore: 762, kyc: "verified", activeLoans: 1, outstanding: 54200 },
  { id: "2", name: "Devon Park", email: "devon@contoso.example", phone: "+1 312 555 0119", creditScore: 648, kyc: "pending", activeLoans: 0, outstanding: 0 },
  { id: "3", name: "Nadia Rahman", email: "nadia@fabrikam.example", phone: "+1 404 555 0188", creditScore: 801, kyc: "verified", activeLoans: 2, outstanding: 143500 },
  { id: "4", name: "Owen Blake", email: "owen@tailspin.example", phone: "+1 206 555 0125", creditScore: 542, kyc: "unverified", activeLoans: 0, outstanding: 0 },
  { id: "5", name: "Sofia Marchetti", email: "sofia@advworks.example", phone: "+1 617 555 0163", creditScore: 705, kyc: "verified", activeLoans: 0, outstanding: 0 },
]
