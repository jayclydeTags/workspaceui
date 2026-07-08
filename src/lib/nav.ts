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
              "Backup-code display with copy, download, and regenerate actions, gated behind an \"I've saved them\" acknowledgement before continuing.",
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
