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

- [x] **Data table** — generic TanStack block `data-table-01` (sorting, column
  filter, column visibility, row selection, pagination). Swap `Payment`/columns to reuse.
- [~] **Create/Edit form dialog** — add + update in one form. *`department` has it inline; not extracted.*
- [~] **Detail / record view** — single-record read-only. *`payslip-detail-01`, `invoice-detail-01` are variants.*
- [x] **Delete confirm dialog** — generic `confirm-dialog` block (controlled,
  custom title/description/labels, destructive styling). Reusable for any irreversible action.
- [x] **Search + filter bar** — `search-filter-bar` block (search box + faceted
  Select filters + clear-all, filtered list with live count). *Date-range filter not included.*
- [x] **Bulk actions toolbar** — `bulk-actions-toolbar` block: row selection +
  select-all + contextual toolbar (export/delete) with confirm on destructive action.
- [x] **Detail tabs** — `detail-tabs` block: record header + Overview / Activity / Orders tabs.
- [~] **Master–detail (list + panel)** — *`invoice-detail-01` demonstrates it.*

## 1. Cross-cutting blocks (support CRUD, not domain-specific)

- [x] **Dashboard / KPI stat cards** — `dashboard`, `dashboard-01`
- [x] **Activity log / timeline** — `activity-log-01`, `activity-feed-01`
- [x] **Approval workflow** — `approval-board-01`
- [x] **Access / role–permission matrix** — `access-control-01`
- [x] **Settings (tabbed)** — `settings-01`
- [ ] **Import / export (CSV) wizard**
- [ ] **Notifications / inbox**
- [ ] **File / document upload + attachments**
- [ ] **Comments / notes thread**
- [ ] **Audit log** (distinct from activity feed — who changed what field)

---

## 2. Domain modules

Each domain = its core CRUD entities. Ship the list + form + detail per entity;
reuse the universal blocks from §0.

### Payroll  *(mostly done)*
- [x] Pay runs — `payroll-run-01`
- [x] Payslips — `payslip-detail-01`
- [x] Compensation — `compensation-table-01`
- [x] Pay calendar — `payroll-calendar-01`
- [x] Off-cycle payment — `offcycle-payment-form-01`
- [x] Payroll tasks — `payroll-tasks`
- [ ] Employees list/form (shared with HRIS)
- [ ] Deductions / benefits
- [ ] Tax tables

### Accounting / Finance
- [x] Invoice detail — `invoice-detail-01`
- [x] Purchase order form — `purchase-order-form-01`
- [ ] Chart of accounts
- [ ] Journal entries
- [ ] Bills
- [ ] Payments
- [ ] Bank reconciliation

### Inventory
- [ ] Products / SKUs
- [ ] Stock levels
- [ ] Warehouses
- [ ] Purchase orders *(reuse `purchase-order-form-01`)*
- [ ] Stock movements

### HRIS
- [x] Departments — `department`
- [ ] Employees
- [ ] Leave requests
- [ ] Attendance
- [ ] Performance reviews

### Project management
- [ ] Projects
- [ ] Tasks / Kanban board
- [ ] Timesheets
- [ ] Milestones
- [ ] Team / assignees

### CRM
- [ ] Leads
- [ ] Contacts
- [ ] Accounts
- [ ] Deals / pipeline
- [ ] Activities *(reuse `activity-feed-01`)*

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
