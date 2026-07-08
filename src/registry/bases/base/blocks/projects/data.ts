// ── Types ──────────────────────────────────────────────────────────────────

export type ProjectStatus = "planning" | "active" | "on-hold" | "completed"

export interface Project {
  id: string
  code: string
  name: string
  client: string
  lead: string
  /** ISO date. */
  due: string
  /** 0–100. */
  progress: number
  status: ProjectStatus
}

export type ProjectDraft = Omit<Project, "id">

export const PROJECT_STATUSES: ProjectStatus[] = [
  "planning",
  "active",
  "on-hold",
  "completed",
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): ProjectDraft => ({
  code: "",
  name: "",
  client: "",
  lead: "",
  due: "",
  progress: 0,
  status: "planning",
})

export const isValid = (d: ProjectDraft): boolean =>
  d.code.trim() !== "" &&
  d.name.trim() !== "" &&
  d.progress >= 0 &&
  d.progress <= 100

/** Past due and not yet completed. */
export const isOverdue = (p: Project, today = new Date()): boolean =>
  p.status !== "completed" &&
  p.due !== "" &&
  Date.parse(p.due) < Date.parse(today.toISOString().slice(0, 10))

export const activeCount = (projects: Project[]): number =>
  projects.filter((p) => p.status === "active").length

// ── Mock data ──────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  { id: "1", code: "PRJ-101", name: "Billing migration", client: "Northwind", lead: "Ava Chen", due: "2026-09-30", progress: 62, status: "active" },
  { id: "2", code: "PRJ-102", name: "Mobile app rewrite", client: "Contoso", lead: "Marcus Webb", due: "2026-06-15", progress: 40, status: "active" },
  { id: "3", code: "PRJ-103", name: "Warehouse rollout", client: "Fabrikam", lead: "Priya Nair", due: "2026-12-01", progress: 5, status: "planning" },
  { id: "4", code: "PRJ-104", name: "Data lake pilot", client: "Northwind", lead: "Tom Okafor", due: "2026-08-20", progress: 30, status: "on-hold" },
  { id: "5", code: "PRJ-105", name: "SSO integration", client: "Contoso", lead: "Lena Fischer", due: "2026-03-31", progress: 100, status: "completed" },
]
