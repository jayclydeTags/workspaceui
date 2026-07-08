// ── Types ──────────────────────────────────────────────────────────────────

export type CollateralType = "property" | "vehicle" | "equipment" | "securities"
export type LienStatus = "pending" | "perfected" | "released"

export interface Collateral {
  id: string
  loan: string
  description: string
  type: CollateralType
  /** Appraised market value, whole currency units. */
  value: number
  /** ISO date of the appraisal. */
  appraisedOn: string
  lien: LienStatus
}

export type CollateralDraft = Omit<Collateral, "id" | "lien">

export const COLLATERAL_TYPES: CollateralType[] = [
  "property",
  "vehicle",
  "equipment",
  "securities",
]

/** Max share of appraised value a lender will advance, per type. */
export const ADVANCE_RATE: Record<CollateralType, number> = {
  property: 0.8,
  securities: 0.7,
  equipment: 0.6,
  vehicle: 0.5,
}

/** Outstanding principal per loan — what the pledged security has to cover. */
export const LOAN_EXPOSURE: Record<string, number> = {
  "LN-2041": 54200,
  "LN-2043": 143500,
  "LN-2045": 18000,
}

export const LOANS = Object.keys(LOAN_EXPOSURE)

/** An appraisal older than this is stale and can't perfect a lien. */
export const APPRAISAL_VALID_DAYS = 365

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): CollateralDraft => ({
  loan: LOANS[0],
  description: "",
  type: "property",
  value: 0,
  appraisedOn: new Date().toISOString().slice(0, 10),
})

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

/** Lendable value after the type's haircut. */
export const lendableValue = (c: Pick<Collateral, "type" | "value">): number =>
  Math.round(c.value * ADVANCE_RATE[c.type])

/** Total lendable security on a loan; released liens no longer secure it. */
export const securedValue = (items: Collateral[], loan: string): number =>
  items
    .filter((c) => c.loan === loan && c.lien !== "released")
    .reduce((sum, c) => sum + lendableValue(c), 0)

/** Loan-to-value: exposure over lendable security; Infinity with no security. */
export function ltv(items: Collateral[], loan: string): number {
  const secured = securedValue(items, loan)
  if (secured === 0) return Infinity
  return (LOAN_EXPOSURE[loan] ?? 0) / secured
}

/** A loan is under-secured when its exposure exceeds the lendable value. */
export const isUnderSecured = (items: Collateral[], loan: string): boolean =>
  ltv(items, loan) > 1

export function appraisalAgeDays(
  c: Pick<Collateral, "appraisedOn">,
  today = new Date()
): number {
  if (!c.appraisedOn) return Infinity
  return Math.floor(
    (Date.parse(today.toISOString().slice(0, 10)) - Date.parse(c.appraisedOn)) /
      86_400_000
  )
}

export const isAppraisalStale = (
  c: Pick<Collateral, "appraisedOn">,
  today = new Date()
): boolean => appraisalAgeDays(c, today) > APPRAISAL_VALID_DAYS

/** The core rule: a lien can only be perfected on a current appraisal. */
export const canPerfect = (c: Collateral, today = new Date()): boolean =>
  c.lien === "pending" && !isAppraisalStale(c, today)

export const isValid = (d: CollateralDraft): boolean =>
  d.description.trim() !== "" && d.value > 0 && d.appraisedOn !== ""

// ── Mock data ──────────────────────────────────────────────────────────────

export const COLLATERAL: Collateral[] = [
  { id: "1", loan: "LN-2041", description: "Warehouse unit 4, Portland", type: "property", value: 90000, appraisedOn: "2026-03-12", lien: "perfected" },
  { id: "2", loan: "LN-2041", description: "Forklift fleet (3 units)", type: "equipment", value: 40000, appraisedOn: "2024-05-02", lien: "pending" },
  { id: "3", loan: "LN-2043", description: "Office floor, Atlanta", type: "property", value: 210000, appraisedOn: "2026-01-20", lien: "perfected" },
  { id: "4", loan: "LN-2045", description: "Delivery van, 2023", type: "vehicle", value: 26000, appraisedOn: "2026-05-30", lien: "pending" },
  { id: "5", loan: "LN-2045", description: "Bond portfolio", type: "securities", value: 12000, appraisedOn: "2026-06-11", lien: "released" },
]
