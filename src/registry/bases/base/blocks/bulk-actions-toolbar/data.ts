// Sample rows for the bulk-actions toolbar. Swap `Document` + `DOCUMENTS` for
// your own entity to reuse the selection + toolbar pattern.

export interface Document {
  id: string
  name: string
  size: string
  owner: string
}

export const DOCUMENTS: Document[] = [
  { id: "1", name: "Q3 Financials.xlsx", size: "1.2 MB", owner: "Sarah Chen" },
  { id: "2", name: "Brand Guidelines.pdf", size: "8.4 MB", owner: "Emma Davis" },
  { id: "3", name: "Roadmap 2026.key", size: "4.1 MB", owner: "Mike Johnson" },
  { id: "4", name: "Contract - Acme.docx", size: "220 KB", owner: "David Lee" },
  { id: "5", name: "User Research.pdf", size: "3.7 MB", owner: "Priya Nair" },
  { id: "6", name: "Logo Pack.zip", size: "12.9 MB", owner: "Alex Kim" },
]
