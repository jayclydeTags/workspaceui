// ── Types ──────────────────────────────────────────────────────────────────

export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense"
export type AccountStatus = "active" | "archived"

export interface Account {
  id: string
  code: string
  name: string
  type: AccountType
  balance: number
  status: AccountStatus
}

export type AccountDraft = Omit<Account, "id" | "balance">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  asset: "Asset",
  liability: "Liability",
  equity: "Equity",
  revenue: "Revenue",
  expense: "Expense",
}

export const emptyDraft = (): AccountDraft => ({
  code: "",
  name: "",
  type: "asset",
  status: "active",
})

export const isValid = (d: AccountDraft): boolean =>
  d.code.trim() !== "" && d.name.trim() !== ""

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ── Mock data ──────────────────────────────────────────────────────────────

export const ACCOUNTS: Account[] = [
  { id: "1", code: "1000", name: "Cash", type: "asset", balance: 45000, status: "active" },
  { id: "2", code: "1100", name: "Accounts Receivable", type: "asset", balance: 18500, status: "active" },
  { id: "3", code: "1500", name: "Equipment", type: "asset", balance: 32000, status: "active" },
  { id: "4", code: "2000", name: "Accounts Payable", type: "liability", balance: 12300, status: "active" },
  { id: "5", code: "2100", name: "Accrued Liabilities", type: "liability", balance: 4200, status: "active" },
  { id: "6", code: "3000", name: "Owner's Equity", type: "equity", balance: 75000, status: "active" },
  { id: "7", code: "4000", name: "Sales Revenue", type: "revenue", balance: 210000, status: "active" },
  { id: "8", code: "4100", name: "Service Revenue", type: "revenue", balance: 54000, status: "active" },
  { id: "9", code: "5000", name: "Cost of Goods Sold", type: "expense", balance: 98000, status: "active" },
  { id: "10", code: "5100", name: "Operating Expenses", type: "expense", balance: 41000, status: "active" },
  { id: "11", code: "5900", name: "Miscellaneous Expense", type: "expense", balance: 0, status: "archived" },
]
