// ── Types ──────────────────────────────────────────────────────────────────

export interface Contact {
  id: string
  name: string
  title: string
  account: string
  email: string
  phone: string
  /** Exactly one contact per account is the primary one. */
  primary: boolean
}

export type ContactDraft = Omit<Contact, "id">

export const ACCOUNTS = ["Northwind", "Contoso", "Fabrikam", "Tailspin"]

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): ContactDraft => ({
  name: "",
  title: "",
  account: ACCOUNTS[0],
  email: "",
  phone: "",
  primary: false,
})

export const isValid = (d: ContactDraft): boolean =>
  d.name.trim() !== "" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)

export const initials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

/**
 * Promoting a contact demotes whoever was primary on the same account —
 * "exactly one primary per account" is an invariant, not a per-row flag.
 */
export function setPrimary(contacts: Contact[], id: string): Contact[] {
  const target = contacts.find((c) => c.id === id)
  if (!target) return contacts
  return contacts.map((c) =>
    c.account === target.account ? { ...c, primary: c.id === id } : c
  )
}

/** Accounts left without a primary contact — a gap worth surfacing. */
export function accountsWithoutPrimary(contacts: Contact[]): string[] {
  const accounts = [...new Set(contacts.map((c) => c.account))]
  return accounts.filter(
    (account) => !contacts.some((c) => c.account === account && c.primary)
  )
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const CONTACTS: Contact[] = [
  { id: "1", name: "Iris Muller", title: "VP Finance", account: "Northwind", email: "iris@northwind.example", phone: "+1 503 555 0142", primary: true },
  { id: "2", name: "Ray Whitfield", title: "Controller", account: "Northwind", email: "ray@northwind.example", phone: "+1 503 555 0177", primary: false },
  { id: "3", name: "Devon Park", title: "Head of Ops", account: "Contoso", email: "devon@contoso.example", phone: "+1 312 555 0119", primary: true },
  { id: "4", name: "Nadia Rahman", title: "CTO", account: "Fabrikam", email: "nadia@fabrikam.example", phone: "+1 404 555 0188", primary: false },
  { id: "5", name: "Owen Blake", title: "Buyer", account: "Tailspin", email: "owen@tailspin.example", phone: "+1 206 555 0125", primary: true },
]
