// ── Types ──────────────────────────────────────────────────────────────────

export type EntryStatus = "draft" | "posted"

export interface JournalLine {
  id: string
  account: string
  debit: number
  credit: number
}

export interface JournalEntry {
  id: string
  date: string // ISO date
  reference: string
  memo: string
  lines: JournalLine[]
  status: EntryStatus
}

export type JournalEntryDraft = Omit<JournalEntry, "id">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const ACCOUNTS = [
  "1000 Cash",
  "1100 Accounts Receivable",
  "1500 Equipment",
  "2000 Accounts Payable",
  "3000 Owner's Equity",
  "4000 Sales Revenue",
  "5000 Cost of Goods Sold",
  "5100 Operating Expenses",
]

export const emptyLine = (): JournalLine => ({
  id: crypto.randomUUID(),
  account: "",
  debit: 0,
  credit: 0,
})

export const emptyDraft = (): JournalEntryDraft => ({
  date: new Date().toISOString().slice(0, 10),
  reference: "",
  memo: "",
  lines: [emptyLine(), emptyLine()],
  status: "draft",
})

export const totalDebits = (lines: JournalLine[]) =>
  lines.reduce((sum, l) => sum + l.debit, 0)

export const totalCredits = (lines: JournalLine[]) =>
  lines.reduce((sum, l) => sum + l.credit, 0)

export const isBalanced = (lines: JournalLine[]) => {
  const debits = totalDebits(lines)
  const credits = totalCredits(lines)
  return debits > 0 && debits === credits
}

export const isValid = (d: JournalEntryDraft): boolean =>
  d.reference.trim() !== "" &&
  d.lines.every((l) => l.account.trim() !== "") &&
  isBalanced(d.lines)

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ── Mock data ──────────────────────────────────────────────────────────────

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    date: "2026-06-01",
    reference: "JE-1001",
    memo: "June rent payment",
    status: "posted",
    lines: [
      { id: "1a", account: "5100 Operating Expenses", debit: 3200, credit: 0 },
      { id: "1b", account: "1000 Cash", debit: 0, credit: 3200 },
    ],
  },
  {
    id: "2",
    date: "2026-06-05",
    reference: "JE-1002",
    memo: "Sale on account",
    status: "posted",
    lines: [
      { id: "2a", account: "1100 Accounts Receivable", debit: 5400, credit: 0 },
      { id: "2b", account: "4000 Sales Revenue", debit: 0, credit: 5400 },
    ],
  },
  {
    id: "3",
    date: "2026-06-12",
    reference: "JE-1003",
    memo: "Equipment purchase",
    status: "draft",
    lines: [
      { id: "3a", account: "1500 Equipment", debit: 12000, credit: 0 },
      { id: "3b", account: "2000 Accounts Payable", debit: 0, credit: 12000 },
    ],
  },
]
