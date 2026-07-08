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
  "payroll-run": [
    { name: "page.tsx", path: "app/payroll-run/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payroll-run/data.ts", src: "data.ts" },
  ],
  "employee": [
    { name: "page.tsx", path: "app/employee/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/employee/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/employee/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "employee-dialog.tsx",
      path: "components/blocks/employee/components/employee-dialog.tsx",
      src: "components/employee-dialog.tsx",
    },
  ],
  "deductions-benefits": [
    {
      name: "page.tsx",
      path: "app/deductions-benefits/page.tsx",
      src: "page.tsx",
    },
    {
      name: "data.ts",
      path: "app/deductions-benefits/data.ts",
      src: "data.ts",
    },
    {
      name: "data-table.tsx",
      path: "components/blocks/deductions-benefits/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "item-dialog.tsx",
      path: "components/blocks/deductions-benefits/components/item-dialog.tsx",
      src: "components/item-dialog.tsx",
    },
  ],
  "tax-tables": [
    { name: "page.tsx", path: "app/tax-tables/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/tax-tables/data.ts", src: "data.ts" },
  ],
  "chart-of-accounts": [
    {
      name: "page.tsx",
      path: "app/chart-of-accounts/page.tsx",
      src: "page.tsx",
    },
    {
      name: "data.ts",
      path: "app/chart-of-accounts/data.ts",
      src: "data.ts",
    },
    {
      name: "data-table.tsx",
      path: "components/blocks/chart-of-accounts/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "account-dialog.tsx",
      path: "components/blocks/chart-of-accounts/components/account-dialog.tsx",
      src: "components/account-dialog.tsx",
    },
  ],
  "products": [
    { name: "page.tsx", path: "app/products/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/products/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/products/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "product-dialog.tsx",
      path: "components/blocks/products/components/product-dialog.tsx",
      src: "components/product-dialog.tsx",
    },
  ],
  "warehouses": [
    { name: "page.tsx", path: "app/warehouses/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/warehouses/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/warehouses/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "warehouse-dialog.tsx",
      path: "components/blocks/warehouses/components/warehouse-dialog.tsx",
      src: "components/warehouse-dialog.tsx",
    },
  ],
  "stock-levels": [
    { name: "page.tsx", path: "app/stock-levels/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/stock-levels/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/stock-levels/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "adjust-dialog.tsx",
      path: "components/blocks/stock-levels/components/adjust-dialog.tsx",
      src: "components/adjust-dialog.tsx",
    },
  ],
  "stock-movements": [
    { name: "page.tsx", path: "app/stock-movements/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/stock-movements/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/stock-movements/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "movement-dialog.tsx",
      path: "components/blocks/stock-movements/components/movement-dialog.tsx",
      src: "components/movement-dialog.tsx",
    },
  ],
  "contacts": [
    { name: "page.tsx", path: "app/contacts/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/contacts/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/contacts/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "contact-dialog.tsx",
      path: "components/blocks/contacts/components/contact-dialog.tsx",
      src: "components/contact-dialog.tsx",
    },
  ],
  "leads": [
    { name: "page.tsx", path: "app/leads/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/leads/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/leads/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "lead-dialog.tsx",
      path: "components/blocks/leads/components/lead-dialog.tsx",
      src: "components/lead-dialog.tsx",
    },
  ],
  "project-team": [
    { name: "page.tsx", path: "app/project-team/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/project-team/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/project-team/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "member-dialog.tsx",
      path: "components/blocks/project-team/components/member-dialog.tsx",
      src: "components/member-dialog.tsx",
    },
  ],
  "milestones": [
    { name: "page.tsx", path: "app/milestones/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/milestones/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/milestones/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "milestone-dialog.tsx",
      path: "components/blocks/milestones/components/milestone-dialog.tsx",
      src: "components/milestone-dialog.tsx",
    },
  ],
  "timesheets": [
    { name: "page.tsx", path: "app/timesheets/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/timesheets/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/timesheets/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "entry-dialog.tsx",
      path: "components/blocks/timesheets/components/entry-dialog.tsx",
      src: "components/entry-dialog.tsx",
    },
  ],
  "task-board": [
    { name: "page.tsx", path: "app/task-board/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/task-board/data.ts", src: "data.ts" },
    {
      name: "task-column.tsx",
      path: "components/blocks/task-board/components/task-column.tsx",
      src: "components/task-column.tsx",
    },
    {
      name: "task-card.tsx",
      path: "components/blocks/task-board/components/task-card.tsx",
      src: "components/task-card.tsx",
    },
    {
      name: "task-dialog.tsx",
      path: "components/blocks/task-board/components/task-dialog.tsx",
      src: "components/task-dialog.tsx",
    },
  ],
  "projects": [
    { name: "page.tsx", path: "app/projects/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/projects/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/projects/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "project-dialog.tsx",
      path: "components/blocks/projects/components/project-dialog.tsx",
      src: "components/project-dialog.tsx",
    },
  ],
  "performance-reviews": [
    {
      name: "page.tsx",
      path: "app/performance-reviews/page.tsx",
      src: "page.tsx",
    },
    {
      name: "data.ts",
      path: "app/performance-reviews/data.ts",
      src: "data.ts",
    },
    {
      name: "data-table.tsx",
      path: "components/blocks/performance-reviews/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "review-dialog.tsx",
      path: "components/blocks/performance-reviews/components/review-dialog.tsx",
      src: "components/review-dialog.tsx",
    },
  ],
  "attendance": [
    { name: "page.tsx", path: "app/attendance/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/attendance/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/attendance/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "entry-dialog.tsx",
      path: "components/blocks/attendance/components/entry-dialog.tsx",
      src: "components/entry-dialog.tsx",
    },
  ],
  "leave-requests": [
    { name: "page.tsx", path: "app/leave-requests/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/leave-requests/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/leave-requests/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "request-dialog.tsx",
      path: "components/blocks/leave-requests/components/request-dialog.tsx",
      src: "components/request-dialog.tsx",
    },
  ],
  "bills": [
    { name: "page.tsx", path: "app/bills/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/bills/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/bills/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "bill-dialog.tsx",
      path: "components/blocks/bills/components/bill-dialog.tsx",
      src: "components/bill-dialog.tsx",
    },
  ],
  "payments": [
    { name: "page.tsx", path: "app/payments/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payments/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/payments/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "payment-dialog.tsx",
      path: "components/blocks/payments/components/payment-dialog.tsx",
      src: "components/payment-dialog.tsx",
    },
  ],
  "journal-entries": [
    {
      name: "page.tsx",
      path: "app/journal-entries/page.tsx",
      src: "page.tsx",
    },
    {
      name: "data.ts",
      path: "app/journal-entries/data.ts",
      src: "data.ts",
    },
    {
      name: "data-table.tsx",
      path: "components/blocks/journal-entries/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
    {
      name: "entry-dialog.tsx",
      path: "components/blocks/journal-entries/components/entry-dialog.tsx",
      src: "components/entry-dialog.tsx",
    },
  ],
  "bank-reconciliation": [
    {
      name: "page.tsx",
      path: "app/bank-reconciliation/page.tsx",
      src: "page.tsx",
    },
    {
      name: "data.ts",
      path: "app/bank-reconciliation/data.ts",
      src: "data.ts",
    },
  ],
  "payroll-tasks": [
    { name: "page.tsx", path: "app/payroll-tasks/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payroll-tasks/data.ts", src: "data.ts" },
  ],
  "payslip-detail": [
    { name: "page.tsx", path: "app/payslip-detail/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payslip-detail/data.ts", src: "data.ts" },
  ],
  "compensation-table": [
    { name: "page.tsx", path: "app/compensation-table/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/compensation-table/data.ts", src: "data.ts" },
  ],
  "payroll-calendar": [
    { name: "page.tsx", path: "app/payroll-calendar/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/payroll-calendar/data.ts", src: "data.ts" },
  ],
  "offcycle-payment-form": [
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
  "import-export": [
    { name: "page.tsx", path: "app/import-export/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/import-export/data.ts", src: "data.ts" },
  ],
  "file-upload": [
    { name: "page.tsx", path: "app/file-upload/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/file-upload/data.ts", src: "data.ts" },
  ],
  "notifications-inbox": [
    { name: "page.tsx", path: "app/notifications-inbox/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/notifications-inbox/data.ts", src: "data.ts" },
  ],
  "comments-thread": [
    { name: "page.tsx", path: "app/comments-thread/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/comments-thread/data.ts", src: "data.ts" },
  ],
  "audit-log": [
    { name: "page.tsx", path: "app/audit-log/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/audit-log/data.ts", src: "data.ts" },
  ],
  "data-table": [
    { name: "page.tsx", path: "app/data-table/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/data-table/data.ts", src: "data.ts" },
    {
      name: "columns.tsx",
      path: "components/blocks/data-table/components/columns.tsx",
      src: "components/columns.tsx",
    },
    {
      name: "data-table.tsx",
      path: "components/blocks/data-table/components/data-table.tsx",
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
  "record-form-dialog": [
    { name: "page.tsx", path: "app/record-form-dialog/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/record-form-dialog/data.ts", src: "data.ts" },
    {
      name: "contact-dialog.tsx",
      path: "components/blocks/record-form-dialog/components/contact-dialog.tsx",
      src: "components/contact-dialog.tsx",
    },
  ],
  "record-detail": [
    { name: "page.tsx", path: "app/record-detail/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/record-detail/data.ts", src: "data.ts" },
  ],
  "master-detail": [
    { name: "page.tsx", path: "app/master-detail/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/master-detail/data.ts", src: "data.ts" },
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
  "activity-log": [
    { name: "page.tsx", path: "app/activity-log/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/activity-log/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/activity-log/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
  ],
  "activity-feed": [
    { name: "page.tsx", path: "app/activity-feed/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/activity-feed/data.ts", src: "data.ts" },
  ],
  "access-control": [
    { name: "page.tsx", path: "app/access-control/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/access-control/data.ts", src: "data.ts" },
    {
      name: "permission-table.tsx",
      path: "components/blocks/access-control/components/permission-table.tsx",
      src: "components/permission-table.tsx",
    },
  ],
  "invoice-detail": [
    { name: "page.tsx", path: "app/invoice-detail/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/invoice-detail/data.ts", src: "data.ts" },
    {
      name: "invoice-list.tsx",
      path: "components/blocks/invoice-detail/components/invoice-list.tsx",
      src: "components/invoice-list.tsx",
    },
    {
      name: "invoice-view.tsx",
      path: "components/blocks/invoice-detail/components/invoice-view.tsx",
      src: "components/invoice-view.tsx",
    },
  ],
  "purchase-order-form": [
    { name: "page.tsx", path: "app/purchase-order-form/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/purchase-order-form/data.ts", src: "data.ts" },
    {
      name: "step-indicator.tsx",
      path: "components/blocks/purchase-order-form/components/step-indicator.tsx",
      src: "components/step-indicator.tsx",
    },
    {
      name: "wizard-steps.tsx",
      path: "components/blocks/purchase-order-form/components/wizard-steps.tsx",
      src: "components/wizard-steps.tsx",
    },
  ],
  "approval-board": [
    { name: "page.tsx", path: "app/approval-board/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/approval-board/data.ts", src: "data.ts" },
    {
      name: "approval-card.tsx",
      path: "components/blocks/approval-board/components/approval-card.tsx",
      src: "components/approval-card.tsx",
    },
    {
      name: "approval-column.tsx",
      path: "components/blocks/approval-board/components/approval-column.tsx",
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
  "settings": [
    { name: "page.tsx", path: "app/settings/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/settings/data.ts", src: "data.ts" },
    {
      name: "settings-nav.tsx",
      path: "components/blocks/settings/components/settings-nav.tsx",
      src: "components/settings-nav.tsx",
    },
    {
      name: "sections.tsx",
      path: "components/blocks/settings/components/sections.tsx",
      src: "components/sections.tsx",
    },
  ],
}
