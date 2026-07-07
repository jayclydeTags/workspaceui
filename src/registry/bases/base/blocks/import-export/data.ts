// ── Types ──────────────────────────────────────────────────────────────────

export interface TargetField {
  key: string
  label: string
}

export interface ParsedCsv {
  headers: string[]
  rows: string[][]
}

// The entity we're importing into — every CSV column maps onto one of these.
export const TARGET_FIELDS: TargetField[] = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
]

export const SAMPLE_CSV = `name,email,role,department
Ada Lovelace,ada@acme.co,Admin,Engineering
Grace Hopper,grace@acme.co,Editor,Engineering
Alan Turing,alan@acme.co,Viewer,Research
Katherine Johnson,katherine@acme.co,Editor,Research
Dennis Ritchie,dennis@acme.co,Admin,Platform`

// ── Helpers ──────────────────────────────────────────────────────────────────

// ponytail: naive split — no quoted-comma / escaped-newline handling. Swap for
// a real CSV parser (papaparse) if imports need RFC-4180 quoting.
export function parseCsv(text: string): ParsedCsv {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim() !== "")
  if (lines.length === 0) return { headers: [], rows: [] }
  const headers = lines[0].split(",").map((h) => h.trim())
  const rows = lines.slice(1).map((l) => l.split(",").map((c) => c.trim()))
  return { headers, rows }
}

// Auto-match each target field to the CSV column whose header equals its key
// (case-insensitive). Returns targetKey → header index, or -1 if unmatched.
export function autoMap(
  headers: string[],
  targets: TargetField[]
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const t of targets) {
    map[t.key] = headers.findIndex(
      (h) => h.toLowerCase() === t.key.toLowerCase()
    )
  }
  return map
}

export function toCsv(headers: string[], rows: string[][]): string {
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
}
