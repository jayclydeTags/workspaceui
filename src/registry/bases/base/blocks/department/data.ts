// ── Types ──────────────────────────────────────────────────────────────────

export type DepartmentStatus = "active" | "archived"

export interface Department {
  id: string
  name: string
  code: string
  manager: string
  headcount: number
  status: DepartmentStatus
}

export type DepartmentDraft = Omit<Department, "id" | "headcount">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): DepartmentDraft => ({
  name: "",
  code: "",
  manager: "",
  status: "active",
})

export const isValid = (d: DepartmentDraft): boolean =>
  d.name.trim() !== "" && d.code.trim() !== "" && d.manager.trim() !== ""

// ── Mock data ──────────────────────────────────────────────────────────────

export const DEPARTMENTS: Department[] = [
  { id: "1", name: "Engineering", code: "ENG", manager: "Sarah Chen", headcount: 42, status: "active" },
  { id: "2", name: "Sales", code: "SAL", manager: "Mike Johnson", headcount: 28, status: "active" },
  { id: "3", name: "Design", code: "DSN", manager: "Emma Davis", headcount: 12, status: "active" },
  { id: "4", name: "Customer Support", code: "SUP", manager: "David Lee", headcount: 19, status: "active" },
  { id: "5", name: "Research", code: "RND", manager: "Priya Nair", headcount: 8, status: "archived" },
]
