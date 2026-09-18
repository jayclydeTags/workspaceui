// ── Types ──────────────────────────────────────────────────────────────────

export type Period = "day" | "week" | "month"

export type CategoryId =
  "content-creation" | "research" | "content-optimization" | "reporting"

export interface Category {
  id: CategoryId
  label: string
  /** Fill for the usage-bar segment and the legend/badge dot. */
  swatch: string
}

export interface UsageStats {
  runs: number
  hoursSaved: number
  credits: number
}

export interface Agent extends UsageStats {
  id: string
  name: string
  category: CategoryId
}

export interface PowerUser extends UsageStats {
  id: string
  name: string
  email: string
  team: string
  topAgent: string
  category: CategoryId
}

export interface Plan {
  name: string
  /** Monthly credit allowance. */
  limit: number
  resetsOn: string
}

// ── Reference data ─────────────────────────────────────────────────────────

// Categorical palette: the theme's chart tokens are greyscale, which can't
// separate four stacked segments. Every use pairs the color with a text label.
export const CATEGORIES: Category[] = [
  { id: "content-creation", label: "Content creation", swatch: "bg-blue-500" },
  { id: "research", label: "Research", swatch: "bg-orange-500" },
  {
    id: "content-optimization",
    label: "Content optimization",
    swatch: "bg-violet-500",
  },
  { id: "reporting", label: "Reporting & monitoring", swatch: "bg-lime-500" },
]

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category])
) as Record<CategoryId, Category>

export const PLAN: Plan = {
  name: "Enterprise plan",
  limit: 600_000,
  resetsOn: "1 Oct",
}

export const PERIODS: { value: Period; label: string; phrase: string }[] = [
  { value: "day", label: "Day", phrase: "today" },
  { value: "week", label: "Week", phrase: "this week" },
  { value: "month", label: "Month", phrase: "this month" },
]

// ── Mock data ──────────────────────────────────────────────────────────────

// Month-to-date figures. `momentum` skews how much of an agent's usage is
// recent, so the Day and Week views aren't just the month divided down.
const AGENT_SEED: (Agent & { momentum: number })[] = [
  {
    id: "faq-generator",
    name: "FAQ generator",
    category: "content-creation",
    runs: 990,
    hoursSaved: 198,
    credits: 19_517,
    momentum: 1.1,
  },
  {
    id: "blog-post-drafter",
    name: "Blog post drafter",
    category: "content-creation",
    runs: 2_040,
    hoursSaved: 612,
    credits: 48_210,
    momentum: 0.9,
  },
  {
    id: "social-caption-writer",
    name: "Social caption writer",
    category: "content-creation",
    runs: 3_110,
    hoursSaved: 311,
    credits: 22_480,
    momentum: 1.3,
  },
  {
    id: "product-description-writer",
    name: "Product description writer",
    category: "content-creation",
    runs: 1_520,
    hoursSaved: 380,
    credits: 31_905,
    momentum: 0.8,
  },
  {
    id: "email-sequence-builder",
    name: "Email sequence builder",
    category: "content-creation",
    runs: 860,
    hoursSaved: 215,
    credits: 20_788,
    momentum: 1,
  },
  {
    id: "competitor-teardown",
    name: "Competitor teardown",
    category: "research",
    runs: 1_245,
    hoursSaved: 312,
    credits: 24_832,
    momentum: 1.2,
  },
  {
    id: "exit-opportunity-finder",
    name: "Exit opportunity finder",
    category: "research",
    runs: 2_110,
    hoursSaved: 540,
    credits: 33_200,
    momentum: 0.7,
  },
  {
    id: "pdf-keyword-scanner",
    name: "PDF keyword scanner",
    category: "research",
    runs: 1_840,
    hoursSaved: 470,
    credits: 27_430,
    momentum: 1,
  },
  {
    id: "market-sizing-analyst",
    name: "Market sizing analyst",
    category: "research",
    runs: 1_380,
    hoursSaved: 690,
    credits: 45_118,
    momentum: 1.4,
  },
  {
    id: "interview-synthesizer",
    name: "Customer interview synthesizer",
    category: "research",
    runs: 960,
    hoursSaved: 505,
    credits: 37_820,
    momentum: 0.9,
  },
  {
    id: "content-impact-scoring",
    name: "Content impact scoring",
    category: "content-optimization",
    runs: 3_430,
    hoursSaved: 1_020,
    credits: 50_120,
    momentum: 1.1,
  },
  {
    id: "seo-meta-optimizer",
    name: "SEO meta optimizer",
    category: "content-optimization",
    runs: 2_760,
    hoursSaved: 368,
    credits: 28_640,
    momentum: 0.8,
  },
  {
    id: "readability-editor",
    name: "Readability editor",
    category: "content-optimization",
    runs: 1_290,
    hoursSaved: 172,
    credits: 17_740,
    momentum: 1,
  },
  {
    id: "weekly-kpi-digest",
    name: "Weekly KPI digest",
    category: "reporting",
    runs: 620,
    hoursSaved: 248,
    credits: 21_380,
    momentum: 0.6,
  },
  {
    id: "brand-mention-monitor",
    name: "Brand mention monitor",
    category: "reporting",
    runs: 4_120,
    hoursSaved: 412,
    credits: 39_860,
    momentum: 1.2,
  },
  {
    id: "churn-risk-alerts",
    name: "Churn risk alerts",
    category: "reporting",
    runs: 1_050,
    hoursSaved: 210,
    credits: 18_260,
    momentum: 1,
  },
]

