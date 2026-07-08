// ── Types ──────────────────────────────────────────────────────────────────

export type TeamRole = "lead" | "member" | "viewer"

export interface Member {
  id: string
  name: string
  email: string
  role: TeamRole
  /** Weekly hours committed to this project. */
  allocation: number
}

export type MemberDraft = Omit<Member, "id">

export const TEAM_ROLES: TeamRole[] = ["lead", "member", "viewer"]

/** A full week. Allocating more than this is over-committing the person. */
export const FULL_WEEK_HOURS = 40

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): MemberDraft => ({
  name: "",
  email: "",
  role: "member",
  allocation: 20,
})

/** Someone has to own the project — the last lead can't be demoted or removed. */
export const leadCount = (members: Member[]): number =>
  members.filter((m) => m.role === "lead").length

export const isLastLead = (members: Member[], member: Member): boolean =>
  member.role === "lead" && leadCount(members) === 1

export const isOverAllocated = (m: Member | MemberDraft): boolean =>
  m.allocation > FULL_WEEK_HOURS

export const isValid = (d: MemberDraft): boolean =>
  d.name.trim() !== "" &&
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) &&
  d.allocation > 0 &&
  !isOverAllocated(d)

export const totalAllocation = (members: Member[]): number =>
  members.reduce((sum, m) => sum + m.allocation, 0)

export const initials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

// ── Mock data ──────────────────────────────────────────────────────────────

export const MEMBERS: Member[] = [
  { id: "1", name: "Ava Chen", email: "ava.chen@example.com", role: "lead", allocation: 40 },
  { id: "2", name: "Marcus Webb", email: "marcus.webb@example.com", role: "member", allocation: 30 },
  { id: "3", name: "Priya Nair", email: "priya.nair@example.com", role: "member", allocation: 20 },
  { id: "4", name: "Tom Okafor", email: "tom.okafor@example.com", role: "member", allocation: 10 },
  { id: "5", name: "Dana Reyes", email: "dana.reyes@example.com", role: "viewer", allocation: 2 },
]
