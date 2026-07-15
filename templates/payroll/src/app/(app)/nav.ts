import {
  CalendarDays,
  Coins,
  HandCoins,
  LayoutDashboard,
  Percent,
  ReceiptText,
  Send,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  id: string
  href: string
  title: string
  Icon: LucideIcon
  /** Pinned tabs cannot be closed. */
  pinned?: boolean
}

// The 10 in-app routes. Each composes one WorkspaceUI block. `/login` lives
// outside this shell (its own bare route). Order here drives both the sidebar
// and the initial tab.
export const NAV_ITEMS: NavItem[] = [
  { id: "overview", href: "/", title: "Overview", Icon: LayoutDashboard, pinned: true },
  { id: "employees", href: "/employees", title: "Employees", Icon: Users },
  { id: "payroll-runs", href: "/payroll-runs", title: "Payroll Runs", Icon: Wallet },
  { id: "payslips", href: "/payslips", title: "Payslips", Icon: ReceiptText },
  { id: "compensation", href: "/compensation", title: "Compensation", Icon: Coins },
  { id: "deductions", href: "/deductions", title: "Deductions & Benefits", Icon: HandCoins },
  { id: "tax-tables", href: "/tax-tables", title: "Tax Tables", Icon: Percent },
  { id: "calendar", href: "/calendar", title: "Calendar", Icon: CalendarDays },
  { id: "off-cycle", href: "/off-cycle", title: "Off-cycle", Icon: Send },
  { id: "settings", href: "/settings", title: "Settings", Icon: Settings },
]

export const navByHref = new Map(NAV_ITEMS.map((i) => [i.href, i]))
export const navById = new Map(NAV_ITEMS.map((i) => [i.id, i]))
