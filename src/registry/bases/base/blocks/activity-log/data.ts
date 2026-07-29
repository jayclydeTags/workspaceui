// ── Types ──────────────────────────────────────────────────────────────────

export type ActionType =
  "created" | "updated" | "deleted" | "viewed" | "shared" | "exported"
export type StatusType = "success" | "failed" | "pending"

export interface ActivityUser {
  id: string
  name: string
}

export const ACTIVITY_USERS: ActivityUser[] = [
  { id: "u1", name: "Alice Chen" },
  { id: "u2", name: "Bob Martinez" },
  { id: "u3", name: "Diana Park" },
  { id: "u4", name: "Eve Johnson" },
  { id: "u5", name: "Charlie Kim" },
]

export const activityUser = (id: string) =>
  ACTIVITY_USERS.find((u) => u.id === id)

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")

export interface ActivityEntry {
  id: string
  userId: string
  action: ActionType
  resource: string
  resourceType: string
  status: StatusType
  timestamp: Date
}

// ── Mock data ──────────────────────────────────────────────────────────────

const NOW = new Date()
const ago = (mins: number) => new Date(NOW.getTime() - mins * 60_000)

export const ENTRIES: ActivityEntry[] = [
  {
    id: "1",
    userId: "u1",
    action: "created",
    resource: "Q4 Report",
    resourceType: "Document",
    status: "success",
    timestamp: ago(2),
  },
  {
    id: "2",
    userId: "u2",
    action: "deleted",
    resource: "Old Backup",
    resourceType: "File",
    status: "success",
    timestamp: ago(8),
  },
  {
    id: "3",
    userId: "u3",
    action: "updated",
    resource: "Website Redesign",
    resourceType: "Project",
    status: "success",
    timestamp: ago(14),
  },
  {
    id: "4",
    userId: "u4",
    action: "exported",
    resource: "Sales Summary",
    resourceType: "Report",
    status: "pending",
    timestamp: ago(22),
  },
  {
    id: "5",
    userId: "u5",
    action: "shared",
    resource: "Invoice #1042",
    resourceType: "Invoice",
    status: "success",
    timestamp: ago(35),
  },
  {
    id: "6",
    userId: "u1",
    action: "viewed",
    resource: "Fix navbar bug",
    resourceType: "Task",
    status: "success",
    timestamp: ago(41),
  },
  {
    id: "7",
    userId: "u2",
    action: "updated",
    resource: "john@acme.com",
    resourceType: "User",
    status: "failed",
    timestamp: ago(56),
  },
  {
    id: "8",
    userId: "u3",
    action: "created",
    resource: "Sprint 12 Plan",
    resourceType: "Document",
    status: "success",
    timestamp: ago(72),
  },
  {
    id: "9",
    userId: "u4",
    action: "deleted",
    resource: "Draft Campaign",
    resourceType: "Document",
    status: "success",
    timestamp: ago(88),
  },
  {
    id: "10",
    userId: "u5",
    action: "exported",
    resource: "Monthly KPIs",
    resourceType: "Report",
    status: "failed",
    timestamp: ago(104),
  },
  {
    id: "11",
    userId: "u1",
    action: "shared",
    resource: "Onboarding Guide",
    resourceType: "Document",
    status: "success",
    timestamp: ago(130),
  },
  {
    id: "12",
    userId: "u2",
    action: "created",
    resource: "API Token",
    resourceType: "Resource",
    status: "success",
    timestamp: ago(158),
  },
  {
    id: "13",
    userId: "u3",
    action: "viewed",
    resource: "Admin Settings",
    resourceType: "Settings",
    status: "success",
    timestamp: ago(200),
  },
  {
    id: "14",
    userId: "u4",
    action: "updated",
    resource: "Q3 Report",
    resourceType: "Document",
    status: "pending",
    timestamp: ago(240),
  },
  {
    id: "15",
    userId: "u5",
    action: "deleted",
    resource: "Test Environment",
    resourceType: "Project",
    status: "success",
    timestamp: ago(310),
  },
  {
    id: "16",
    userId: "u1",
    action: "exported",
    resource: "User List",
    resourceType: "Report",
    status: "success",
    timestamp: ago(380),
  },
  {
    id: "17",
    userId: "u2",
    action: "created",
    resource: "Bug Report #88",
    resourceType: "Task",
    status: "success",
    timestamp: ago(440),
  },
  {
    id: "18",
    userId: "u3",
    action: "shared",
    resource: "Brand Assets",
    resourceType: "File",
    status: "failed",
    timestamp: ago(510),
  },
]
