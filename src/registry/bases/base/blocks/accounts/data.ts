// ── Types ──────────────────────────────────────────────────────────────────

export type AccountTier = "strategic" | "mid-market" | "smb"
export type AccountHealth = "healthy" | "watch" | "at-risk"

export interface Account {
  id: string
  name: string
  industry: string
  owner: string
  tier: AccountTier
  /** Annual recurring revenue, in whole currency units. */
  arr: number
  /** ISO date of the last logged touchpoint, or "" if never. */
  lastContact: string
  openDeals: number
}

export type AccountDraft = Omit<Account, "id" | "openDeals">

export const TIERS: AccountTier[] = ["strategic", "mid-market", "smb"]

/** No touchpoint in this many days and the account slides. */
export const STALE_DAYS = 30
export const AT_RISK_DAYS = 60

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): AccountDraft => ({
  name: "",
  industry: "",
  owner: "",
  tier: "smb",
  arr: 0,
  lastContact: "",
})

export const isValid = (d: AccountDraft): boolean =>
  d.name.trim() !== "" && d.arr >= 0

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

export function daysSinceContact(
  account: Pick<Account, "lastContact">,
  today = new Date()
): number {
  if (!account.lastContact) return Infinity
  return Math.floor(
    (Date.parse(today.toISOString().slice(0, 10)) -
      Date.parse(account.lastContact)) /
      86_400_000
  )
}

/** Health is derived from recency of contact, never stored. */
export function health(account: Account, today = new Date()): AccountHealth {
  const days = daysSinceContact(account, today)
  if (days > AT_RISK_DAYS) return "at-risk"
  if (days > STALE_DAYS) return "watch"
  return "healthy"
}

export const totalArr = (accounts: Account[]): number =>
  accounts.reduce((sum, a) => sum + a.arr, 0)

// ── Mock data ──────────────────────────────────────────────────────────────

export const ACCOUNTS: Account[] = [
  { id: "1", name: "Northwind", industry: "Logistics", owner: "Ava Chen", tier: "strategic", arr: 480000, lastContact: "2026-07-02", openDeals: 3 },
  { id: "2", name: "Contoso", industry: "Manufacturing", owner: "Marcus Webb", tier: "mid-market", arr: 120000, lastContact: "2026-06-01", openDeals: 1 },
  { id: "3", name: "Fabrikam", industry: "Software", owner: "Priya Nair", tier: "mid-market", arr: 96000, lastContact: "2026-04-18", openDeals: 0 },
  { id: "4", name: "Tailspin", industry: "Retail", owner: "Tom Okafor", tier: "smb", arr: 18000, lastContact: "2026-07-06", openDeals: 2 },
  { id: "5", name: "Adventure Works", industry: "Travel", owner: "Ava Chen", tier: "smb", arr: 24000, lastContact: "", openDeals: 0 },
]
