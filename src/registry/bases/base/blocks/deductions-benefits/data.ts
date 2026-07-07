// ── Types ──────────────────────────────────────────────────────────────────

export type DeductionType = "deduction" | "benefit"
export type Calculation = "fixed" | "percent"
export type DeductionStatus = "active" | "inactive"

export interface DeductionBenefit {
  id: string
  name: string
  type: DeductionType
  calculation: Calculation
  amount: number // dollars per pay period if fixed, % of gross if percent
  preTax: boolean
  enrolled: number
  status: DeductionStatus
}

export type DeductionBenefitDraft = Omit<DeductionBenefit, "id" | "enrolled">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): DeductionBenefitDraft => ({
  name: "",
  type: "deduction",
  calculation: "fixed",
  amount: 0,
  preTax: true,
  status: "active",
})

export const isValid = (d: DeductionBenefitDraft): boolean =>
  d.name.trim() !== "" && d.amount > 0

export const formatAmount = (d: Pick<DeductionBenefit, "calculation" | "amount">) =>
  d.calculation === "fixed"
    ? `$${d.amount.toFixed(2)} / pay period`
    : `${d.amount}% of gross`

// ── Mock data ──────────────────────────────────────────────────────────────

export const DEDUCTIONS_BENEFITS: DeductionBenefit[] = [
  { id: "1", name: "Health Insurance", type: "benefit", calculation: "fixed", amount: 145.5, preTax: true, enrolled: 38, status: "active" },
  { id: "2", name: "401(k)", type: "benefit", calculation: "percent", amount: 5, preTax: true, enrolled: 29, status: "active" },
  { id: "3", name: "Dental Insurance", type: "benefit", calculation: "fixed", amount: 22, preTax: true, enrolled: 31, status: "active" },
  { id: "4", name: "Vision Insurance", type: "benefit", calculation: "fixed", amount: 8.5, preTax: true, enrolled: 24, status: "active" },
  { id: "5", name: "HSA Contribution", type: "benefit", calculation: "fixed", amount: 75, preTax: true, enrolled: 12, status: "active" },
  { id: "6", name: "Wage Garnishment", type: "deduction", calculation: "fixed", amount: 200, preTax: false, enrolled: 2, status: "active" },
  { id: "7", name: "Life Insurance", type: "benefit", calculation: "fixed", amount: 6, preTax: false, enrolled: 18, status: "inactive" },
]
