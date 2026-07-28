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
import { NotificationCenter } from "@/registry/bases/base/blocks/notification-center/page"
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
    slug: "tax-tables",
    title: "Reference Table with Facet Filter",
    description:
      "Searchable tax bracket reference table filterable by jurisdiction, with income range and rate per filing status.",
    category: "Tables",
    Component: TaxTables,
  },
  {
    slug: "payroll-tasks",
    title: "Work Queue with Stat Cards",
    description:
      "Employee payroll task dashboard — pending/overdue/completed overview cards, a searchable task list, and a complete-with-summary dialog.",
    category: "Tables",
    Component: PayrollTasks,
  },
  {
    slug: "compensation-table",
    title: "Table with Computed Columns",
    description:
      "Searchable org-wide salary overview with pay band, last adjustment, and change percentage.",
    category: "Tables",
    Component: CompensationTable,
  },
  {
    slug: "data-table",
    title: "Editable Table",
    description:
      "Editable data table built on DataGrid, DataFilter, and BulkToolbar — filter chips, sorting, inline cell editing, and a contextual bulk-delete toolbar.",
    category: "Tables",
    Component: DataTable01,
  },
  {
    slug: "bulk-actions-toolbar",
    title: "Table with Bulk Actions",
    description:
      "Read-only DataGrid with row selection and select-all, plus a contextual toolbar for bulk export/delete and a confirm dialog for the destructive action.",
    category: "Tables",
    Component: BulkActionsToolbar,
  },
  {
    slug: "search-filter-bar",
    title: "Search + Filter Bar",
    description:
      "Search box with faceted Select filters and a clear-all action over a filtered result list with live count.",
    category: "Tables",
    Component: SearchFilterBar,
  },
  {
    slug: "activity-log",
    title: "Responsive Table (Card Fallback)",
    description:
      "Filterable activity log with a responsive datatable — collapses to cards on narrow panes.",
    category: "Tables",
    Component: ActivityLog,
  },
  {
    slug: "audit-log",
    title: "Before / After Diff Table",
    description:
      "Field-level audit trail — who changed what field, with before → after values, actor avatars, and search/action filters.",
    category: "Tables",
    Component: AuditLog,
  },
  {
    slug: "bank-reconciliation",
    title: "Checklist Table with Running Totals",
    description:
      "Bank reconciliation checklist — mark transactions cleared against a statement balance, with live statement/cleared/difference summary cards.",
    category: "Tables",
    Component: BankReconciliation,
  },
  {
    slug: "stock-levels",
    title: "Table with Derived Status + Inline Adjust",
    description:
      "On-hand stock per SKU and warehouse — searchable, with derived low/out-of-stock badges and a stock-take adjustment dialog.",
    category: "Tables",
    Component: StockLevels,
  },
  {
    slug: "stock-movements",
    title: "Append-only Ledger Table",
    description:
      "Append-only stock ledger — receipts, shipments, adjustments, and transfers with a type filter, running net change, and a record-movement dialog.",
    category: "Tables",
    Component: StockMovements,
  },
  {
    slug: "repayment-schedule",
    title: "Computed Schedule Table",
    description:
      "Amortisation table derived from the loan terms — per-instalment interest/principal split, derived paid/due/overdue status, and in-order payment recording.",
    category: "Tables",
    Component: RepaymentSchedule,
  },
  {
    slug: "employee",
    title: "CRUD Table (Employees)",
    description:
      "Employee directory with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: Employee,
  },
  {
    slug: "deductions-benefits",
    title: "CRUD Table (Plans)",
    description:
      "Deduction and benefit plan list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: DeductionsBenefits,
  },
  {
    slug: "department",
    title: "CRUD Table (Departments)",
    description:
      "Departments table with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: Department,
  },
  {
    slug: "chart-of-accounts",
    title: "CRUD Table (Tree-coded Records)",
    description:
      "Chart of accounts table with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: ChartOfAccounts,
  },
  {
    slug: "bills",
    title: "CRUD Table (Bills)",
    description:
      "Accounts-payable bills list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: Bills,
  },
  {
    slug: "payments",
    title: "CRUD Table (Payments)",
    description:
      "Payments list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: Payments,
  },
  {
    slug: "products",
    title: "CRUD Table (Products)",
    description:
      "Product / SKU catalog list with create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: Products,
  },
  {
    slug: "warehouses",
    title: "CRUD Table with Utilization Bar",
    description:
      "Warehouse list with capacity utilization, create/edit dialog form, row-action menu, and a delete confirmation.",
    category: "CRUD Tables",
    Component: Warehouses,
  },
  {
    slug: "leave-requests",
    title: "CRUD Table with Approve / Reject Actions",
    description:
      "Leave request list with a status filter, approve/reject row actions, a submit-request dialog, and a delete confirmation.",
    category: "CRUD Tables",
    Component: LeaveRequests,
  },
  {
    slug: "attendance",
    title: "CRUD Table with Date Filter",
    description:
      "Daily attendance log with a date filter, punch-derived present/late/absent status, total hours, and create/edit/delete.",
    category: "CRUD Tables",
    Component: Attendance,
  },
  {
    slug: "projects",
    title: "CRUD Table with Progress Bars",
    description:
      "Project portfolio list with a status filter, progress bars, overdue due-date highlighting, and create/edit/delete.",
    category: "CRUD Tables",
    Component: Projects,
  },
  {
    slug: "contacts",
    title: "CRUD Table with Search",
    description:
      "Contact book with search, one-primary-per-account enforced on promote, and a warning for accounts left without a primary.",
    category: "CRUD Tables",
    Component: Contacts,
  },
  {
    slug: "journal-entries",
    title: "Line-Item Form that Must Balance",
    description:
      "Journal entry list with a dynamic debit/credit line-item dialog that validates the entry balances before it can be saved.",
    category: "Guarded CRUD",
    Component: JournalEntries,
  },
  {
    slug: "performance-reviews",
    title: "CRUD with Completion Precondition",
    description:
      "Performance review list with star ratings, a status filter, average-rating summary, and a create/edit dialog that blocks completing an unrated review.",
    category: "Guarded CRUD",
    Component: PerformanceReviews,
  },
  {
    slug: "timesheets",
    title: "CRUD with Locking Lifecycle",
    description:
      "Time entries per project with billable-utilization summary and a draft → submitted → approved lifecycle that locks an entry once submitted.",
    category: "Guarded CRUD",
    Component: Timesheets,
  },
  {
    slug: "project-team",
    title: "CRUD with Capacity + Uniqueness Guards",
    description:
      "Project roster with roles, weekly allocation, and guards that keep one lead on the project and nobody booked past a full week.",
    category: "Guarded CRUD",
    Component: ProjectTeam,
  },
  {
    slug: "leads",
    title: "CRUD with Gated State Transition",
    description:
      "Lead pipeline with a stage filter, hot-lead scoring, qualification rate, and a convert action gated on the lead being qualified.",
    category: "Guarded CRUD",
    Component: Leads,
  },
  {
    slug: "accounts",
    title: "CRUD with Delete Blocked by Dependents",
    description:
      "Account book with tier filter, ARR roll-up, health derived from contact recency, and delete blocked while deals are open.",
    category: "Guarded CRUD",
    Component: Accounts,
  },
  {
    slug: "loan-applications",
    title: "CRUD with Threshold-Gated Approval",
    description:
      "Loan application queue with amortised monthly payment, debt-to-income assessment, and approval blocked above the DTI ceiling.",
    category: "Guarded CRUD",
    Component: LoanApplications,
  },
  {
    slug: "borrowers",
    title: "CRUD with Eligibility Gate",
    description:
      "Borrower register with search, risk grade derived from credit score, KYC gating on eligibility, and delete blocked while loans are active.",
    category: "Guarded CRUD",
    Component: Borrowers,
  },
  {
    slug: "disbursements",
    title: "CRUD Capped by a Parent Total",
    description:
      "Loan disbursement tranches with a loan filter, release/fail settlement, and scheduling blocked from overdrawing the approved principal.",
    category: "Guarded CRUD",
    Component: Disbursements,
  },
  {
    slug: "collateral",
    title: "CRUD with Staleness Guard",
    description:
      "Pledged-asset register with per-type advance rates, lien perfection blocked on a stale appraisal, and an under-secured loan warning.",
    category: "Guarded CRUD",
    Component: CollateralRegister,
  },
  {
    slug: "offcycle-payment-form",
    title: "Single-Purpose Form",
    description:
      "Form for issuing a one-off bonus, correction, or reimbursement outside the regular payroll run.",
    category: "Forms & Wizards",
    Component: OffcyclePaymentForm,
  },
  {
    slug: "import-export",
    title: "CSV Import Wizard + Export",
    description:
      "CSV import wizard — paste or load data, map columns to entity fields with a live preview, then import. Includes a CSV export action.",
    category: "Forms & Wizards",
    Component: ImportExport,
  },
  {
    slug: "file-upload",
    title: "Dropzone Upload with Per-File State",
    description:
      "Attachments panel — click-or-drag dropzone, per-file upload/error states, type icons, retry, and remove.",
    category: "Forms & Wizards",
    Component: FileUpload,
  },
  {
    slug: "purchase-order-form",
    title: "Multi-step Form Wizard",
    description:
      "Three-step wizard for creating a purchase order — vendor details, line items, and review.",
    category: "Forms & Wizards",
    Component: PurchaseOrderForm,
  },
  {
    slug: "confirm-dialog",
    title: "Confirm Dialog",
    description:
      "Reusable confirm-before-you-act dialog for destructive actions — controlled open state, custom title/description/labels, destructive styling.",
    category: "Dialogs",
    Component: ConfirmDialogDemo,
  },
  {
    slug: "record-form-dialog",
    title: "Create / Edit Dialog",
    description:
      "Standalone create/edit dialog — one form handles both add and update, seeded from the record being edited.",
    category: "Dialogs",
    Component: RecordFormDialog,
  },
  {
    slug: "payroll-run",
    title: "Summary + Line Items View",
    description:
      "Payroll run summary with per-employee payslips — gross, deductions, and net pay.",
    category: "Detail Views",
    Component: PayrollRun,
  },
  {
    slug: "payslip-detail",
    title: "Statement / Breakdown View",
    description:
      "Single-employee payslip breakdown — earnings, deductions, and employer contributions with YTD totals.",
    category: "Detail Views",
    Component: PayslipDetail,
  },
  {
    slug: "detail-tabs",
    title: "Detail View with Tabs",
    description:
      "Single-record detail view with a header and Overview / Activity / Orders tabs.",
    category: "Detail Views",
    Component: DetailTabs,
  },
  {
    slug: "record-detail",
    title: "Read-only Record View",
    description:
      "Read-only single-record view — header with avatar/status badge and grouped label/value field sections, no tabs.",
    category: "Detail Views",
    Component: RecordDetail,
  },
  {
    slug: "master-detail",
    title: "Resizable Master–Detail Split",
    description:
      "Resizable list + detail split pane — select a row on the left to view its fields on the right, with an empty state when nothing's selected.",
    category: "Detail Views",
    Component: MasterDetail,
  },
  {
    slug: "invoice-detail",
    title: "Master–Detail that Opens a Tab",
    description:
      "Master-detail invoice workspace — select a row to open its line items in a new tab.",
    category: "Detail Views",
    Component: InvoiceDetail,
  },
  {
    slug: "payroll-calendar",
    title: "Schedule Calendar with Next-Up Highlight",
    description:
      "Monthly pay schedule with timesheet cutoffs, pay dates, and the next upcoming run highlighted.",
    category: "Boards, Grids & Timelines",
    Component: PayrollCalendar,
  },
  {
    slug: "task-board",
    title: "Kanban Board (Drag & Drop)",
    description:
      "Drag-and-drop Kanban board for project tasks — to do / in progress / review / done, with priority, assignee, and a create/edit dialog.",
    category: "Boards, Grids & Timelines",
    Component: TaskBoard,
  },
  {
    slug: "milestones",
    title: "Timeline with Derived State",
    description:
      "Milestone tracker with task-scope progress and a state derived from the due date — completed, overdue, at risk, or on track.",
    category: "Boards, Grids & Timelines",
    Component: Milestones,
  },
  {
    slug: "deals-pipeline",
    title: "Pipeline Board with Stage Roll-ups",
    description:
      "Drag-and-drop deal pipeline with per-stage value, a probability-weighted forecast, and win rate over closed deals.",
    category: "Boards, Grids & Timelines",
    Component: DealsPipeline,
  },
  {
    slug: "bin-location-map",
    title: "Slot / Floor-plan Grid",
    description:
      "Warehouse floor-plan grid of storage bins — assign or clear stock per bin, gated on capacity, single-SKU occupancy, and blocked/quarantine status.",
    category: "Boards, Grids & Timelines",
    Component: BinLocationMap,
  },
  {
    slug: "approval-board",
    title: "Triage Board",
    description:
      "Drag-and-drop Kanban board for triaging expense, purchase order, and time-off approval requests.",
    category: "Boards, Grids & Timelines",
    Component: ApprovalBoard,
  },
  {
    slug: "notifications-inbox",
    title: "Inbox with Read / Unread Tabs",
    description:
      "Notification inbox with All/Unread tabs, per-type icons, unread indicators, mark-one-read on click, and mark-all-read.",
    category: "Feeds & Notifications",
    Component: NotificationsInbox,
  },
  {
    slug: "notification-center",
    title: "Notification Center (Bell + Full Page)",
    description:
      "Notification center with a header bell dropdown (unread badge capped at 9+, 5 most recent, mark-all-read) and a full page filtered by read state, severity, and date range with 20-per-page pagination.",
    category: "Feeds & Notifications",
    Component: NotificationCenter,
  },
  {
    slug: "comments-thread",
    title: "Threaded Comments",
    description:
      "Threaded comments with avatars, inline reply composers, and a top-level composer, with a running comment count.",
    category: "Feeds & Notifications",
    Component: CommentsThread,
  },
  {
    slug: "activity-feed",
    title: "Grouped Activity Timeline",
    description:
      "Grouped activity timeline with type/user filters and running stats.",
    category: "Feeds & Notifications",
    Component: ActivityFeed,
  },
  {
    slug: "inbound-receiving",
    title: "Receive → QC → Put-away Flow",
    description:
      "Record stock arriving against a purchase order and put it away into bins — blocked receiving on a closed/cancelled PO, a QC gate before stock counts as available, and capacity-checked put-away reusing the bin/location-map contract.",
    category: "Multi-step Workflows",
    Component: InboundReceiving,
  },
  {
    slug: "outbound-picking",
    title: "Claim → Pick → Complete Flow",
    description:
      "Claim and fulfil pick lists that draw stock out of bins for an outbound order — blocked picking on a closed/cancelled order, per-line allocations across bins capped at on-hand, short-pick handling, and a picker-claim gate. Emits a pickId + picked-quantity completion record for Shipments.",
    category: "Multi-step Workflows",
    Component: OutboundPicking,
  },
  {
    slug: "inventory-adjustments",
    title: "Variance Approval Flow",
    description:
      "Bin-level count-correction workflow — an absolute physical count raised against a bin with a reason code, where damage/shrinkage may only reduce a count, variance over 10% needs approval before it posts, and a bin held by a pick or receipt is locked. Approval posts to the bin in one step and emits a SKU/warehouse/delta record for stock levels.",
    category: "Multi-step Workflows",
    Component: InventoryAdjustments,
  },
  {
    slug: "shipments",
    title: "Fulfilment Flow with Derived Status",
    description:
      "Outbound fulfilment records that ship a completed pick — a partially-picked order can never ship, a carrier and tracking number are required before a shipment moves to shipped, and a shipment already in transit can no longer be cancelled. Status is derived from the record, never stored: cancelled outranks exception outranks delivered outranks shipped.",
    category: "Multi-step Workflows",
    Component: Shipments,
  },
  {
    slug: "dashboard",
    title: "Sidebar Shell (Icon-collapsible)",
    description:
      "Icon-collapsible sidebar (trigger in the sidebar) with the Workspace component; each tab renders inside the Page component.",
    category: "App Shells",
    Component: Dashboard,
  },
  {
    slug: "dashboard-01",
    title: "Sidebar Shell (Collapsible)",
    description: "Collapsible sidebar nav paired with the Workspace component.",
    category: "App Shells",
    Component: Dashboard01,
  },
  {
    slug: "dashboard-rail",
    title: "Rail + Sidebar Shell",
    description:
      "Fixed icon-only app rail (logo, app switcher, settings, profile) beside a collapsible nav sidebar and the Workspace component.",
    category: "App Shells",
    Component: DashboardRail,
  },
  {
    slug: "access-control",
    title: "Permission Matrix",
    description:
      "Manage role permissions across resources with a per-role permission matrix.",
    category: "Settings & Permissions",
    Component: AccessControl,
  },
  {
    slug: "settings",
    title: "Sectioned Settings Page",
    description:
      "Sectioned workspace settings — company profile, notifications, billing, and security.",
    category: "Settings & Permissions",
    Component: Settings,
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
]
