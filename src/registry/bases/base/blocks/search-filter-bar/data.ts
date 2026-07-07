// Sample rows for the search + filter bar. Swap `Member` + `MEMBERS` and the
// filter option lists below for your own entity to reuse the bar.

export type Role = "admin" | "editor" | "viewer"
export type Status = "active" | "invited" | "suspended"

export interface Member {
  id: string
  name: string
  email: string
  role: Role
  status: Status
}

export const ROLES: Role[] = ["admin", "editor", "viewer"]
export const STATUSES: Status[] = ["active", "invited", "suspended"]

export const MEMBERS: Member[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@acme.com", role: "admin", status: "active" },
  { id: "2", name: "Mike Johnson", email: "mike@acme.com", role: "editor", status: "active" },
  { id: "3", name: "Emma Davis", email: "emma@acme.com", role: "editor", status: "invited" },
  { id: "4", name: "David Lee", email: "david@acme.com", role: "viewer", status: "suspended" },
  { id: "5", name: "Priya Nair", email: "priya@acme.com", role: "admin", status: "active" },
  { id: "6", name: "Alex Kim", email: "alex@acme.com", role: "viewer", status: "invited" },
  { id: "7", name: "Nina Patel", email: "nina@acme.com", role: "editor", status: "active" },
  { id: "8", name: "Omar Said", email: "omar@acme.com", role: "viewer", status: "suspended" },
]

export interface Filters {
  query: string
  role: Role | "all"
  status: Status | "all"
}

export const emptyFilters: Filters = { query: "", role: "all", status: "all" }

export function filterMembers(members: Member[], f: Filters): Member[] {
  const q = f.query.trim().toLowerCase()
  return members.filter(
    (m) =>
      (q === "" ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)) &&
      (f.role === "all" || m.role === f.role) &&
      (f.status === "all" || m.status === f.status)
  )
}
