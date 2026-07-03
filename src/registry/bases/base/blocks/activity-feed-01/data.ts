// ── Types ──────────────────────────────────────────────────────────────────

export type ActivityType = "updated" | "created" | "assigned" | "commented" | "deleted"

export interface ActivityEntry {
  id: string
  user: string
  avatarUrl?: string
  type: ActivityType
  title: string
  detail?: string
  timestamp: Date
}

// ── Mock data ──────────────────────────────────────────────────────────────

const NOW = new Date()
const ago = (hours: number) => new Date(NOW.getTime() - hours * 60 * 60_000)

export const ENTRIES: ActivityEntry[] = [
  {
    id: "1",
    user: "Sarah Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
    type: "updated",
    title: "Sarah Chen updated Premium Headphones",
    detail: "Changed price from $399 to $349",
    timestamp: ago(2),
  },
  {
    id: "2",
    user: "Mike Johnson",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop",
    type: "created",
    title: "Mike Johnson created Wireless Mouse",
    timestamp: ago(4),
  },
  {
    id: "3",
    user: "Emma Davis",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop",
    type: "assigned",
    title: "Emma Davis assigned Order #1234",
    detail: "Assigned to David Lee",
    timestamp: ago(6),
  },
  {
    id: "4",
    user: "David Lee",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop",
    type: "commented",
    title: "David Lee commented on Design Review",
    detail: "Looks great! Ready to proceed.",
    timestamp: ago(25),
  },
  {
    id: "5",
    user: "Admin System",
    type: "deleted",
    title: "Admin System deleted Old Product SKU-123",
    timestamp: ago(48),
  },
]

export const STATS = {
  today: 23,
  thisWeek: 156,
  thisMonth: 847,
}