const USER_SEED: (PowerUser & { momentum: number })[] = [
  {
    id: "u-1",
    name: "Maya Chen",
    email: "maya@northwind.io",
    team: "Growth",
    topAgent: "Market sizing analyst",
    category: "research",
    runs: 1_840,
    hoursSaved: 612,
    credits: 58_420,
    momentum: 1.2,
  },
  {
    id: "u-2",
    name: "Daniel Okafor",
    email: "daniel@northwind.io",
    team: "Content",
    topAgent: "Blog post drafter",
    category: "content-creation",
    runs: 2_310,
    hoursSaved: 540,
    credits: 51_900,
    momentum: 0.9,
  },
  {
    id: "u-3",
    name: "Priya Raman",
    email: "priya@northwind.io",
    team: "SEO",
    topAgent: "Content impact scoring",
    category: "content-optimization",
    runs: 2_960,
    hoursSaved: 705,
    credits: 47_380,
    momentum: 1.1,
  },
  {
    id: "u-4",
    name: "Lucas Moreau",
    email: "lucas@northwind.io",
    team: "Strategy",
    topAgent: "Competitor teardown",
    category: "research",
    runs: 1_120,
    hoursSaved: 380,
    credits: 36_240,
    momentum: 1.3,
  },
  {
    id: "u-5",
    name: "Sofia Alvarez",
    email: "sofia@northwind.io",
    team: "Brand",
    topAgent: "Brand mention monitor",
    category: "reporting",
    runs: 3_050,
    hoursSaved: 290,
    credits: 29_810,
    momentum: 1,
  },
  {
    id: "u-6",
    name: "Kenji Watanabe",
    email: "kenji@northwind.io",
    team: "Content",
    topAgent: "Social caption writer",
    category: "content-creation",
    runs: 2_480,
    hoursSaved: 248,
    credits: 18_760,
    momentum: 1.4,
  },
  {
    id: "u-7",
    name: "Amara Nwosu",
    email: "amara@northwind.io",
    team: "Customer Success",
    topAgent: "Churn risk alerts",
    category: "reporting",
    runs: 870,
    hoursSaved: 174,
    credits: 15_120,
    momentum: 0.8,
  },
  {
    id: "u-8",
    name: "Tomás Lindqvist",
    email: "tomas@northwind.io",
    team: "Product",
    topAgent: "Customer interview synthesizer",
    category: "research",
    runs: 540,
    hoursSaved: 286,
    credits: 21_650,
    momentum: 0.7,
  },
]

// Share of a month-to-date figure that falls in each period, before momentum.
const PERIOD_FRACTION: Record<Period, number> = {
  day: 1 / 30,
  week: 7 / 30,
  month: 1,
}

function scale<T extends UsageStats & { momentum: number }>(
  row: T,
  period: Period
): Omit<T, "momentum"> {
  const { momentum, ...rest } = row
  if (period === "month") return rest
  // Squaring for a single day exaggerates momentum, as daily usage is spikier.
  const factor =
    PERIOD_FRACTION[period] * (period === "day" ? momentum ** 2 : momentum)
  return {
    ...rest,
    runs: Math.round(row.runs * factor),
    hoursSaved: Math.round(row.hoursSaved * factor),
    credits: Math.round(row.credits * factor),
  }
}

export function getAgents(period: Period): Agent[] {
  return AGENT_SEED.map((row) => scale(row, period)).sort(
    (a, b) => b.credits - a.credits
  )
}

export function getPowerUsers(period: Period): PowerUser[] {
  return USER_SEED.map((row) => scale(row, period)).sort(
    (a, b) => b.credits - a.credits
  )
}

export interface PeriodSummary {
  used: number
  byCategory: { category: Category; credits: number }[]
  runs: number
  hoursSaved: number
  agentsUsed: number
}

/** Totals for a period, derived from the agent rows so the bar and table agree. */
export function summarize(agents: Agent[]): PeriodSummary {
  const used = agents.reduce((sum, agent) => sum + agent.credits, 0)
  return {
    used,
    byCategory: CATEGORIES.map((category) => ({
      category,
      credits: agents
        .filter((agent) => agent.category === category.id)
        .reduce((sum, agent) => sum + agent.credits, 0),
    })),
    runs: agents.reduce((sum, agent) => sum + agent.runs, 0),
    hoursSaved: agents.reduce((sum, agent) => sum + agent.hoursSaved, 0),
    agentsUsed: agents.filter((agent) => agent.runs > 0).length,
  }
}

// ── Formatting ─────────────────────────────────────────────────────────────

const integer = new Intl.NumberFormat("en-US")
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const oneDecimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const formatNumber = (value: number) => integer.format(value)
export const formatCompact = (value: number) =>
  compact.format(value).toLowerCase()
export const formatDecimal = (value: number) => oneDecimal.format(value)
export const formatShare = (part: number, whole: number) =>
  `${oneDecimal.format(whole === 0 ? 0 : (part / whole) * 100)}%`
