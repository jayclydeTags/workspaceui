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
        title: "CRUD",
        items: [
          {
            title: "Data Table",
            href: "/blocks/data-table",
            description:
              "Generic TanStack data table — sortable columns, column filter, column visibility, row selection, and pagination.",
          },
          {
            title: "Bulk Actions Toolbar",
            href: "/blocks/bulk-actions-toolbar",
            description:
              "Row selection with select-all and a contextual toolbar for bulk export/delete, with a confirm dialog for the destructive action.",
          },
          {
            title: "Confirm Dialog",
            href: "/blocks/confirm-dialog",
            description:
              "Reusable confirm-before-you-act dialog for destructive actions — controlled open state, custom title/description/labels, destructive styling.",
          },
          {
            title: "Search + Filter Bar",
            href: "/blocks/search-filter-bar",
            description:
              "Search box with faceted Select filters and a clear-all action over a filtered result list with live count.",
          },
          {
            title: "Detail Tabs",
            href: "/blocks/detail-tabs",
            description:
              "Single-record detail view with a header and Overview / Activity / Orders tabs.",
          },
          {
            title: "Record Form Dialog",
            href: "/blocks/record-form-dialog",
            description:
              "Standalone create/edit dialog — one form handles both add and update, seeded from the record being edited.",
          },
          {
            title: "Record Detail",
            href: "/blocks/record-detail",
            description:
              "Read-only single-record view — header with avatar/status badge and grouped label/value field sections, no tabs.",
          },
          {
            title: "Master-Detail",
            href: "/blocks/master-detail",
            description:
              "Resizable list + detail split pane — select a row on the left to view its fields on the right, with an empty state when nothing's selected.",
          },
          {
            title: "Department",
            href: "/blocks/department",
            description:
              "Departments table with create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Import / Export",
            href: "/blocks/import-export",
            description:
              "CSV import wizard — paste or load data, map columns to entity fields with a live preview, then import. Includes a CSV export action.",
          },
          {
            title: "File Upload",
            href: "/blocks/file-upload",
            description:
              "Attachments panel — click-or-drag dropzone, per-file upload/error states, type icons, retry, and remove.",
          },
        ],
      },
      {
        title: "Communication",
        items: [
          {
            title: "Notifications Inbox",
            href: "/blocks/notifications-inbox",
            description:
              "Notification inbox with All/Unread tabs, per-type icons, unread indicators, mark-one-read on click, and mark-all-read.",
          },
          {
            title: "Notification Center",
            href: "/blocks/notification-center",
            description:
              "Notification center with a header bell dropdown (unread badge capped at 9+, 5 most recent, mark-all-read) and a full page filtered by read state, severity, and date range with 20-per-page pagination.",
          },
          {
            title: "Comments Thread",
            href: "/blocks/comments-thread",
            description:
              "Threaded comments with avatars, inline reply composers, and a top-level composer, with a running comment count.",
          },
        ],
      },
      {
        title: "Payroll",
        items: [
          {
            title: "Payroll Run",
            href: "/blocks/payroll-run",
            description:
              "Payroll run summary with per-employee payslips — gross, deductions, and net pay.",
          },
          {
            title: "Employee",
            href: "/blocks/employee",
            description:
              "Employee directory with create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Deductions & Benefits",
            href: "/blocks/deductions-benefits",
            description:
              "Deduction and benefit plan list with create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Tax Tables",
            href: "/blocks/tax-tables",
            description:
              "Searchable tax bracket reference table filterable by jurisdiction, with income range and rate per filing status.",
          },
          {
            title: "Payroll Tasks",
            href: "/blocks/payroll-tasks",
            description:
              "Employee payroll task dashboard — pending/overdue/completed overview cards, a searchable task list, and a complete-with-summary dialog.",
          },
          {
            title: "Payslip Detail",
            href: "/blocks/payslip-detail",
            description:
              "Single-employee payslip breakdown — earnings, deductions, and employer contributions with YTD totals.",
          },
          {
            title: "Compensation Table",
            href: "/blocks/compensation-table",
            description:
              "Searchable org-wide salary overview with pay band, last adjustment, and change percentage.",
          },
          {
            title: "Payroll Calendar",
            href: "/blocks/payroll-calendar",
            description:
              "Monthly pay schedule with timesheet cutoffs, pay dates, and the next upcoming run highlighted.",
          },
          {
            title: "Off-cycle Payment Form",
            href: "/blocks/offcycle-payment-form",
            description:
              "Form for issuing a one-off bonus, correction, or reimbursement outside the regular payroll run.",
          },
        ],
      },
      {
        title: "Dashboard",
        items: [
          {
            title: "Dashboard",
            href: "/blocks/dashboard",
            description:
              "Icon-collapsible sidebar with the Workspace component; tabs render inside Page.",
          },
          {
            title: "Dashboard 01",
            href: "/blocks/dashboard-01",
            description:
              "Collapsible sidebar nav paired with the Workspace component.",
          },
          {
            title: "Dashboard Rail",
            href: "/blocks/dashboard-rail",
            description:
              "Fixed icon app rail beside a collapsible nav sidebar and the Workspace component.",
          },
        ],
      },
      {
        title: "Activity",
        items: [
          {
            title: "Activity Log",
            href: "/blocks/activity-log",
            description:
              "Filterable activity log with a responsive datatable — collapses to cards on narrow panes.",
          },
          {
            title: "Activity Feed",
            href: "/blocks/activity-feed",
            description:
              "Grouped activity timeline with type/user filters and running stats.",
          },
          {
            title: "Audit Log",
            href: "/blocks/audit-log",
            description:
              "Field-level audit trail — who changed what field, with before → after values, actor avatars, and search/action filters.",
          },
        ],
      },
      {
        title: "Access",
        items: [
          {
            title: "Access Control",
            href: "/blocks/access-control",
            description:
              "Manage role permissions across resources with a per-role permission matrix.",
          },
        ],
      },
      {
        title: "Finance",
        items: [
          {
            title: "Invoice Detail",
            href: "/blocks/invoice-detail",
            description:
              "Master-detail invoice workspace — select a row to open its line items in a new tab.",
          },
          {
            title: "Purchase Order Form",
            href: "/blocks/purchase-order-form",
            description:
              "Three-step wizard for creating a purchase order — vendor details, line items, and review.",
          },
          {
            title: "Chart of Accounts",
            href: "/blocks/chart-of-accounts",
            description:
              "Chart of accounts table with create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Bills",
            href: "/blocks/bills",
            description:
              "Accounts-payable bills list with create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Payments",
            href: "/blocks/payments",
            description:
              "Payments list with create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Journal Entries",
            href: "/blocks/journal-entries",
            description:
              "Journal entry list with a dynamic debit/credit line-item dialog that validates the entry balances before it can be saved.",
          },
          {
            title: "Bank Reconciliation",
            href: "/blocks/bank-reconciliation",
            description:
              "Bank reconciliation checklist — mark transactions cleared against a statement balance, with live statement/cleared/difference summary cards.",
          },
        ],
      },
      {
        title: "Inventory",
        items: [
          {
            title: "Products",
            href: "/blocks/products",
            description:
              "Product / SKU catalog list with create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Warehouses",
            href: "/blocks/warehouses",
            description:
              "Warehouse list with capacity utilization, create/edit dialog form, row-action menu, and a delete confirmation.",
          },
          {
            title: "Stock Levels",
            href: "/blocks/stock-levels",
            description:
              "On-hand stock per SKU and warehouse — searchable, with derived low/out-of-stock badges and a stock-take adjustment dialog.",
          },
          {
            title: "Stock Movements",
            href: "/blocks/stock-movements",
            description:
              "Append-only stock ledger — receipts, shipments, adjustments, and transfers with a type filter, running net change, and a record-movement dialog.",
          },
        ],
      },
      {
        title: "HRIS",
        items: [
          {
            title: "Leave Requests",
            href: "/blocks/leave-requests",
            description:
              "Leave request list with a status filter, approve/reject row actions, a submit-request dialog, and a delete confirmation.",
          },
          {
            title: "Attendance",
            href: "/blocks/attendance",
            description:
              "Daily attendance log with a date filter, punch-derived present/late/absent status, total hours, and create/edit/delete.",
          },
          {
            title: "Performance Reviews",
            href: "/blocks/performance-reviews",
            description:
              "Performance review list with star ratings, a status filter, average-rating summary, and a create/edit dialog that blocks completing an unrated review.",
          },
        ],
      },
      {
        title: "Project management",
        items: [
          {
            title: "Projects",
            href: "/blocks/projects",
            description:
              "Project portfolio list with a status filter, progress bars, overdue due-date highlighting, and create/edit/delete.",
          },
          {
            title: "Task Board",
            href: "/blocks/task-board",
            description:
              "Drag-and-drop Kanban board for project tasks — to do / in progress / review / done, with priority, assignee, and a create/edit dialog.",
          },
          {
            title: "Timesheets",
            href: "/blocks/timesheets",
            description:
              "Time entries per project with billable-utilization summary and a draft → submitted → approved lifecycle that locks an entry once submitted.",
          },
          {
            title: "Milestones",
            href: "/blocks/milestones",
            description:
              "Milestone tracker with task-scope progress and a state derived from the due date — completed, overdue, at risk, or on track.",
          },
          {
            title: "Project Team",
            href: "/blocks/project-team",
            description:
              "Project roster with roles, weekly allocation, and guards that keep one lead on the project and nobody booked past a full week.",
          },
        ],
      },
      {
        title: "CRM",
        items: [
          {
            title: "Leads",
            href: "/blocks/leads",
            description:
              "Lead pipeline with a stage filter, hot-lead scoring, qualification rate, and a convert action gated on the lead being qualified.",
          },
          {
            title: "Contacts",
            href: "/blocks/contacts",
            description:
              "Contact book with search, one-primary-per-account enforced on promote, and a warning for accounts left without a primary.",
          },
          {
            title: "Accounts",
            href: "/blocks/accounts",
            description:
              "Account book with tier filter, ARR roll-up, health derived from contact recency, and delete blocked while deals are open.",
          },
          {
            title: "Deals Pipeline",
            href: "/blocks/deals-pipeline",
            description:
              "Drag-and-drop deal pipeline with per-stage value, a probability-weighted forecast, and win rate over closed deals.",
          },
        ],
      },
      {
        title: "Lending",
        items: [
          {
            title: "Loan Applications",
            href: "/blocks/loan-applications",
            description:
              "Loan application queue with amortised monthly payment, debt-to-income assessment, and approval blocked above the DTI ceiling.",
          },
          {
            title: "Borrowers",
            href: "/blocks/borrowers",
            description:
              "Borrower register with search, risk grade derived from credit score, KYC gating on eligibility, and delete blocked while loans are active.",
          },
          {
            title: "Repayment Schedule",
            href: "/blocks/repayment-schedule",
            description:
              "Amortisation table derived from the loan terms — per-instalment interest/principal split, derived paid/due/overdue status, and in-order payment recording.",
          },
          {
            title: "Disbursements",
            href: "/blocks/disbursements",
            description:
              "Loan disbursement tranches with a loan filter, release/fail settlement, and scheduling blocked from overdrawing the approved principal.",
          },
          {
            title: "Collateral",
            href: "/blocks/collateral",
            description:
              "Pledged-asset register with per-type advance rates, lien perfection blocked on a stale appraisal, and an under-secured loan warning.",
          },
        ],
      },
      {
        title: "Warehouse",
        items: [
          {
            title: "Bin / Location Map",
            href: "/blocks/bin-location-map",
            description:
              "Warehouse floor-plan grid of storage bins — assign or clear stock per bin, gated on capacity, single-SKU occupancy, and blocked/quarantine status.",
          },
          {
            title: "Inbound / Receiving",
            href: "/blocks/inbound-receiving",
            description:
              "Record stock arriving against a purchase order and put it away into bins — blocked receiving on a closed/cancelled PO, a QC gate before stock counts as available, and capacity-checked put-away reusing the bin/location-map contract.",
          },
          {
            title: "Outbound / Picking",
            href: "/blocks/outbound-picking",
            description:
              "Claim and fulfil pick lists that draw stock out of bins for an outbound order — blocked picking on a closed/cancelled order, per-line allocations across bins capped at on-hand, short-pick handling, and a picker-claim gate. Emits a pickId + picked-quantity completion record for Shipments.",
          },
          {
            title: "Inventory Adjustments",
            href: "/blocks/inventory-adjustments",
            description:
              "Bin-level count-correction workflow — an absolute physical count raised against a bin with a reason code, where damage/shrinkage may only reduce a count, variance over 10% needs approval before it posts, and a bin held by a pick or receipt is locked. Approval posts to the bin in one step and emits a SKU/warehouse/delta record for stock levels.",
          },
          {
            title: "Shipments",
            href: "/blocks/shipments",
            description:
              "Outbound fulfilment records that ship a completed pick — a partially-picked order can never ship, a carrier and tracking number are required before a shipment moves to shipped, and a shipment already in transit can no longer be cancelled. Status is derived from the record, never stored: cancelled outranks exception outranks delivered outranks shipped.",
          },
        ],
      },
      {
        title: "Operations",
        items: [
          {
            title: "Approval Board",
            href: "/blocks/approval-board",
            description:
              "Drag-and-drop Kanban board for triaging expense, purchase order, and time-off approval requests.",
          },
        ],
      },
      {
        title: "Settings",
        items: [
          {
            title: "Settings",
            href: "/blocks/settings",
            description:
              "Sectioned workspace settings — company profile, notifications, billing, and security.",
          },
        ],
      },
    ],
  },
  {
    title: "Authentication",
    groups: [
      {
        title: "Login",
        items: [
          {
            title: "Login",
            href: "/blocks/login",
            description:
              "Email and password sign-in form — inline field validation, invalid-credentials banner, pending state, remember-me, and forgot-password/sign-up links.",
          },
          {
            title: "Login (Social)",
            href: "/blocks/login-social",
            description:
              "Sign-in with Google/GitHub SSO buttons over an email-and-password form — provider divider, inline validation, invalid-credentials banner, and pending state.",
          },
          {
            title: "Magic Link Sent",
            href: "/blocks/magic-link-sent",
            description:
              "Passwordless check-your-email confirmation after requesting a magic sign-in link — expiry note, cooldown-gated resend, and change-email action.",
          },
          {
            title: "Account Locked",
            href: "/blocks/account-locked",
            description:
              "Account-locked screen after too many failed sign-in attempts — locked email, lockout countdown, and reset/support actions.",
          },
          {
            title: "Session Expired",
            href: "/blocks/session-expired",
            description:
              "Re-authentication prompt after an idle timeout — quick password re-entry for the current user, incorrect-password error, and a switch-user action.",
          },
        ],
      },
      {
        title: "Registration",
        items: [
          {
            title: "Register",
            href: "/blocks/register",
            description:
              "Account sign-up form with a live password-strength meter, field validation, terms agreement, and a verify-your-email confirmation state.",
          },
          {
            title: "Verify Email",
            href: "/blocks/verify-email",
            description:
              "Post-registration confirm-your-email pending screen — cooldown-gated resend and a transition to the email-confirmed success state.",
          },
        ],
      },
      {
        title: "Password",
        items: [
          {
            title: "Forgot Password",
            href: "/blocks/forgot-password",
            description:
              "Request a password-reset link by email — field validation, pending state, and a neutral check-your-email confirmation that doesn't leak account existence.",
          },
          {
            title: "Reset Password",
            href: "/blocks/reset-password",
            description:
              "Set-a-new-password form with a live strength meter, confirm-match validation, an expired-link state, and a password-updated confirmation.",
          },
          {
            title: "Change Password",
            href: "/blocks/change-password",
            description:
              "Authenticated in-app password change — current-password re-auth check, new-password strength meter, confirm-match validation, and a changed confirmation.",
          },
        ],
      },
      {
        title: "Two-Factor & OTP",
        items: [
          {
            title: "Two-Factor Challenge",
            href: "/blocks/two-factor-challenge",
            description:
              "Post-password 2FA step — authenticator-app code entry with auto-verify, a recovery-code fallback, trust-this-device option, and error states.",
          },
          {
            title: "Two-Factor Setup",
            href: "/blocks/two-factor-setup",
            description:
              "Authenticator enrollment — QR code, copyable manual setup key, and a 6-digit verify step with error and enabled states.",
          },
          {
            title: "Recovery Codes",
            href: "/blocks/recovery-codes",
            description:
              'Backup-code display with copy, download, and regenerate actions, gated behind an "I\'ve saved them" acknowledgement before continuing.',
          },
          {
            title: "OTP Verify",
            href: "/blocks/otp-verify",
            description:
              "One-time passcode entry with a 6-digit segmented input, auto-verify on complete, incorrect-code error, and a countdown-gated resend.",
          },
        ],
      },
    ],
  },
  {
    title: "Authorization",
    groups: [
      {
        title: "Access",
        items: [
          {
            title: "Unauthorized 403",
            href: "/blocks/unauthorized-403",
            description:
              "Signed-in-but-forbidden screen — explains the missing permission, offers a request-access action with a sent confirmation, and a back link.",
          },
          {
            title: "Forbidden Workspace",
            href: "/blocks/forbidden-workspace",
            description:
              "Wrong-tenant screen — signed in but not a member of this workspace, with a switcher to workspaces you belong to and a switch-account action.",
          },
          {
            title: "Pending Approval",
            href: "/blocks/pending-approval",
            description:
              "Account-under-review status screen — explains the pending admin approval, the notification email, and check-status/sign-out actions.",
          },
          {
            title: "Account Suspended",
            href: "/blocks/account-suspended",
            description:
              "Suspended-account screen — shows the suspension reason and offers an appeal action with a submitted confirmation plus a contact-support link.",
          },
          {
            title: "Upgrade Required",
            href: "/blocks/upgrade-required",
            description:
              "Plan-gated feature screen — a signed-in user hits a Pro-only feature, with the perks it unlocks, an upgrade action, and an ask-an-admin fallback that confirms once sent.",
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
      { title: "Password Input", href: "/docs/components/password-input" },
    ],
  },
]
