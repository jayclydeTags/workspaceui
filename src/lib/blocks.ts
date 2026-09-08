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
import { Dashboard02 } from "@/registry/bases/base/blocks/dashboard-02/page"
import { DashboardRail } from "@/registry/bases/base/blocks/dashboard-rail/page"
import { DashboardShell } from "@/registry/bases/base/blocks/dashboard-shell/page"
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
import { TaxTables } from "@/registry/bases/base/blocks/tax-tables/page"
import { PayrollTasks } from "@/registry/bases/base/blocks/payroll-tasks/page"
import { PayslipDetail } from "@/registry/bases/base/blocks/payslip-detail/page"
import { ChangePassword } from "@/registry/bases/base/blocks/change-password/page"
import { CompensationTable } from "@/registry/bases/base/blocks/compensation-table/page"
import { PayrollCalendar } from "@/registry/bases/base/blocks/payroll-calendar/page"
import { OffcyclePaymentForm } from "@/registry/bases/base/blocks/offcycle-payment-form/page"
import { PurchaseOrderForm } from "@/registry/bases/base/blocks/purchase-order-form/page"
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
import { Settings } from "@/registry/bases/base/blocks/settings/page"
import { VerifyEmail } from "@/registry/bases/base/blocks/verify-email/page"
import { Unauthorized403 } from "@/registry/bases/base/blocks/unauthorized-403/page"
import { UpgradeRequired } from "@/registry/bases/base/blocks/upgrade-required/page"

// Which blocks the gallery can render, keyed by slug. Every other fact about a
// block — title, description, category, files — comes from registry.json; this
// map exists only because a React component can't live in JSON. Imported by the
// gallery routes alone so the 81 block components stay code-split to /blocks.
export const blockComponents: Record<string, ComponentType> = {
  "tax-tables": TaxTables,
  "payroll-tasks": PayrollTasks,
  "compensation-table": CompensationTable,
  "data-table": DataTable01,
  "bulk-actions-toolbar": BulkActionsToolbar,
  "activity-log": ActivityLog,
  "audit-log": AuditLog,
  "bank-reconciliation": BankReconciliation,
  "stock-levels": StockLevels,
  "stock-movements": StockMovements,
  "repayment-schedule": RepaymentSchedule,
  employee: Employee,
  department: Department,
  products: Products,
  warehouses: Warehouses,
  "leave-requests": LeaveRequests,
  attendance: Attendance,
  projects: Projects,
  contacts: Contacts,
  "journal-entries": JournalEntries,
  "performance-reviews": PerformanceReviews,
  timesheets: Timesheets,
  "project-team": ProjectTeam,
  leads: Leads,
  accounts: Accounts,
  "loan-applications": LoanApplications,
  borrowers: Borrowers,
  disbursements: Disbursements,
  collateral: CollateralRegister,
  "offcycle-payment-form": OffcyclePaymentForm,
  "import-export": ImportExport,
  "file-upload": FileUpload,
  "purchase-order-form": PurchaseOrderForm,
  "confirm-dialog": ConfirmDialogDemo,
  "record-form-dialog": RecordFormDialog,
  "payroll-run": PayrollRun,
  "payslip-detail": PayslipDetail,
  "detail-tabs": DetailTabs,
  "record-detail": RecordDetail,
  "master-detail": MasterDetail,
  "invoice-detail": InvoiceDetail,
  "payroll-calendar": PayrollCalendar,
  "task-board": TaskBoard,
  milestones: Milestones,
  "deals-pipeline": DealsPipeline,
  "bin-location-map": BinLocationMap,
  "approval-board": ApprovalBoard,
  "notifications-inbox": NotificationsInbox,
  "notification-center": NotificationCenter,
  "comments-thread": CommentsThread,
  "activity-feed": ActivityFeed,
  "inbound-receiving": InboundReceiving,
  "outbound-picking": OutboundPicking,
  "inventory-adjustments": InventoryAdjustments,
  shipments: Shipments,
  dashboard: Dashboard,
  "dashboard-01": Dashboard01,
  "dashboard-02": Dashboard02,
  "dashboard-rail": DashboardRail,
  "dashboard-shell": DashboardShell,
  "access-control": AccessControl,
  settings: Settings,
  login: Login,
  register: Register,
  "otp-verify": OtpVerify,
  "forgot-password": ForgotPassword,
  "reset-password": ResetPassword,
  "change-password": ChangePassword,
  "two-factor-challenge": TwoFactorChallenge,
  "two-factor-setup": TwoFactorSetup,
  "recovery-codes": RecoveryCodes,
  "magic-link-sent": MagicLinkSent,
  "verify-email": VerifyEmail,
  "login-social": LoginSocial,
  "session-expired": SessionExpired,
  "account-locked": AccountLocked,
  "pending-approval": PendingApproval,
  "forbidden-workspace": ForbiddenWorkspace,
  "account-suspended": AccountSuspended,
  "unauthorized-403": Unauthorized403,
  "upgrade-required": UpgradeRequired,
}
