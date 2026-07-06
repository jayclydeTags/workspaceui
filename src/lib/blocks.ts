import type { ComponentType } from "react"

import { AccessControl01 } from "@/registry/bases/base/blocks/access-control-01/page"
import { ApprovalBoard01 } from "@/registry/bases/base/blocks/approval-board-01/page"
import { ActivityFeed01 } from "@/registry/bases/base/blocks/activity-feed-01/page"
import { ActivityLog01 } from "@/registry/bases/base/blocks/activity-log-01/page"
import { Dashboard01 } from "@/registry/bases/base/blocks/dashboard-01/page"
import { InvoiceDetail01 } from "@/registry/bases/base/blocks/invoice-detail-01/page"
import { PayrollRun01 } from "@/registry/bases/base/blocks/payroll-run-01/page"
import { PayrollTasks } from "@/registry/bases/base/blocks/payroll-tasks/page"
import { PayslipDetail01 } from "@/registry/bases/base/blocks/payslip-detail-01/page"
import { CompensationTable01 } from "@/registry/bases/base/blocks/compensation-table-01/page"
import { PayrollCalendar01 } from "@/registry/bases/base/blocks/payroll-calendar-01/page"
import { OffcyclePaymentForm01 } from "@/registry/bases/base/blocks/offcycle-payment-form-01/page"
import { PurchaseOrderForm01 } from "@/registry/bases/base/blocks/purchase-order-form-01/page"
import { Settings01 } from "@/registry/bases/base/blocks/settings-01/page"

export interface BlockMeta {
  slug: string
  title: string
  description: string
  category: string
  Component: ComponentType
}

// Single source of truth for the /blocks gallery. Imported only by the gallery
// route so the block components stay code-split to /blocks (nav.ts, which loads
// everywhere, must not import this).
export const blocks: BlockMeta[] = [
  {
    slug: "payroll-run-01",
    title: "Payroll Run 01",
    description:
      "Payroll run summary with per-employee payslips — gross, deductions, and net pay.",
    category: "Payroll",
    Component: PayrollRun01,
  },
  {
    slug: "payroll-tasks",
    title: "Payroll Tasks",
    description:
      "Employee payroll task dashboard — pending/overdue/completed overview cards, a searchable task list, and a complete-with-summary dialog.",
    category: "Payroll",
    Component: PayrollTasks,
  },
  {
    slug: "payslip-detail-01",
    title: "Payslip Detail 01",
    description:
      "Single-employee payslip breakdown — earnings, deductions, and employer contributions with YTD totals.",
    category: "Payroll",
    Component: PayslipDetail01,
  },
  {
    slug: "compensation-table-01",
    title: "Compensation Table 01",
    description:
      "Searchable org-wide salary overview with pay band, last adjustment, and change percentage.",
    category: "Payroll",
    Component: CompensationTable01,
  },
  {
    slug: "payroll-calendar-01",
    title: "Payroll Calendar 01",
    description:
      "Monthly pay schedule with timesheet cutoffs, pay dates, and the next upcoming run highlighted.",
    category: "Payroll",
    Component: PayrollCalendar01,
  },
  {
    slug: "offcycle-payment-form-01",
    title: "Off-cycle Payment Form 01",
    description:
      "Form for issuing a one-off bonus, correction, or reimbursement outside the regular payroll run.",
    category: "Payroll",
    Component: OffcyclePaymentForm01,
  },
  {
    slug: "dashboard-01",
    title: "Dashboard 01",
    description: "Collapsible sidebar nav paired with the Workspace component.",
    category: "Dashboard",
    Component: Dashboard01,
  },
  {
    slug: "activity-log-01",
    title: "Activity Log 01",
    description:
      "Filterable activity log with a responsive datatable — collapses to cards on narrow panes.",
    category: "Activity",
    Component: ActivityLog01,
  },
  {
    slug: "activity-feed-01",
    title: "Activity Feed 01",
    description:
      "Grouped activity timeline with type/user filters and running stats.",
    category: "Activity",
    Component: ActivityFeed01,
  },
  {
    slug: "access-control-01",
    title: "Access Control 01",
    description:
      "Manage role permissions across resources with a per-role permission matrix.",
    category: "Access",
    Component: AccessControl01,
  },
  {
    slug: "invoice-detail-01",
    title: "Invoice Detail 01",
    description:
      "Master-detail invoice workspace — select a row to open its line items in a new tab.",
    category: "Finance",
    Component: InvoiceDetail01,
  },
  {
    slug: "purchase-order-form-01",
    title: "Purchase Order Form 01",
    description:
      "Three-step wizard for creating a purchase order — vendor details, line items, and review.",
    category: "Finance",
    Component: PurchaseOrderForm01,
  },
  {
    slug: "approval-board-01",
    title: "Approval Board 01",
    description:
      "Drag-and-drop Kanban board for triaging expense, purchase order, and time-off approval requests.",
    category: "Operations",
    Component: ApprovalBoard01,
  },
  {
    slug: "settings-01",
    title: "Settings 01",
    description:
      "Sectioned workspace settings — company profile, notifications, billing, and security.",
    category: "Settings",
    Component: Settings01,
  },
]
