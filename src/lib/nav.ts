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
            title: "Payroll Tasks",
            href: "/blocks/payroll-tasks",
            description:
              "Employee payroll task dashboard — pending/overdue/completed overview cards, a searchable task list, and a complete-with-summary dialog.",
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
            title: "Account Locked",
            href: "/blocks/account-locked",
            description:
              "Account-locked screen after too many failed sign-in attempts — locked email, lockout countdown, and reset/support actions.",
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
            title: "OTP Verify",
            href: "/blocks/otp-verify",
            description:
              "One-time passcode entry with a 6-digit segmented input, auto-verify on complete, incorrect-code error, and a countdown-gated resend.",
          },
        ],
      },
      {
        title: "Authorization",
        items: [
          {
            title: "Unauthorized 403",
            href: "/blocks/unauthorized-403",
            description:
              "Signed-in-but-forbidden screen — explains the missing permission, offers a request-access action with a sent confirmation, and a back link.",
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
