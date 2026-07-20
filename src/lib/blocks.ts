import type { ComponentType } from "react"

import { AccessControl } from "@/registry/bases/base/blocks/access-control/page"
import { AccountLocked } from "@/registry/bases/base/blocks/account-locked/page"
import { AccountSuspended } from "@/registry/bases/base/blocks/account-suspended/page"
import { ApprovalBoard } from "@/registry/bases/base/blocks/approval-board/page"
import { AuditLog } from "@/registry/bases/base/blocks/audit-log/page"
import { BulkActionsToolbar } from "@/registry/bases/base/blocks/bulk-actions-toolbar/page"
import { CommentsThread } from "@/registry/bases/base/blocks/comments-thread/page"
import { ConfirmDialogDemo } from "@/registry/bases/base/blocks/confirm-dialog/page"
import { ActivityFeed } from "@/registry/bases/base/blocks/activity-feed/page"
import { ActivityLog } from "@/registry/bases/base/blocks/activity-log/page"
import { Dashboard } from "@/registry/bases/base/blocks/dashboard/page"
import { DataTable01 } from "@/registry/bases/base/blocks/data-table/page"
import { Department } from "@/registry/bases/base/blocks/department/page"
import { DetailTabs } from "@/registry/bases/base/blocks/detail-tabs/page"
import { Dashboard01 } from "@/registry/bases/base/blocks/dashboard-01/page"
import { DashboardRail } from "@/registry/bases/base/blocks/dashboard-rail/page"
import { FileUpload } from "@/registry/bases/base/blocks/file-upload/page"
import { ForbiddenWorkspace } from "@/registry/bases/base/blocks/forbidden-workspace/page"
import { ForgotPassword } from "@/registry/bases/base/blocks/forgot-password/page"
import { ImportExport } from "@/registry/bases/base/blocks/import-export/page"
import { InvoiceDetail } from "@/registry/bases/base/blocks/invoice-detail/page"
import { Login } from "@/registry/bases/base/blocks/login/page"
import { LoginSocial } from "@/registry/bases/base/blocks/login-social/page"
import { MagicLinkSent } from "@/registry/bases/base/blocks/magic-link-sent/page"
import { MasterDetail } from "@/registry/bases/base/blocks/master-detail/page"
import { NotificationsInbox } from "@/registry/bases/base/blocks/notifications-inbox/page"
import { OtpVerify } from "@/registry/bases/base/blocks/otp-verify/page"
import { PendingApproval } from "@/registry/bases/base/blocks/pending-approval/page"
import { RecordDetail } from "@/registry/bases/base/blocks/record-detail/page"
import { RecordFormDialog } from "@/registry/bases/base/blocks/record-form-dialog/page"
import { ResetPassword } from "@/registry/bases/base/blocks/reset-password/page"
import { TwoFactorChallenge } from "@/registry/bases/base/blocks/two-factor-challenge/page"
import { TwoFactorSetup } from "@/registry/bases/base/blocks/two-factor-setup/page"
import { RecoveryCodes } from "@/registry/bases/base/blocks/recovery-codes/page"
import { Register } from "@/registry/bases/base/blocks/register/page"
import { PayrollRun } from "@/registry/bases/base/blocks/payroll-run/page"
import { Employee } from "@/registry/bases/base/blocks/employee/page"
import { DeductionsBenefits } from "@/registry/bases/base/blocks/deductions-benefits/page"
import { TaxTables } from "@/registry/bases/base/blocks/tax-tables/page"
import { PayrollTasks } from "@/registry/bases/base/blocks/payroll-tasks/page"
import { PayslipDetail } from "@/registry/bases/base/blocks/payslip-detail/page"
import { ChangePassword } from "@/registry/bases/base/blocks/change-password/page"
import { CompensationTable } from "@/registry/bases/base/blocks/compensation-table/page"
import { PayrollCalendar } from "@/registry/bases/base/blocks/payroll-calendar/page"
import { OffcyclePaymentForm } from "@/registry/bases/base/blocks/offcycle-payment-form/page"
import { PurchaseOrderForm } from "@/registry/bases/base/blocks/purchase-order-form/page"
import { ChartOfAccounts } from "@/registry/bases/base/blocks/chart-of-accounts/page"
import { Bills } from "@/registry/bases/base/blocks/bills/page"
import { Payments } from "@/registry/bases/base/blocks/payments/page"
import { Products } from "@/registry/bases/base/blocks/products/page"
import { StockLevels } from "@/registry/bases/base/blocks/stock-levels/page"
import { StockMovements } from "@/registry/bases/base/blocks/stock-movements/page"
import { Warehouses } from "@/registry/bases/base/blocks/warehouses/page"
import { LeaveRequests } from "@/registry/bases/base/blocks/leave-requests/page"
import { Attendance } from "@/registry/bases/base/blocks/attendance/page"
import { PerformanceReviews } from "@/registry/bases/base/blocks/performance-reviews/page"
import { Projects } from "@/registry/bases/base/blocks/projects/page"
import { TaskBoard } from "@/registry/bases/base/blocks/task-board/page"
import { Timesheets } from "@/registry/bases/base/blocks/timesheets/page"
import { Milestones } from "@/registry/bases/base/blocks/milestones/page"
import { ProjectTeam } from "@/registry/bases/base/blocks/project-team/page"
import { Leads } from "@/registry/bases/base/blocks/leads/page"
import { Contacts } from "@/registry/bases/base/blocks/contacts/page"
import { Accounts } from "@/registry/bases/base/blocks/accounts/page"
import { DealsPipeline } from "@/registry/bases/base/blocks/deals-pipeline/page"
import { LoanApplications } from "@/registry/bases/base/blocks/loan-applications/page"
import { Borrowers } from "@/registry/bases/base/blocks/borrowers/page"
import { RepaymentSchedule } from "@/registry/bases/base/blocks/repayment-schedule/page"
import { Disbursements } from "@/registry/bases/base/blocks/disbursements/page"
import { CollateralRegister } from "@/registry/bases/base/blocks/collateral/page"
import { BinLocationMap } from "@/registry/bases/base/blocks/bin-location-map/page"
import { InboundReceiving } from "@/registry/bases/base/blocks/inbound-receiving/page"
import { OutboundPicking } from "@/registry/bases/base/blocks/outbound-picking/page"
import { InventoryAdjustments } from "@/registry/bases/base/blocks/inventory-adjustments/page"
import { Shipments } from "@/registry/bases/base/blocks/shipments/page"
import { JournalEntries } from "@/registry/bases/base/blocks/journal-entries/page"
import { BankReconciliation } from "@/registry/bases/base/blocks/bank-reconciliation/page"
import { SessionExpired } from "@/registry/bases/base/blocks/session-expired/page"
import { SearchFilterBar } from "@/registry/bases/base/blocks/search-filter-bar/page"
import { Settings } from "@/registry/bases/base/blocks/settings/page"
import { VerifyEmail } from "@/registry/bases/base/blocks/verify-email/page"
import { Unauthorized403 } from "@/registry/bases/base/blocks/unauthorized-403/page"
import { UpgradeRequired } from "@/registry/bases/base/blocks/upgrade-required/page"

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
    slug: "payroll-run",
    title: "Payroll Run",
    description:
      "Payroll run summary with per-employee payslips — gross, deductions, and net pay.",
    category: "Payroll",
    Component: PayrollRun,
  },
  {
    slug: "employee",
    title: "Employee",
    description:
      "Employee directory with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "Payroll",
    Component: Employee,
  },
  {
    slug: "deductions-benefits",
    title: "Deductions & Benefits",
    description:
      "Deduction and benefit plan list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "Payroll",
    Component: DeductionsBenefits,
  },
  {
    slug: "tax-tables",
    title: "Tax Tables",
    description:
      "Searchable tax bracket reference table filterable by jurisdiction, with income range and rate per filing status.",
    category: "Payroll",
    Component: TaxTables,
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
    slug: "payslip-detail",
    title: "Payslip Detail",
    description:
      "Single-employee payslip breakdown — earnings, deductions, and employer contributions with YTD totals.",
    category: "Payroll",
    Component: PayslipDetail,
  },
  {
    slug: "compensation-table",
    title: "Compensation Table",
    description:
      "Searchable org-wide salary overview with pay band, last adjustment, and change percentage.",
    category: "Payroll",
    Component: CompensationTable,
  },
  {
    slug: "payroll-calendar",
    title: "Payroll Calendar",
    description:
      "Monthly pay schedule with timesheet cutoffs, pay dates, and the next upcoming run highlighted.",
    category: "Payroll",
    Component: PayrollCalendar,
  },
  {
    slug: "offcycle-payment-form",
    title: "Off-cycle Payment Form",
    description:
      "Form for issuing a one-off bonus, correction, or reimbursement outside the regular payroll run.",
    category: "Payroll",
    Component: OffcyclePaymentForm,
  },
  {
    slug: "data-table",
    title: "Data Table",
    description:
      "Generic TanStack data table — sortable columns, column filter, column visibility, row selection, and pagination.",
    category: "CRUD",
    Component: DataTable01,
  },
  {
    slug: "bulk-actions-toolbar",
    title: "Bulk Actions Toolbar",
    description:
      "Row selection with select-all and a contextual toolbar for bulk export/delete, with a confirm dialog for the destructive action.",
    category: "CRUD",
    Component: BulkActionsToolbar,
  },
  {
    slug: "confirm-dialog",
    title: "Confirm Dialog",
    description:
      "Reusable confirm-before-you-act dialog for destructive actions — controlled open state, custom title/description/labels, destructive styling.",
    category: "CRUD",
    Component: ConfirmDialogDemo,
  },
  {
    slug: "search-filter-bar",
    title: "Search + Filter Bar",
    description:
      "Search box with faceted Select filters and a clear-all action over a filtered result list with live count.",
    category: "CRUD",
    Component: SearchFilterBar,
  },
  {
    slug: "detail-tabs",
    title: "Detail Tabs",
    description:
      "Single-record detail view with a header and Overview / Activity / Orders tabs.",
    category: "CRUD",
    Component: DetailTabs,
  },
  {
    slug: "record-form-dialog",
    title: "Record Form Dialog",
    description:
      "Standalone create/edit dialog — one form handles both add and update, seeded from the record being edited.",
    category: "CRUD",
    Component: RecordFormDialog,
  },
  {
    slug: "record-detail",
    title: "Record Detail",
    description:
      "Read-only single-record view — header with avatar/status badge and grouped label/value field sections, no tabs.",
    category: "CRUD",
    Component: RecordDetail,
  },
  {
    slug: "master-detail",
    title: "Master-Detail",
    description:
      "Resizable list + detail split pane — select a row on the left to view its fields on the right, with an empty state when nothing's selected.",
    category: "CRUD",
    Component: MasterDetail,
  },
  {
    slug: "department",
    title: "Department",
    description:
      "Departments table with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD",
    Component: Department,
  },
  {
    slug: "import-export",
    title: "Import / Export",
    description:
      "CSV import wizard — paste or load data, map columns to entity fields with a live preview, then import. Includes a CSV export action.",
    category: "CRUD",
    Component: ImportExport,
  },
  {
    slug: "file-upload",
    title: "File Upload",
    description:
      "Attachments panel — click-or-drag dropzone, per-file upload/error states, type icons, retry, and remove.",
    category: "CRUD",
    Component: FileUpload,
  },
  {
    slug: "notifications-inbox",
    title: "Notifications Inbox",
    description:
      "Notification inbox with All/Unread tabs, per-type icons, unread indicators, mark-one-read on click, and mark-all-read.",
    category: "Communication",
    Component: NotificationsInbox,
  },
  {
    slug: "comments-thread",
    title: "Comments Thread",
    description:
      "Threaded comments with avatars, inline reply composers, and a top-level composer, with a running comment count.",
    category: "Communication",
    Component: CommentsThread,
  },
  {
    slug: "dashboard",
    title: "Dashboard",
    description:
      "Icon-collapsible sidebar (trigger in the sidebar) with the Workspace component; each tab renders inside the Page component.",
    category: "Dashboard",
    Component: Dashboard,
  },
  {
    slug: "dashboard-01",
    title: "Dashboard 01",
    description: "Collapsible sidebar nav paired with the Workspace component.",
    category: "Dashboard",
    Component: Dashboard01,
  },
  {
    slug: "dashboard-rail",
    title: "Dashboard Rail",
    description:
      "Fixed icon-only app rail (logo, app switcher, settings, profile) beside a collapsible nav sidebar and the Workspace component.",
    category: "Dashboard",
    Component: DashboardRail,
  },
  {
    slug: "activity-log",
    title: "Activity Log",
    description:
      "Filterable activity log with a responsive datatable — collapses to cards on narrow panes.",
    category: "Activity",
    Component: ActivityLog,
  },
  {
    slug: "activity-feed",
    title: "Activity Feed",
    description:
      "Grouped activity timeline with type/user filters and running stats.",
    category: "Activity",
    Component: ActivityFeed,
  },
  {
    slug: "audit-log",
    title: "Audit Log",
    description:
      "Field-level audit trail — who changed what field, with before → after values, actor avatars, and search/action filters.",
    category: "Activity",
    Component: AuditLog,
  },
  {
    slug: "access-control",
    title: "Access Control",
    description:
      "Manage role permissions across resources with a per-role permission matrix.",
    category: "Access",
    Component: AccessControl,
  },
  {
    slug: "invoice-detail",
    title: "Invoice Detail",
    description:
      "Master-detail invoice workspace — select a row to open its line items in a new tab.",
    category: "Finance",
    Component: InvoiceDetail,
  },
  {
    slug: "purchase-order-form",
    title: "Purchase Order Form",
    description:
      "Three-step wizard for creating a purchase order — vendor details, line items, and review.",
    category: "Finance",
    Component: PurchaseOrderForm,
  },
  {
    slug: "chart-of-accounts",
    title: "Chart of Accounts",
    description:
      "Chart of accounts table with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "Finance",
    Component: ChartOfAccounts,
  },
  {
    slug: "bills",
    title: "Bills",
    description:
      "Accounts-payable bills list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "Finance",
    Component: Bills,
  },
  {
    slug: "payments",
    title: "Payments",
    description:
      "Payments list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "Finance",
    Component: Payments,
  },
  {
    slug: "journal-entries",
    title: "Journal Entries",
    description:
      "Journal entry list with a dynamic debit/credit line-item dialog that validates the entry balances before it can be saved.",
    category: "Finance",
    Component: JournalEntries,
  },
  {
    slug: "bank-reconciliation",
    title: "Bank Reconciliation",
    description:
      "Bank reconciliation checklist — mark transactions cleared against a statement balance, with live statement/cleared/difference summary cards.",
    category: "Finance",
    Component: BankReconciliation,
  },
  {
    slug: "products",
    title: "Products",
    description:
      "Product / SKU catalog list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "Inventory",
    Component: Products,
  },
  {
    slug: "warehouses",
    title: "Warehouses",
    description:
      "Warehouse list with capacity utilization, create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "Inventory",
    Component: Warehouses,
  },
  {
    slug: "stock-levels",
    title: "Stock Levels",
    description:
      "On-hand stock per SKU and warehouse — searchable, with derived low/out-of-stock badges and a stock-take adjustment dialog.",
    category: "Inventory",
    Component: StockLevels,
  },
  {
    slug: "stock-movements",
    title: "Stock Movements",
    description:
      "Append-only stock ledger — receipts, shipments, adjustments, and transfers with a type filter, running net change, and a record-movement dialog.",
    category: "Inventory",
    Component: StockMovements,
  },
  {
    slug: "leave-requests",
    title: "Leave Requests",
    description:
      "Leave request list with a status filter, approve/reject row actions, a submit-request dialog, and a delete confirmation.",
    category: "HRIS",
    Component: LeaveRequests,
  },
  {
    slug: "attendance",
    title: "Attendance",
    description:
      "Daily attendance log with a date filter, punch-derived present/late/absent status, total hours, and create/edit/delete.",
    category: "HRIS",
    Component: Attendance,
  },
  {
    slug: "performance-reviews",
    title: "Performance Reviews",
    description:
      "Performance review list with star ratings, a status filter, average-rating summary, and a create/edit dialog that blocks completing an unrated review.",
    category: "HRIS",
    Component: PerformanceReviews,
  },
  {
    slug: "projects",
    title: "Projects",
    description:
      "Project portfolio list with a status filter, progress bars, overdue due-date highlighting, and create/edit/delete.",
    category: "Project management",
    Component: Projects,
  },
  {
    slug: "task-board",
    title: "Task Board",
    description:
      "Drag-and-drop Kanban board for project tasks — to do / in progress / review / done, with priority, assignee, and a create/edit dialog.",
    category: "Project management",
    Component: TaskBoard,
  },
  {
    slug: "timesheets",
    title: "Timesheets",
    description:
      "Time entries per project with billable-utilization summary and a draft → submitted → approved lifecycle that locks an entry once submitted.",
    category: "Project management",
    Component: Timesheets,
  },
  {
    slug: "milestones",
    title: "Milestones",
    description:
      "Milestone tracker with task-scope progress and a state derived from the due date — completed, overdue, at risk, or on track.",
    category: "Project management",
    Component: Milestones,
  },
  {
    slug: "project-team",
    title: "Project Team",
    description:
      "Project roster with roles, weekly allocation, and guards that keep one lead on the project and nobody booked past a full week.",
    category: "Project management",
    Component: ProjectTeam,
  },
  {
    slug: "leads",
    title: "Leads",
    description:
      "Lead pipeline with a stage filter, hot-lead scoring, qualification rate, and a convert action gated on the lead being qualified.",
    category: "CRM",
    Component: Leads,
  },
  {
    slug: "contacts",
    title: "Contacts",
    description:
      "Contact book with search, one-primary-per-account enforced on promote, and a warning for accounts left without a primary.",
    category: "CRM",
    Component: Contacts,
  },
  {
    slug: "accounts",
    title: "Accounts",
    description:
      "Account book with tier filter, ARR roll-up, health derived from contact recency, and delete blocked while deals are open.",
    category: "CRM",
    Component: Accounts,
  },
  {
    slug: "deals-pipeline",
    title: "Deals Pipeline",
    description:
      "Drag-and-drop deal pipeline with per-stage value, a probability-weighted forecast, and win rate over closed deals.",
    category: "CRM",
    Component: DealsPipeline,
  },
  {
    slug: "loan-applications",
    title: "Loan Applications",
    description:
      "Loan application queue with amortised monthly payment, debt-to-income assessment, and approval blocked above the DTI ceiling.",
    category: "Lending",
    Component: LoanApplications,
  },
  {
    slug: "borrowers",
    title: "Borrowers",
    description:
      "Borrower register with search, risk grade derived from credit score, KYC gating on eligibility, and delete blocked while loans are active.",
    category: "Lending",
    Component: Borrowers,
  },
  {
    slug: "repayment-schedule",
    title: "Repayment Schedule",
    description:
      "Amortisation table derived from the loan terms — per-instalment interest/principal split, derived paid/due/overdue status, and in-order payment recording.",
    category: "Lending",
    Component: RepaymentSchedule,
  },
  {
    slug: "disbursements",
    title: "Disbursements",
    description:
      "Loan disbursement tranches with a loan filter, release/fail settlement, and scheduling blocked from overdrawing the approved principal.",
    category: "Lending",
    Component: Disbursements,
  },
  {
    slug: "collateral",
    title: "Collateral",
    description:
      "Pledged-asset register with per-type advance rates, lien perfection blocked on a stale appraisal, and an under-secured loan warning.",
    category: "Lending",
    Component: CollateralRegister,
  },
  {
    slug: "bin-location-map",
    title: "Bin / Location Map",
    description:
      "Warehouse floor-plan grid of storage bins — assign or clear stock per bin, gated on capacity, single-SKU occupancy, and blocked/quarantine status.",
    category: "Warehouse",
    Component: BinLocationMap,
  },
  {
    slug: "inbound-receiving",
    title: "Inbound / Receiving",
    description:
      "Record stock arriving against a purchase order and put it away into bins — blocked receiving on a closed/cancelled PO, a QC gate before stock counts as available, and capacity-checked put-away reusing the bin/location-map contract.",
    category: "Warehouse",
    Component: InboundReceiving,
  },
  {
    slug: "outbound-picking",
    title: "Outbound / Picking",
    description:
      "Claim and fulfil pick lists that draw stock out of bins for an outbound order — blocked picking on a closed/cancelled order, per-line allocations across bins capped at on-hand, short-pick handling, and a picker-claim gate. Emits a pickId + picked-quantity completion record for Shipments.",
    category: "Warehouse",
    Component: OutboundPicking,
  },
  {
    slug: "inventory-adjustments",
    title: "Inventory Adjustments",
    description:
      "Bin-level count-correction workflow — an absolute physical count raised against a bin with a reason code, where damage/shrinkage may only reduce a count, variance over 10% needs approval before it posts, and a bin held by a pick or receipt is locked. Approval posts to the bin in one step and emits a SKU/warehouse/delta record for stock levels.",
    category: "Warehouse",
    Component: InventoryAdjustments,
  },
  {
    slug: "shipments",
    title: "Shipments",
    description:
      "Outbound fulfilment records that ship a completed pick — a partially-picked order can never ship, a carrier and tracking number are required before a shipment moves to shipped, and a shipment already in transit can no longer be cancelled. Status is derived from the record, never stored: cancelled outranks exception outranks delivered outranks shipped.",
    category: "Warehouse",
    Component: Shipments,
  },
  {
    slug: "approval-board",
    title: "Approval Board",
    description:
      "Drag-and-drop Kanban board for triaging expense, purchase order, and time-off approval requests.",
    category: "Operations",
    Component: ApprovalBoard,
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
      'Backup-code display with copy, download, and regenerate actions, gated behind an "I\'ve saved them" acknowledgement before continuing.',
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
    slug: "upgrade-required",
    title: "Upgrade Required",
    description:
      "Plan-gated feature screen — a signed-in user hits a Pro-only feature, with the perks it unlocks, an upgrade action, and an ask-an-admin fallback that confirms once sent.",
    category: "Authorization",
    Component: UpgradeRequired,
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
    slug: "settings",
    title: "Settings",
    description:
      "Sectioned workspace settings — company profile, notifications, billing, and security.",
    category: "Settings",
    Component: Settings,
  },
]
