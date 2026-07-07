// ── Types ──────────────────────────────────────────────────────────────────

export type EmployeeStatus = "active" | "on-leave"

export interface FieldGroupData {
  title: string
  fields: { label: string; value: string }[]
}

export interface Employee {
  id: string
  name: string
  title: string
  status: EmployeeStatus
  groups: FieldGroupData[]
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const EMPLOYEE: Employee = {
  id: "EMP-1042",
  name: "Priya Nair",
  title: "Senior Product Designer",
  status: "active",
  groups: [
    {
      title: "Employment",
      fields: [
        { label: "Department", value: "Design" },
        { label: "Manager", value: "Emma Davis" },
        { label: "Start date", value: "2022-03-14" },
        { label: "Employment type", value: "Full-time" },
      ],
    },
    {
      title: "Contact",
      fields: [
        { label: "Email", value: "priya.nair@acme.co" },
        { label: "Phone", value: "+1 (555) 019-2244" },
        { label: "Location", value: "Austin, TX" },
      ],
    },
  ],
}
