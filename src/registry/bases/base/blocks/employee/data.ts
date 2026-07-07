// ── Types ──────────────────────────────────────────────────────────────────

export type EmployeeStatus = "active" | "onboarding" | "terminated"

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  title: string
  status: EmployeeStatus
  hireDate: string // ISO date
}

export type EmployeeDraft = Omit<Employee, "id">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): EmployeeDraft => ({
  name: "",
  email: "",
  department: "",
  title: "",
  status: "onboarding",
  hireDate: new Date().toISOString().slice(0, 10),
})

export const isValid = (d: EmployeeDraft): boolean =>
  d.name.trim() !== "" && d.email.trim() !== "" && d.department.trim() !== ""

// ── Mock data ──────────────────────────────────────────────────────────────

export const EMPLOYEES: Employee[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@acme.co", department: "Engineering", title: "Senior Engineer", status: "active", hireDate: "2022-03-14" },
  { id: "2", name: "Mike Johnson", email: "mike.johnson@acme.co", department: "Sales", title: "Account Executive", status: "active", hireDate: "2021-08-02" },
  { id: "3", name: "Emma Davis", email: "emma.davis@acme.co", department: "Design", title: "Product Designer", status: "active", hireDate: "2023-01-09" },
  { id: "4", name: "David Lee", email: "david.lee@acme.co", department: "Customer Support", title: "Support Lead", status: "active", hireDate: "2020-11-30" },
  { id: "5", name: "Priya Nair", email: "priya.nair@acme.co", department: "Engineering", title: "Staff Engineer", status: "active", hireDate: "2019-06-17" },
  { id: "6", name: "Tom Alvarez", email: "tom.alvarez@acme.co", department: "Engineering", title: "Engineer", status: "onboarding", hireDate: "2026-06-22" },
  { id: "7", name: "Lena Ortiz", email: "lena.ortiz@acme.co", department: "Sales", title: "SDR", status: "terminated", hireDate: "2022-09-05" },
]
