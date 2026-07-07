// ── Types ──────────────────────────────────────────────────────────────────

// Audit log answers "who changed what field" — distinct from an activity feed,
// each row records a single field's before → after value.
export type AuditAction = "created" | "updated" | "deleted"

export interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  actorInitials: string
  record: string
  field: string
  before: string | null
  after: string | null
  action: AuditAction
}

export const ALL_ACTIONS: AuditAction[] = ["created", "updated", "deleted"]

// ── Mock data ──────────────────────────────────────────────────────────────

export const ENTRIES: AuditEntry[] = [
  { id: "1", timestamp: "2026-07-07 14:32", actor: "Sarah Chen", actorInitials: "SC", record: "Invoice #1024", field: "status", before: "draft", after: "sent", action: "updated" },
  { id: "2", timestamp: "2026-07-07 14:20", actor: "Mike Johnson", actorInitials: "MJ", record: "Customer Acme Co.", field: "credit_limit", before: "$10,000", after: "$25,000", action: "updated" },
  { id: "3", timestamp: "2026-07-07 13:58", actor: "Emma Davis", actorInitials: "ED", record: "Product SKU-4471", field: "—", before: null, after: "Wireless Mouse", action: "created" },
  { id: "4", timestamp: "2026-07-07 11:47", actor: "David Lee", actorInitials: "DL", record: "Purchase Order #88", field: "approver", before: "unassigned", after: "Priya Nair", action: "updated" },
  { id: "5", timestamp: "2026-07-07 10:15", actor: "Priya Nair", actorInitials: "PN", record: "User bob@acme.co", field: "role", before: "editor", after: "admin", action: "updated" },
  { id: "6", timestamp: "2026-07-06 17:02", actor: "Sarah Chen", actorInitials: "SC", record: "Discount SUMMER25", field: "—", before: "10% off orders", after: null, action: "deleted" },
  { id: "7", timestamp: "2026-07-06 16:30", actor: "Mike Johnson", actorInitials: "MJ", record: "Invoice #1019", field: "due_date", before: "2026-07-15", after: "2026-07-30", action: "updated" },
  { id: "8", timestamp: "2026-07-06 15:11", actor: "Emma Davis", actorInitials: "ED", record: "Department Research", field: "manager", before: "vacant", after: "Priya Nair", action: "updated" },
  { id: "9", timestamp: "2026-07-06 09:44", actor: "David Lee", actorInitials: "DL", record: "Warehouse WH-02", field: "—", before: null, after: "Portland DC", action: "created" },
  { id: "10", timestamp: "2026-07-05 18:20", actor: "Priya Nair", actorInitials: "PN", record: "Contract #C-330", field: "value", before: "$48,000", after: "$52,500", action: "updated" },
]
