// ── Types ──────────────────────────────────────────────────────────────────

export type ActionType = "created" | "updated" | "deleted" | "viewed" | "shared" | "exported"
export type StatusType = "success" | "failed" | "pending"

export interface ActivityEntry {
  id: string
  user: string
  initials: string
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
  { id: "1",  user: "Alice Chen",   initials: "AC", action: "created",  resource: "Q4 Report",        resourceType: "Document", status: "success", timestamp: ago(2)   },
  { id: "2",  user: "Bob Martinez", initials: "BM", action: "deleted",  resource: "Old Backup",       resourceType: "File",     status: "success", timestamp: ago(8)   },
  { id: "3",  user: "Diana Park",   initials: "DP", action: "updated",  resource: "Website Redesign", resourceType: "Project",  status: "success", timestamp: ago(14)  },
  { id: "4",  user: "Eve Johnson",  initials: "EJ", action: "exported", resource: "Sales Summary",    resourceType: "Report",   status: "pending", timestamp: ago(22)  },
  { id: "5",  user: "Charlie Kim",  initials: "CK", action: "shared",   resource: "Invoice #1042",    resourceType: "Invoice",  status: "success", timestamp: ago(35)  },
  { id: "6",  user: "Alice Chen",   initials: "AC", action: "viewed",   resource: "Fix navbar bug",   resourceType: "Task",     status: "success", timestamp: ago(41)  },
  { id: "7",  user: "Bob Martinez", initials: "BM", action: "updated",  resource: "john@acme.com",    resourceType: "User",     status: "failed",  timestamp: ago(56)  },
  { id: "8",  user: "Diana Park",   initials: "DP", action: "created",  resource: "Sprint 12 Plan",   resourceType: "Document", status: "success", timestamp: ago(72)  },
  { id: "9",  user: "Eve Johnson",  initials: "EJ", action: "deleted",  resource: "Draft Campaign",   resourceType: "Document", status: "success", timestamp: ago(88)  },
  { id: "10", user: "Charlie Kim",  initials: "CK", action: "exported", resource: "Monthly KPIs",     resourceType: "Report",   status: "failed",  timestamp: ago(104) },
  { id: "11", user: "Alice Chen",   initials: "AC", action: "shared",   resource: "Onboarding Guide", resourceType: "Document", status: "success", timestamp: ago(130) },
  { id: "12", user: "Bob Martinez", initials: "BM", action: "created",  resource: "API Token",        resourceType: "Resource", status: "success", timestamp: ago(158) },
  { id: "13", user: "Diana Park",   initials: "DP", action: "viewed",   resource: "Admin Settings",   resourceType: "Settings", status: "success", timestamp: ago(200) },
  { id: "14", user: "Eve Johnson",  initials: "EJ", action: "updated",  resource: "Q3 Report",        resourceType: "Document", status: "pending", timestamp: ago(240) },
  { id: "15", user: "Charlie Kim",  initials: "CK", action: "deleted",  resource: "Test Environment", resourceType: "Project",  status: "success", timestamp: ago(310) },
  { id: "16", user: "Alice Chen",   initials: "AC", action: "exported", resource: "User List",        resourceType: "Report",   status: "success", timestamp: ago(380) },
  { id: "17", user: "Bob Martinez", initials: "BM", action: "created",  resource: "Bug Report #88",   resourceType: "Task",     status: "success", timestamp: ago(440) },
  { id: "18", user: "Diana Park",   initials: "DP", action: "shared",   resource: "Brand Assets",     resourceType: "File",     status: "failed",  timestamp: ago(510) },
]
