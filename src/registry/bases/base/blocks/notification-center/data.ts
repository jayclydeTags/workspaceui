// ── Types ──────────────────────────────────────────────────────────────────

export type NotificationSeverity = "info" | "warning" | "critical"

export type NotificationEntityType = "license" | "transfer" | "user" | "system"

export interface Notification {
  id: string
  severity: NotificationSeverity
  message: string
  /** ISO 8601 */
  createdAt: string
  read: boolean
  entityType?: NotificationEntityType
  entityId?: string
  /** Absent when the linked entity no longer exists. */
  entityRoute?: string
}

export const ALL_SEVERITIES: NotificationSeverity[] = [
  "info",
  "warning",
  "critical",
]

// ── Mock data ──────────────────────────────────────────────────────────────

// ponytail: timestamps are offsets from module load so relative labels and the
// date-range filter both stay sensible without a fixed clock in the fixture.
const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()

export const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    severity: "critical",
    message: "License PH-MFR-0042 has expired.",
    createdAt: hoursAgo(1),
    read: false,
    entityType: "license",
    entityId: "PH-MFR-0042",
    entityRoute: "/licenses/PH-MFR-0042",
  },
  {
    id: "2",
    severity: "warning",
    message: "License PH-MFR-0117 expires in 7 days.",
    createdAt: hoursAgo(2),
    read: false,
    entityType: "license",
    entityId: "PH-MFR-0117",
    entityRoute: "/licenses/PH-MFR-0117",
  },
  {
    id: "3",
    severity: "info",
    message: "12 medicine units transferred to Mercury Drug — Ortigas.",
    createdAt: hoursAgo(4),
    read: false,
    entityType: "transfer",
    entityId: "TR-8891",
    entityRoute: "/transfers/TR-8891",
  },
  {
    id: "4",
    severity: "critical",
    message: "License PH-MFR-0088 was revoked by the FDA.",
    createdAt: hoursAgo(9),
    read: false,
    entityType: "license",
    entityId: "PH-MFR-0088",
    entityRoute: "/licenses/PH-MFR-0088",
  },
  {
    id: "5",
    severity: "warning",
    message: "Anomalous batch reassignment flagged on PO-2291.",
    createdAt: hoursAgo(11),
    read: false,
    entityType: "system",
    entityId: "AUD-311",
  },
  {
    id: "6",
    severity: "info",
    message: "License PH-MFR-0117 renewal was approved.",
    createdAt: hoursAgo(20),
    read: true,
    entityType: "license",
    entityId: "PH-MFR-0117",
    entityRoute: "/licenses/PH-MFR-0117",
  },
  {
    id: "7",
    severity: "info",
    message: "Participant account “Unilab QA” was created.",
    createdAt: hoursAgo(26),
    read: true,
    entityType: "user",
    entityId: "U-4410",
    entityRoute: "/users/U-4410",
  },
  {
    id: "8",
    severity: "warning",
    message: "License PH-PHM-0233 expires in 30 days.",
    createdAt: hoursAgo(30),
    read: false,
    entityType: "license",
    entityId: "PH-PHM-0233",
    entityRoute: "/licenses/PH-PHM-0233",
  },
  {
    id: "9",
    severity: "info",
    message: "3 medicine units dispensed to a citizen at Rose Pharmacy.",
    createdAt: hoursAgo(34),
    read: true,
    entityType: "transfer",
    entityId: "TR-8874",
    entityRoute: "/transfers/TR-8874",
  },
  {
    id: "10",
    severity: "info",
    message: "Scheduled maintenance on 02 Aug, 01:00–03:00 PHT.",
    createdAt: hoursAgo(38),
    read: true,
    entityType: "system",
  },
  {
    id: "11",
    severity: "critical",
    message: "License PH-PHM-0190 has expired.",
    createdAt: hoursAgo(45),
    read: true,
    entityType: "license",
    entityId: "PH-PHM-0190",
    entityRoute: "/licenses/PH-PHM-0190",
  },
  {
    id: "12",
    severity: "info",
    message: "Admin-triggered password reset for j.santos@fda.gov.ph.",
    createdAt: hoursAgo(50),
    read: true,
    entityType: "user",
    entityId: "U-2201",
    entityRoute: "/users/U-2201",
  },
  {
    id: "13",
    severity: "info",
    message: "License PH-MFR-0301 was issued.",
    createdAt: hoursAgo(58),
    read: true,
    entityType: "license",
    entityId: "PH-MFR-0301",
    entityRoute: "/licenses/PH-MFR-0301",
  },
  {
    id: "14",
    severity: "warning",
    message: "License PH-MFR-0044 expires in 1 day.",
    createdAt: hoursAgo(63),
    read: true,
    entityType: "license",
    entityId: "PH-MFR-0044",
    entityRoute: "/licenses/PH-MFR-0044",
  },
  {
    id: "15",
    severity: "info",
    message: "40 medicine units transferred to Watsons — Cebu.",
    createdAt: hoursAgo(70),
    read: true,
    entityType: "transfer",
    entityId: "TR-8802",
    entityRoute: "/transfers/TR-8802",
  },
  {
    id: "16",
    severity: "warning",
    message: "Audit flag: batch B-7741 edited outside business hours.",
    createdAt: hoursAgo(76),
    read: true,
    entityType: "system",
    entityId: "AUD-298",
  },
  {
    id: "17",
    severity: "info",
    message: "Participant account “Pascual Lab” was deactivated.",
    createdAt: hoursAgo(84),
    read: true,
    entityType: "user",
    entityId: "U-4102",
    entityRoute: "/users/U-4102",
  },
  {
    id: "18",
    severity: "info",
    message: "License PH-PHM-0118 was prolonged to 2027-06-30.",
    createdAt: hoursAgo(92),
    read: true,
    entityType: "license",
    entityId: "PH-PHM-0118",
    entityRoute: "/licenses/PH-PHM-0118",
  },
  {
    id: "19",
    severity: "critical",
    message: "License PH-MFR-0009 was revoked.",
    createdAt: hoursAgo(101),
    read: true,
    entityType: "license",
    entityId: "PH-MFR-0009",
  },
  {
    id: "20",
    severity: "info",
    message: "8 medicine units received from Pharex Health.",
    createdAt: hoursAgo(110),
    read: true,
    entityType: "transfer",
    entityId: "TR-8760",
    entityRoute: "/transfers/TR-8760",
  },
  {
    id: "21",
    severity: "info",
    message: "License PH-MFR-0221 was issued.",
    createdAt: hoursAgo(126),
    read: true,
    entityType: "license",
    entityId: "PH-MFR-0221",
    entityRoute: "/licenses/PH-MFR-0221",
  },
  {
    id: "22",
    severity: "warning",
    message: "License PH-PHM-0055 expires in 30 days.",
    createdAt: hoursAgo(140),
    read: true,
    entityType: "license",
    entityId: "PH-PHM-0055",
    entityRoute: "/licenses/PH-PHM-0055",
  },
  {
    id: "23",
    severity: "info",
    message: "Participant account “Metro Drug” was created.",
    createdAt: hoursAgo(158),
    read: true,
    entityType: "user",
    entityId: "U-3980",
    entityRoute: "/users/U-3980",
  },
  {
    id: "24",
    severity: "info",
    message: "Portal upgraded to v2.4 — traceability exports enabled.",
    createdAt: hoursAgo(180),
    read: true,
    entityType: "system",
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

const RTF = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
]

/** "2 hours ago" — Intl does the pluralisation and wording. */
export function relativeTime(iso: string, from: number = Date.now()) {
  const seconds = (new Date(iso).getTime() - from) / 1000
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size)
      return RTF.format(Math.round(seconds / size), unit)
  }
  return RTF.format(Math.round(seconds), "second")
}
