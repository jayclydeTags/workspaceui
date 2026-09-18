import type { ComponentType } from "react"

import { AccessControl } from "@/registry/bases/base/blocks/access-control/page"
import { AccountLocked } from "@/registry/bases/base/blocks/account-locked/page"
import { AccountSuspended } from "@/registry/bases/base/blocks/account-suspended/page"
import { ApprovalBoard } from "@/registry/bases/base/blocks/approval-board/page"
import { CommentsThread } from "@/registry/bases/base/blocks/comments-thread/page"
import { ConfirmDialogDemo } from "@/registry/bases/base/blocks/confirm-dialog/page"
import { ActivityFeed } from "@/registry/bases/base/blocks/activity-feed/page"
import { Dashboard } from "@/registry/bases/base/blocks/dashboard/page"
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
import { PayslipDetail } from "@/registry/bases/base/blocks/payslip-detail/page"
import { ChangePassword } from "@/registry/bases/base/blocks/change-password/page"
import { PayrollCalendar } from "@/registry/bases/base/blocks/payroll-calendar/page"
import { OffcyclePaymentForm } from "@/registry/bases/base/blocks/offcycle-payment-form/page"
import { PurchaseOrderForm } from "@/registry/bases/base/blocks/purchase-order-form/page"
import { TaskBoard } from "@/registry/bases/base/blocks/task-board/page"
import { Milestones } from "@/registry/bases/base/blocks/milestones/page"
import { DealsPipeline } from "@/registry/bases/base/blocks/deals-pipeline/page"
import { BinLocationMap } from "@/registry/bases/base/blocks/bin-location-map/page"
import { InboundReceiving } from "@/registry/bases/base/blocks/inbound-receiving/page"
import { OutboundPicking } from "@/registry/bases/base/blocks/outbound-picking/page"
import { InventoryAdjustments } from "@/registry/bases/base/blocks/inventory-adjustments/page"
import { Shipments } from "@/registry/bases/base/blocks/shipments/page"
import { SessionExpired } from "@/registry/bases/base/blocks/session-expired/page"
import { Settings } from "@/registry/bases/base/blocks/settings/page"
import { VerifyEmail } from "@/registry/bases/base/blocks/verify-email/page"
import { Unauthorized403 } from "@/registry/bases/base/blocks/unauthorized-403/page"
import { UpgradeRequired } from "@/registry/bases/base/blocks/upgrade-required/page"
import { Navbar01 } from "@/blocks/navbar-01/navbar"
import { Navbar02 } from "@/blocks/navbar-02/navbar"
import { Navbar03 } from "@/blocks/navbar-03/navbar"
import { Navbar04 } from "@/blocks/navbar-04/navbar"
import { Navbar05 } from "@/blocks/navbar-05/navbar"
import { Navbar06 } from "@/blocks/navbar-06/navbar"
import { Navbar07 } from "@/blocks/navbar-07/navbar"
import { Navbar08 } from "@/blocks/navbar-08/navbar"
import { Navbar09 } from "@/blocks/navbar-09/navbar"
import { Navbar10 } from "@/blocks/navbar-10/navbar"
import { Navbar11 } from "@/blocks/navbar-11/navbar"
import { Navbar12 } from "@/blocks/navbar-12/navbar"

// Which blocks the gallery can render, keyed by slug. Every other fact about a
// block — title, description, category, files — comes from registry.json; this
// map exists only because a React component can't live in JSON. Imported by the
// gallery routes alone so the 52 block components stay code-split to /blocks.
export const blockComponents: Record<string, ComponentType> = {
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

// Copy-only blocks (lib/copy-blocks.ts): rendered in the gallery like the ones
// above but not in registry.json, so kept in their own map — the registry
// tests compare blockComponents against registry.json one-to-one.
export const copyBlockComponents: Record<string, ComponentType> = {
  "navbar-01": Navbar01,
  "navbar-02": Navbar02,
  "navbar-03": Navbar03,
  "navbar-04": Navbar04,
  "navbar-05": Navbar05,
  "navbar-06": Navbar06,
  "navbar-07": Navbar07,
  "navbar-08": Navbar08,
  "navbar-09": Navbar09,
  "navbar-10": Navbar10,
  "navbar-11": Navbar11,
  "navbar-12": Navbar12,
}

/** Every block the gallery can render, registry and copy-only alike. */
export const galleryComponents: Record<string, ComponentType> = {
  ...blockComponents,
  ...copyBlockComponents,
}
