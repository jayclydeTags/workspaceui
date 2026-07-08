# CRUD Blocks — Build Plan & Tracker

Monitoring list for common Business-Application CRUD blocks. Checkbox = done.
Each block follows the 3-level testing rule (component test + `registry.json`
entry + mdx/sidebar) — see `.claude/rules/component-testing.md`.

**Legend:** `[x]` exists · `[~]` partial (a domain variant exists, not the
generic block) · `[ ]` to build.

---

## 0. Universal CRUD blocks (reused by every module)

The 80% core. Build these generic first — every domain module below just swaps
the entity + fields.

- [x] **Data table** — generic TanStack block `data-table` (sorting, column
  filter, column visibility, row selection, pagination). Swap `Payment`/columns to reuse.
- [x] **Create/Edit form dialog** — `record-form-dialog`: standalone
  create/edit dialog, one form for both, extracted from `department`'s inline pattern.
- [x] **Detail / record view** — `record-detail`: read-only header + grouped
  label/value field sections, no tabs (distinct from `detail-tabs`/`invoice-detail`).
- [x] **Delete confirm dialog** — generic `confirm-dialog` block (controlled,
  custom title/description/labels, destructive styling). Reusable for any irreversible action.
- [x] **Search + filter bar** — `search-filter-bar` block (search box + faceted
  Select filters + clear-all, filtered list with live count). *Date-range filter not included.*
- [x] **Bulk actions toolbar** — `bulk-actions-toolbar` block: row selection +
  select-all + contextual toolbar (export/delete) with confirm on destructive action.
- [x] **Detail tabs** — `detail-tabs` block: record header + Overview / Activity / Orders tabs.
- [x] **Master–detail (list + panel)** — `master-detail`: resizable list +
  detail split pane, lighter than `invoice-detail`'s tabbed Workspace pattern.

## 1. Cross-cutting blocks (support CRUD, not domain-specific)

- [x] **Dashboard / KPI stat cards** — `dashboard`, `dashboard-01`
- [x] **Activity log / timeline** — `activity-log`, `activity-feed`
- [x] **Approval workflow** — `approval-board`
- [x] **Access / role–permission matrix** — `access-control`
- [x] **Settings (tabbed)** — `settings`
- [x] **Import / export (CSV) wizard** — `import-export`
- [x] **Notifications / inbox** — `notifications-inbox`
- [x] **File / document upload + attachments** — `file-upload`
- [x] **Comments / notes thread** — `comments-thread`
- [x] **Audit log** (distinct from activity feed — who changed what field) — `audit-log`

---

## 2. Domain modules

Each domain = its core CRUD entities. Ship the list + form + detail per entity;
reuse the universal blocks from §0.

### Payroll  *(done)*
- [x] Pay runs — `payroll-run`
- [x] Payslips — `payslip-detail`
- [x] Compensation — `compensation-table`
- [x] Pay calendar — `payroll-calendar`
- [x] Off-cycle payment — `offcycle-payment-form`
- [x] Payroll tasks — `payroll-tasks`
- [x] Employees list/form (shared with HRIS) — `employee`
- [x] Deductions / benefits — `deductions-benefits`
- [x] Tax tables — `tax-tables`

### Accounting / Finance  *(done)*
- [x] Invoice detail — `invoice-detail`
- [x] Purchase order form — `purchase-order-form`
- [x] Chart of accounts — `chart-of-accounts`
- [x] Journal entries — `journal-entries`
- [x] Bills — `bills`
- [x] Payments — `payments`
- [x] Bank reconciliation — `bank-reconciliation`

### Inventory  *(done)*
- [x] Products / SKUs — `products`
- [x] Stock levels — `stock-levels` *(adjust-only; rows derive from product × warehouse)*
- [x] Warehouses — `warehouses`
- [x] Purchase orders *(reuse `purchase-order-form`)*
- [x] Stock movements — `stock-movements` *(append-only ledger; no edit/delete)*

### HRIS  *(done)*
- [x] Departments — `department`
- [x] Employees — `employee` *(shared with Payroll)*
- [x] Leave requests — `leave-requests` *(approve/reject; no edit — decisions amend)*
- [x] Attendance — `attendance` *(status derived from punches)*
- [x] Performance reviews — `performance-reviews` *(can't complete an unrated review)*

### Project management  *(done)*
- [x] Projects — `projects`
- [x] Tasks / Kanban board — `task-board`
- [x] Timesheets — `timesheets` *(draft → submitted → approved; locked after submit)*
- [x] Milestones — `milestones` *(state derived from due date + scope)*
- [x] Team / assignees — `project-team` *(last lead can't be removed or demoted)*

### CRM
- [x] Leads — `leads` *(convert gated on qualified)*
- [x] Contacts — `contacts` *(one primary per account)*
- [x] Accounts — `accounts` *(health from contact recency; delete blocked on open deals)*
- [ ] Deals / pipeline
- [ ] Activities *(reuse `activity-feed`)*

---

## 3. Additional verticals (requested)

### LMS
- [ ] Courses
- [ ] Enrollments
- [ ] Lessons / modules
- [ ] Students / instructors
- [ ] Grades / progress

### Fleet
- [ ] Vehicles
- [ ] Drivers
- [ ] Trips / routes
- [ ] Maintenance schedules
- [ ] Fuel / expense logs

### Field service
- [ ] Work orders
- [ ] Technicians / dispatch
- [ ] Job scheduling (calendar)
- [ ] Customers / sites
- [ ] Service reports

### Loan / lending
- [ ] Loan applications
- [ ] Borrowers
- [ ] Repayment schedule
- [ ] Disbursements
- [ ] Collateral

### Booking / scheduling
- [ ] Appointments / bookings (calendar)
- [ ] Resources / services
- [ ] Availability / slots
- [ ] Customers
- [ ] Cancellations / reschedules

### Warehouse (WMS)
- [ ] Inbound / receiving
- [ ] Outbound / picking
- [ ] Bin / location map
- [ ] Inventory adjustments
- [ ] Shipments

### Manufacturing
- [ ] Bill of materials (BOM)
- [ ] Work orders
- [ ] Production schedule
- [ ] Machines / work centers
- [ ] Quality checks

### Real estate / property management
- [ ] Properties / units
- [ ] Tenants / leases
- [ ] Rent payments
- [ ] Maintenance requests
- [ ] Owners / landlords

---

## Build order (recommended)

1. **§0 generic blocks** — data-table, delete-confirm, search-filter-bar,
   bulk-actions, detail-tabs. Everything downstream reuses them.
2. **§1 remaining cross-cutting** — import/export, notifications, attachments, comments.
3. **One reference domain end-to-end** (e.g. Inventory) to lock the entity
   pattern (list + form + detail), then clone per entity across §2/§3.

> ponytail: don't build all ~90 entity blocks. The generic §0 trio + one worked
> domain is the real deliverable; the rest are field swaps. Build a domain block
> only when a real consumer needs it.
