export interface NavItem {
  title: string
  href: string
  label?: string
  description?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface NavSection {
  title: string
  items?: NavItem[] // flat list (docs sidebar)
  groups?: NavGroup[] // nested collapsible subcategories (blocks sidebar)
}

export const blocksNav: NavSection[] = [
  {
    title: "Applications",
    groups: [
      {
        title: "Payroll",
        items: [
          {
            title: "Payroll Run 01",
            href: "/blocks/payroll-run-01",
            description:
              "Payroll run summary with per-employee payslips — gross, deductions, and net pay.",
          },
          {
            title: "Payslip Detail 01",
            href: "/blocks/payslip-detail-01",
            description:
              "Single-employee payslip breakdown — earnings, deductions, and employer contributions with YTD totals.",
          },
          {
            title: "Compensation Table 01",
            href: "/blocks/compensation-table-01",
            description:
              "Searchable org-wide salary overview with pay band, last adjustment, and change percentage.",
          },
          {
            title: "Payroll Calendar 01",
            href: "/blocks/payroll-calendar-01",
            description:
              "Monthly pay schedule with timesheet cutoffs, pay dates, and the next upcoming run highlighted.",
          },
          {
            title: "Off-cycle Payment Form 01",
            href: "/blocks/offcycle-payment-form-01",
            description:
              "Form for issuing a one-off bonus, correction, or reimbursement outside the regular payroll run.",
          },
        ],
      },
      {
        title: "Dashboard",
        items: [
          {
            title: "Dashboard 01",
            href: "/blocks/dashboard-01",
            description:
              "Collapsible sidebar nav paired with the Workspace component.",
          },
        ],
      },
      {
        title: "Activity",
        items: [
          {
            title: "Activity Log 01",
            href: "/blocks/activity-log-01",
            description:
              "Filterable activity log with a responsive datatable — collapses to cards on narrow panes.",
          },
          {
            title: "Activity Feed 01",
            href: "/blocks/activity-feed-01",
            description:
              "Grouped activity timeline with type/user filters and running stats.",
          },
        ],
      },
      {
        title: "Access",
        items: [
          {
            title: "Access Control 01",
            href: "/blocks/access-control-01",
            description:
              "Manage role permissions across resources with a per-role permission matrix.",
          },
        ],
      },
      {
        title: "Finance",
        items: [
          {
            title: "Invoice Detail 01",
            href: "/blocks/invoice-detail-01",
            description:
              "Master-detail invoice workspace — select a row to open its line items in a new tab.",
          },
          {
            title: "Purchase Order Form 01",
            href: "/blocks/purchase-order-form-01",
            description:
              "Three-step wizard for creating a purchase order — vendor details, line items, and review.",
          },
        ],
      },
      {
        title: "Operations",
        items: [
          {
            title: "Approval Board 01",
            href: "/blocks/approval-board-01",
            description:
              "Drag-and-drop Kanban board for triaging expense, purchase order, and time-off approval requests.",
          },
        ],
      },
      {
        title: "Settings",
        items: [
          {
            title: "Settings 01",
            href: "/blocks/settings-01",
            description:
              "Sectioned workspace settings — company profile, notifications, billing, and security.",
          },
        ],
      },
    ],
  },
]

export const nav: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Installation", href: "/docs/getting-started/installation" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Workspace", href: "/docs/components/workspace" },
      { title: "Page", href: "/docs/components/page" },
    ],
  },
]
