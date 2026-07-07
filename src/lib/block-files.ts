// Source-file manifest for each block's Code tab. `src` is the path (relative
// to the block's registry dir) read at build time via fs; `path` is the display
// path shown in the file tree. Replaces the per-route `?raw` imports (Turbopack
// doesn't support `?raw`) that lived in the old src/app/routes/blocks.*.tsx.
export interface BlockFileRef {
  name: string
  path: string
  src: string
}

export const blockFiles: Record<string, BlockFileRef[]> = {
  "payroll-run-01": [
    { name: "page.tsx", path: "app/payroll-run/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payroll-run/data.ts", src: "data.ts" },
  ],
  "payroll-tasks": [
    { name: "page.tsx", path: "app/payroll-tasks/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payroll-tasks/data.ts", src: "data.ts" },
  ],
  "payslip-detail-01": [
    { name: "page.tsx", path: "app/payslip-detail/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payslip-detail/data.ts", src: "data.ts" },
  ],
  "compensation-table-01": [
    { name: "page.tsx", path: "app/compensation-table/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/compensation-table/data.ts", src: "data.ts" },
  ],
  "payroll-calendar-01": [
    { name: "page.tsx", path: "app/payroll-calendar/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payroll-calendar/data.ts", src: "data.ts" },
  ],
  "offcycle-payment-form-01": [
    { name: "page.tsx", path: "app/offcycle-payment-form/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/offcycle-payment-form/data.ts", src: "data.ts" },
  ],
  department: [
    { name: "page.tsx", path: "app/department/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/department/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/department/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "department-dialog.tsx",
      path: "components/blocks/department/components/department-dialog.tsx",
      src: "components/department-dialog.tsx",
    },
  ],
  "data-table-01": [
    { name: "page.tsx", path: "app/data-table/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/data-table/data.ts", src: "data.ts" },
    {
      name: "columns.tsx",
      path: "components/blocks/data-table-01/components/columns.tsx",
      src: "components/columns.tsx",
    },
    {
      name: "data-table.tsx",
      path: "components/blocks/data-table-01/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
  ],
  "confirm-dialog": [
    { name: "page.tsx", path: "app/confirm-dialog/page.tsx", src: "page.tsx" },
    {
      name: "confirm-dialog.tsx",
      path: "components/blocks/confirm-dialog/components/confirm-dialog.tsx",
      src: "components/confirm-dialog.tsx",
    },
  ],
  "search-filter-bar": [
    { name: "page.tsx", path: "app/search-filter-bar/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/search-filter-bar/data.ts", src: "data.ts" },
    {
      name: "filter-bar.tsx",
      path: "components/blocks/search-filter-bar/components/filter-bar.tsx",
      src: "components/filter-bar.tsx",
    },
  ],
  "bulk-actions-toolbar": [
    { name: "page.tsx", path: "app/bulk-actions-toolbar/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/bulk-actions-toolbar/data.ts", src: "data.ts" },
    {
      name: "bulk-toolbar.tsx",
      path: "components/blocks/bulk-actions-toolbar/components/bulk-toolbar.tsx",
      src: "components/bulk-toolbar.tsx",
    },
  ],
  "detail-tabs": [
    { name: "page.tsx", path: "app/detail-tabs/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/detail-tabs/data.ts", src: "data.ts" },
  ],
  dashboard: [
    { name: "page.tsx", path: "app/dashboard/page.tsx", src: "page.tsx" },
    {
      name: "app-sidebar.tsx",
      path: "components/blocks/dashboard/components/app-sidebar.tsx",
      src: "components/app-sidebar.tsx",
    },
    {
      name: "dashboard-content.tsx",
      path: "components/blocks/dashboard/components/dashboard-content.tsx",
      src: "components/dashboard-content.tsx",
    },
  ],
  "dashboard-01": [
    { name: "page.tsx", path: "app/dashboard/page.tsx", src: "page.tsx" },
    {
      name: "app-sidebar.tsx",
      path: "components/blocks/dashboard-01/components/app-sidebar.tsx",
      src: "components/app-sidebar.tsx",
    },
    {
      name: "dashboard-content.tsx",
      path: "components/blocks/dashboard-01/components/dashboard-content.tsx",
      src: "components/dashboard-content.tsx",
    },
  ],
  "activity-log-01": [
    { name: "page.tsx", path: "app/activity-log/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/activity-log/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/activity-log-01/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
  ],
  "activity-feed-01": [
    { name: "page.tsx", path: "app/activity-feed/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/activity-feed/data.ts", src: "data.ts" },
  ],
  "access-control-01": [
    { name: "page.tsx", path: "app/access-control/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/access-control/data.ts", src: "data.ts" },
    {
      name: "permission-table.tsx",
      path: "components/blocks/access-control-01/components/permission-table.tsx",
      src: "components/permission-table.tsx",
    },
  ],
  "invoice-detail-01": [
    { name: "page.tsx", path: "app/invoice-detail/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/invoice-detail/data.ts", src: "data.ts" },
    {
      name: "invoice-list.tsx",
      path: "components/blocks/invoice-detail-01/components/invoice-list.tsx",
      src: "components/invoice-list.tsx",
    },
    {
      name: "invoice-view.tsx",
      path: "components/blocks/invoice-detail-01/components/invoice-view.tsx",
      src: "components/invoice-view.tsx",
    },
  ],
  "purchase-order-form-01": [
    { name: "page.tsx", path: "app/purchase-order-form/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/purchase-order-form/data.ts", src: "data.ts" },
    {
      name: "step-indicator.tsx",
      path: "components/blocks/purchase-order-form-01/components/step-indicator.tsx",
      src: "components/step-indicator.tsx",
    },
    {
      name: "wizard-steps.tsx",
      path: "components/blocks/purchase-order-form-01/components/wizard-steps.tsx",
      src: "components/wizard-steps.tsx",
    },
  ],
  "approval-board-01": [
    { name: "page.tsx", path: "app/approval-board/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/approval-board/data.ts", src: "data.ts" },
    {
      name: "approval-card.tsx",
      path: "components/blocks/approval-board-01/components/approval-card.tsx",
      src: "components/approval-card.tsx",
    },
    {
      name: "approval-column.tsx",
      path: "components/blocks/approval-board-01/components/approval-column.tsx",
      src: "components/approval-column.tsx",
    },
  ],
  login: [{ name: "page.tsx", path: "app/login/page.tsx", src: "page.tsx" }],
  "login-social": [
    { name: "page.tsx", path: "app/login-social/page.tsx", src: "page.tsx" },
  ],
  "magic-link-sent": [
    { name: "page.tsx", path: "app/magic-link-sent/page.tsx", src: "page.tsx" },
  ],
  register: [
    { name: "page.tsx", path: "app/register/page.tsx", src: "page.tsx" },
  ],
  "verify-email": [
    { name: "page.tsx", path: "app/verify-email/page.tsx", src: "page.tsx" },
  ],
  "otp-verify": [
    { name: "page.tsx", path: "app/otp-verify/page.tsx", src: "page.tsx" },
  ],
  "forgot-password": [
    { name: "page.tsx", path: "app/forgot-password/page.tsx", src: "page.tsx" },
  ],
  "reset-password": [
    { name: "page.tsx", path: "app/reset-password/page.tsx", src: "page.tsx" },
  ],
  "change-password": [
    { name: "page.tsx", path: "app/change-password/page.tsx", src: "page.tsx" },
  ],
  "unauthorized-403": [
    { name: "page.tsx", path: "app/unauthorized-403/page.tsx", src: "page.tsx" },
  ],
  "upgrade-required": [
    { name: "page.tsx", path: "app/upgrade-required/page.tsx", src: "page.tsx" },
  ],
  "forbidden-workspace": [
    {
      name: "page.tsx",
      path: "app/forbidden-workspace/page.tsx",
      src: "page.tsx",
    },
  ],
  "pending-approval": [
    { name: "page.tsx", path: "app/pending-approval/page.tsx", src: "page.tsx" },
  ],
  "account-suspended": [
    {
      name: "page.tsx",
      path: "app/account-suspended/page.tsx",
      src: "page.tsx",
    },
  ],
  "two-factor-challenge": [
    {
      name: "page.tsx",
      path: "app/two-factor-challenge/page.tsx",
      src: "page.tsx",
    },
  ],
  "two-factor-setup": [
    { name: "page.tsx", path: "app/two-factor-setup/page.tsx", src: "page.tsx" },
  ],
  "recovery-codes": [
    { name: "page.tsx", path: "app/recovery-codes/page.tsx", src: "page.tsx" },
  ],
  "account-locked": [
    { name: "page.tsx", path: "app/account-locked/page.tsx", src: "page.tsx" },
  ],
  "session-expired": [
    { name: "page.tsx", path: "app/session-expired/page.tsx", src: "page.tsx" },
  ],
  "settings-01": [
    { name: "page.tsx", path: "app/settings/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/settings/data.ts", src: "data.ts" },
    {
      name: "settings-nav.tsx",
      path: "components/blocks/settings-01/components/settings-nav.tsx",
      src: "components/settings-nav.tsx",
    },
    {
      name: "sections.tsx",
      path: "components/blocks/settings-01/components/sections.tsx",
      src: "components/sections.tsx",
    },
  ],
}
