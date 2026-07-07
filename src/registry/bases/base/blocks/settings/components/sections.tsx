import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PLAN_LABEL,
  type BillingInfo,
  type BillingPlan,
  type CompanyProfile,
  type NotificationPrefs,
  type Session,
} from "@/registry/bases/base/blocks/settings/data"

export function GeneralSection({
  profile,
  onChange,
}: {
  profile: CompanyProfile
  onChange: (patch: Partial<CompanyProfile>) => void
}) {
  return (
    <FieldGroup className="max-w-md">
      <Field>
        <FieldLabel htmlFor="settings-name">Display name</FieldLabel>
        <Input id="settings-name" value={profile.name} onChange={(e) => onChange({ name: e.target.value })} />
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-legal-name">Legal name</FieldLabel>
        <Input
          id="settings-legal-name"
          value={profile.legalName}
          onChange={(e) => onChange({ legalName: e.target.value })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-tax-id">Tax ID</FieldLabel>
        <Input id="settings-tax-id" value={profile.taxId} onChange={(e) => onChange({ taxId: e.target.value })} />
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-email">Billing email</FieldLabel>
        <Input
          id="settings-email"
          type="email"
          value={profile.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </Field>
    </FieldGroup>
  )
}

const NOTIFICATION_LABELS: Record<keyof NotificationPrefs, string> = {
  invoiceReminders: "Invoice due reminders",
  paymentReceived: "Payment received",
  lowStockAlerts: "Low stock alerts",
  payrollRunReminders: "Payroll run reminders",
}

export function NotificationsSection({
  prefs,
  onChange,
}: {
  prefs: NotificationPrefs
  onChange: (patch: Partial<NotificationPrefs>) => void
}) {
  return (
    <div className="flex max-w-md flex-col gap-3">
      {(Object.keys(NOTIFICATION_LABELS) as (keyof NotificationPrefs)[]).map((key) => (
        <div key={key} className="flex items-center justify-between gap-4 rounded-md border border-border p-3 text-sm">
          {NOTIFICATION_LABELS[key]}
          <Checkbox
            checked={prefs[key]}
            onCheckedChange={(checked) => onChange({ [key]: checked === true })}
            aria-label={NOTIFICATION_LABELS[key]}
          />
        </div>
      ))}
    </div>
  )
}

export function BillingSection({
  billing,
  onChange,
}: {
  billing: BillingInfo
  onChange: (patch: Partial<BillingInfo>) => void
}) {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="settings-plan">Plan</FieldLabel>
        <Select value={billing.plan} onValueChange={(v) => v && onChange({ plan: v as BillingPlan })}>
          <SelectTrigger id="settings-plan" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(Object.keys(PLAN_LABEL) as BillingPlan[]).map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {PLAN_LABEL[plan]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-muted-foreground">Seats</dt>
        <dd>{billing.seats}</dd>
        <dt className="text-muted-foreground">Renews on</dt>
        <dd>{billing.renewalDate}</dd>
      </dl>
    </div>
  )
}

export function SecuritySection({
  twoFactorEnabled,
  onToggleTwoFactor,
  sessions,
  onRevoke,
}: {
  twoFactorEnabled: boolean
  onToggleTwoFactor: (checked: boolean) => void
  sessions: Session[]
  onRevoke: (id: string) => void
}) {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3 text-sm">
        <div className="flex flex-col gap-0.5">
          <span>Two-factor authentication</span>
          <span className="text-xs text-muted-foreground">Require a code at sign-in</span>
        </div>
        <Checkbox
          checked={twoFactorEnabled}
          onCheckedChange={(checked) => onToggleTwoFactor(checked === true)}
          aria-label="Two-factor authentication"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Active sessions</span>
        {sessions.map((session, i) => (
          <div key={session.id} className="flex items-center justify-between gap-2 rounded-md border border-border p-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span>{session.device}</span>
                {i === 0 && <Badge variant="secondary">This device</Badge>}
              </div>
              <span className="text-xs text-muted-foreground">
                {session.location} · {session.lastActive}
              </span>
            </div>
            {i !== 0 && (
              <Button variant="ghost" size="sm" onClick={() => onRevoke(session.id)}>
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
