// ── Types ──────────────────────────────────────────────────────────────────

export type NotificationType = "mention" | "comment" | "approval" | "system"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  time: string
  read: boolean
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const NOTIFICATIONS: AppNotification[] = [
  { id: "1", type: "mention", title: "Sarah Chen mentioned you", body: "…can you review the Q3 numbers on Invoice #1024?", time: "2m ago", read: false },
  { id: "2", type: "approval", title: "Purchase Order #88 needs approval", body: "Mike Johnson requested your sign-off ($12,400).", time: "18m ago", read: false },
  { id: "3", type: "comment", title: "New comment on Acme Co.", body: "Emma Davis: Left a note about the renewal terms.", time: "1h ago", read: false },
  { id: "4", type: "system", title: "Export ready", body: "Your customers.csv export finished — 2,481 rows.", time: "3h ago", read: true },
  { id: "5", type: "approval", title: "Time-off request approved", body: "David Lee approved your July 10–12 leave.", time: "Yesterday", read: true },
  { id: "6", type: "mention", title: "Priya Nair mentioned you", body: "…assigned SKU-4471 to your queue.", time: "Yesterday", read: true },
  { id: "7", type: "system", title: "Password changed", body: "Your account password was updated successfully.", time: "2d ago", read: true },
]
