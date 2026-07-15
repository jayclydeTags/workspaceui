export type SettingsSectionId = "general" | "notifications" | "billing" | "security"

export interface SettingsSectionDef {
  id: SettingsSectionId
  label: string
  description: string
}

export const SETTINGS_SECTIONS: SettingsSectionDef[] = [
  { id: "general", label: "Company Profile", description: "Legal name, tax ID, and contact info" },
  { id: "notifications", label: "Notifications", description: "Alerts for invoices, payroll, and inventory" },
  { id: "billing", label: "Billing", description: "Plan, seats, and renewal" },
  { id: "security", label: "Security", description: "Two-factor auth and active sessions" },
]

export interface CompanyProfile {
  name: string
  legalName: string
  taxId: string
  email: string
}

export function initialCompanyProfile(): CompanyProfile {
  return {
    name: "Northwind Traders",
    legalName: "Northwind Traders LLC",
    taxId: "84-1234567",
    email: "billing@northwindtraders.com",
  }
}

export interface NotificationPrefs {
  invoiceReminders: boolean
  paymentReceived: boolean
  lowStockAlerts: boolean
  payrollRunReminders: boolean
}

export function initialNotificationPrefs(): NotificationPrefs {
  return {
    invoiceReminders: true,
    paymentReceived: true,
    lowStockAlerts: false,
    payrollRunReminders: true,
  }
}

export type BillingPlan = "starter" | "growth" | "enterprise"

export interface BillingInfo {
  plan: BillingPlan
  seats: number
  renewalDate: string
}

export const BILLING_INFO: BillingInfo = {
  plan: "growth",
  seats: 12,
  renewalDate: "2026-09-01",
}

export const PLAN_LABEL: Record<BillingPlan, string> = {
  starter: "Starter",
  growth: "Growth",
  enterprise: "Enterprise",
}

export interface Session {
  id: string
  device: string
  location: string
  lastActive: string
}

export const ACTIVE_SESSIONS: Session[] = [
  { id: "s1", device: "Chrome on macOS", location: "Austin, TX", lastActive: "Active now" },
  { id: "s2", device: "Safari on iPhone", location: "Austin, TX", lastActive: "2 hours ago" },
  { id: "s3", device: "Chrome on Windows", location: "Denver, CO", lastActive: "3 days ago" },
]
