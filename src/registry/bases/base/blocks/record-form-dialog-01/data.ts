// ── Types ──────────────────────────────────────────────────────────────────

export type ContactStatus = "active" | "inactive"

export interface Contact {
  id: string
  name: string
  email: string
  company: string
  status: ContactStatus
}

export type ContactDraft = Omit<Contact, "id">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): ContactDraft => ({
  name: "",
  email: "",
  company: "",
  status: "active",
})

export const isValid = (d: ContactDraft): boolean =>
  d.name.trim() !== "" && d.email.trim() !== "" && d.company.trim() !== ""

export const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

// ── Mock data ──────────────────────────────────────────────────────────────

export const CONTACTS: Contact[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@acme.co", company: "Acme Co.", status: "active" },
  { id: "2", name: "Grace Hopper", email: "grace@acme.co", company: "Umbrella Corp", status: "active" },
  { id: "3", name: "Alan Turing", email: "alan@acme.co", company: "Initech", status: "inactive" },
]
