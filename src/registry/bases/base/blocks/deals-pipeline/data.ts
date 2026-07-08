// ── Types ──────────────────────────────────────────────────────────────────

export type DealStage =
  | "qualify"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"

export interface Deal {
  id: string
  name: string
  account: string
  owner: string
  /** Whole currency units. */
  value: number
  /** ISO date. */
  closeDate: string
  stage: DealStage
}

export type DealDraft = Omit<Deal, "id">

export const STAGE_COLUMNS: DealStage[] = [
  "qualify",
  "proposal",
  "negotiation",
  "won",
  "lost",
]

export const STAGE_LABEL: Record<DealStage, string> = {
  qualify: "Qualify",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
}

/** Rough odds of closing, by stage — drives the weighted forecast. */
export const STAGE_PROBABILITY: Record<DealStage, number> = {
  qualify: 0.2,
  proposal: 0.5,
  negotiation: 0.8,
  won: 1,
  lost: 0,
}

export const isClosed = (stage: DealStage): boolean =>
  stage === "won" || stage === "lost"

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): DealDraft => ({
  name: "",
  account: "",
  owner: "",
  value: 0,
  closeDate: "",
  stage: "qualify",
})

export const isValid = (d: DealDraft): boolean =>
  d.name.trim() !== "" && d.value > 0 && d.closeDate !== ""

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

/** Sum of open-deal value weighted by each stage's probability. */
export function weightedForecast(deals: Deal[]): number {
  return Math.round(
    deals
      .filter((d) => !isClosed(d.stage))
      .reduce((sum, d) => sum + d.value * STAGE_PROBABILITY[d.stage], 0)
  )
}

/** Won / (won + lost), 0–100; 0 when nothing has closed yet. */
export function winRate(deals: Deal[]): number {
  const closed = deals.filter((d) => isClosed(d.stage))
  if (closed.length === 0) return 0
  const won = closed.filter((d) => d.stage === "won").length
  return Math.round((won / closed.length) * 100)
}

export const stageValue = (deals: Deal[]): number =>
  deals.reduce((sum, d) => sum + d.value, 0)

// ── Mock data ──────────────────────────────────────────────────────────────

export const DEALS: Deal[] = [
  { id: "1", name: "Platform renewal", account: "Northwind", owner: "Ava Chen", value: 180000, closeDate: "2026-09-30", stage: "negotiation" },
  { id: "2", name: "Warehouse add-on", account: "Northwind", owner: "Ava Chen", value: 45000, closeDate: "2026-08-14", stage: "proposal" },
  { id: "3", name: "Pilot expansion", account: "Contoso", owner: "Marcus Webb", value: 60000, closeDate: "2026-10-01", stage: "qualify" },
  { id: "4", name: "Analytics module", account: "Fabrikam", owner: "Priya Nair", value: 32000, closeDate: "2026-07-31", stage: "proposal" },
  { id: "5", name: "Seat expansion", account: "Tailspin", owner: "Tom Okafor", value: 12000, closeDate: "2026-06-30", stage: "won" },
  { id: "6", name: "Legacy migration", account: "Contoso", owner: "Marcus Webb", value: 90000, closeDate: "2026-06-15", stage: "lost" },
]
