// ── Types ──────────────────────────────────────────────────────────────────

export type LeadStage = "new" | "contacted" | "qualified" | "unqualified"
export type LeadSource = "web" | "referral" | "event" | "outbound"

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  source: LeadSource
  /** 0–100. */
  score: number
  stage: LeadStage
}

export type LeadDraft = Omit<Lead, "id">

export const LEAD_STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
]

export const LEAD_SOURCES: LeadSource[] = [
  "web",
  "referral",
  "event",
  "outbound",
]

/** At or above this score a lead is worth a call today. */
export const HOT_SCORE = 75

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): LeadDraft => ({
  name: "",
  company: "",
  email: "",
  source: "web",
  score: 0,
  stage: "new",
})

export const isValid = (d: LeadDraft): boolean =>
  d.name.trim() !== "" &&
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) &&
  d.score >= 0 &&
  d.score <= 100

export const isHot = (l: Lead): boolean =>
  l.score >= HOT_SCORE && l.stage !== "unqualified"

/** Share of worked leads that reached `qualified`, 0–100. */
export function qualificationRate(leads: Lead[]): number {
  const worked = leads.filter((l) => l.stage !== "new")
  if (worked.length === 0) return 0
  const qualified = worked.filter((l) => l.stage === "qualified").length
  return Math.round((qualified / worked.length) * 100)
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const LEADS: Lead[] = [
  { id: "1", name: "Iris Muller", company: "Northwind", email: "iris@northwind.example", source: "referral", score: 88, stage: "qualified" },
  { id: "2", name: "Devon Park", company: "Contoso", email: "devon@contoso.example", source: "web", score: 41, stage: "contacted" },
  { id: "3", name: "Nadia Rahman", company: "Fabrikam", email: "nadia@fabrikam.example", source: "event", score: 79, stage: "contacted" },
  { id: "4", name: "Owen Blake", company: "Tailspin", email: "owen@tailspin.example", source: "outbound", score: 12, stage: "unqualified" },
  { id: "5", name: "Sofia Marchetti", company: "Adventure Works", email: "sofia@advworks.example", source: "web", score: 64, stage: "new" },
]
