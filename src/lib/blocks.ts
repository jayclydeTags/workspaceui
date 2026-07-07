import type { ComponentType } from "react"

import { AccessControl01 } from "@/registry/bases/base/blocks/access-control-01/page"
import { AccountLocked } from "@/registry/bases/base/blocks/account-locked/page"
import { AccountSuspended } from "@/registry/bases/base/blocks/account-suspended/page"
import { ApprovalBoard01 } from "@/registry/bases/base/blocks/approval-board-01/page"
import { ActivityFeed01 } from "@/registry/bases/base/blocks/activity-feed-01/page"
import { ActivityLog01 } from "@/registry/bases/base/blocks/activity-log-01/page"
import { Dashboard01 } from "@/registry/bases/base/blocks/dashboard-01/page"
import { ForbiddenWorkspace } from "@/registry/bases/base/blocks/forbidden-workspace/page"
import { ForgotPassword } from "@/registry/bases/base/blocks/forgot-password/page"
import { InvoiceDetail01 } from "@/registry/bases/base/blocks/invoice-detail-01/page"
import { Login } from "@/registry/bases/base/blocks/login/page"
import { LoginSocial } from "@/registry/bases/base/blocks/login-social/page"
import { MagicLinkSent } from "@/registry/bases/base/blocks/magic-link-sent/page"
import { OtpVerify } from "@/registry/bases/base/blocks/otp-verify/page"
import { PendingApproval } from "@/registry/bases/base/blocks/pending-approval/page"
import { ResetPassword } from "@/registry/bases/base/blocks/reset-password/page"
import { TwoFactorChallenge } from "@/registry/bases/base/blocks/two-factor-challenge/page"
import { TwoFactorSetup } from "@/registry/bases/base/blocks/two-factor-setup/page"
import { RecoveryCodes } from "@/registry/bases/base/blocks/recovery-codes/page"
import { Register } from "@/registry/bases/base/blocks/register/page"
import { PayrollRun01 } from "@/registry/bases/base/blocks/payroll-run-01/page"
import { PayrollTasks } from "@/registry/bases/base/blocks/payroll-tasks/page"
import { PayslipDetail01 } from "@/registry/bases/base/blocks/payslip-detail-01/page"
import { ChangePassword } from "@/registry/bases/base/blocks/change-password/page"
import { CompensationTable01 } from "@/registry/bases/base/blocks/compensation-table-01/page"
import { PayrollCalendar01 } from "@/registry/bases/base/blocks/payroll-calendar-01/page"
import { OffcyclePaymentForm01 } from "@/registry/bases/base/blocks/offcycle-payment-form-01/page"
import { PurchaseOrderForm01 } from "@/registry/bases/base/blocks/purchase-order-form-01/page"
import { SessionExpired } from "@/registry/bases/base/blocks/session-expired/page"
import { Settings01 } from "@/registry/bases/base/blocks/settings-01/page"
import { VerifyEmail } from "@/registry/bases/base/blocks/verify-email/page"
import { Unauthorized403 } from "@/registry/bases/base/blocks/unauthorized-403/page"

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
    slug: "login",
    title: "Login",
    description:
      "Email and password sign-in form — inline field validation, invalid-credentials banner, pending state, remember-me, and forgot-password/sign-up links.",
    category: "Authentication",
    Component: Login,
  },
  {
    slug: "register",
    title: "Register",
    description:
      "Account sign-up form with a live password-strength meter, field validation, terms agreement, and a verify-your-email confirmation state.",
    category: "Authentication",
    Component: Register,
  },
  {
    slug: "otp-verify",
    title: "OTP Verify",
    description:
      "One-time passcode entry with a 6-digit segmented input, auto-verify on complete, incorrect-code error, and a countdown-gated resend.",
    category: "Authentication",
    Component: OtpVerify,
  },
  {
    slug: "forgot-password",
    title: "Forgot Password",
    description:
      "Request a password-reset link by email — field validation, pending state, and a neutral check-your-email confirmation that doesn't leak account existence.",
    category: "Authentication",
    Component: ForgotPassword,
  },
  {
    slug: "reset-password",
    title: "Reset Password",
    description:
      "Set-a-new-password form with a live strength meter, confirm-match validation, an expired-link state, and a password-updated confirmation.",
    category: "Authentication",
    Component: ResetPassword,
  },
  {
    slug: "change-password",
    title: "Change Password",
    description:
      "Authenticated in-app password change — current-password re-auth check, new-password strength meter, confirm-match validation, and a changed confirmation.",
    category: "Authentication",
    Component: ChangePassword,
  },
  {
    slug: "two-factor-challenge",
    title: "Two-Factor Challenge",
    description:
      "Post-password 2FA step — authenticator-app code entry with auto-verify, a recovery-code fallback, trust-this-device option, and error states.",
    category: "Authentication",
    Component: TwoFactorChallenge,
  },
  {
    slug: "two-factor-setup",
    title: "Two-Factor Setup",
    description:
      "Authenticator enrollment — QR code, copyable manual setup key, and a 6-digit verify step with error and enabled states.",
    category: "Authentication",
    Component: TwoFactorSetup,
  },
  {
    slug: "recovery-codes",
    title: "Recovery Codes",
    description:
      "Backup-code display with copy, download, and regenerate actions, gated behind an \"I've saved them\" acknowledgement before continuing.",
    category: "Authentication",
    Component: RecoveryCodes,
  },
  {
    slug: "pending-approval",
    title: "Pending Approval",
    description:
      "Account-under-review status screen — explains the pending admin approval, the notification email, and check-status/sign-out actions.",
    category: "Authorization",
    Component: PendingApproval,
  },
  {
    slug: "forbidden-workspace",
    title: "Forbidden Workspace",
    description:
      "Wrong-tenant screen — signed in but not a member of this workspace, with a switcher to workspaces you belong to and a switch-account action.",
    category: "Authorization",
    Component: ForbiddenWorkspace,
  },
  {
    slug: "account-suspended",
    title: "Account Suspended",
    description:
      "Suspended-account screen — shows the suspension reason and offers an appeal action with a submitted confirmation plus a contact-support link.",
    category: "Authorization",
    Component: AccountSuspended,
  },
  {
    slug: "unauthorized-403",
    title: "Unauthorized 403",
    description:
      "Signed-in-but-forbidden screen — explains the missing permission, offers a request-access action with a sent confirmation, and a back link.",
    category: "Authorization",
    Component: Unauthorized403,
  },
  {
    slug: "magic-link-sent",
    title: "Magic Link Sent",
    description:
      "Passwordless check-your-email confirmation after requesting a magic sign-in link — expiry note, cooldown-gated resend, and change-email action.",
    category: "Authentication",
    Component: MagicLinkSent,
  },
  {
    slug: "verify-email",
    title: "Verify Email",
    description:
      "Post-registration confirm-your-email pending screen — cooldown-gated resend and a transition to the email-confirmed success state.",
    category: "Authentication",
    Component: VerifyEmail,
  },
  {
    slug: "login-social",
    title: "Login (Social)",
    description:
      "Sign-in with Google/GitHub SSO buttons over an email-and-password form — provider divider, inline validation, invalid-credentials banner, and pending state.",
    category: "Authentication",
    Component: LoginSocial,
  },
  {
    slug: "session-expired",
    title: "Session Expired",
    description:
      "Re-authentication prompt after an idle timeout — quick password re-entry for the current user, incorrect-password error, and a switch-user action.",
    category: "Authentication",
    Component: SessionExpired,
  },
  {
    slug: "account-locked",
    title: "Account Locked",
    description:
      "Account-locked screen after too many failed sign-in attempts — shows the locked email, a lockout countdown, and reset/support actions.",
    category: "Authentication",
    Component: AccountLocked,
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
