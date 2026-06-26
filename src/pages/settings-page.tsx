import * as React from "react"
import { cn } from "@/lib/utils"
import { ShieldIcon, BellIcon, UserIcon, SlidersIcon } from "lucide-react"

type Tab = "general" | "account" | "notifications" | "security"

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: SlidersIcon },
  { id: "account", label: "Account", icon: UserIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
const selectCls = cn(inputCls, "cursor-pointer")

function Toggle({ enabled }: { enabled: boolean }) {
  const [on, setOn] = React.useState(enabled)
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-foreground" : "bg-muted-foreground/30")}
    >
      <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", on ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  )
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>("general")

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar nav */}
      <div className="flex w-48 shrink-0 flex-col border-r border-border p-3 gap-0.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors text-left",
              activeTab === t.id
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <t.icon className="size-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 overflow-auto p-6">
        {activeTab === "general" && (
          <div className="max-w-md space-y-5">
            <div>
              <h2 className="text-base font-semibold">General</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Your workspace preferences</p>
            </div>
            <div className="space-y-4">
              <Field label="Display Name">
                <input className={inputCls} defaultValue="Jay Clyde" />
              </Field>
              <Field label="Email">
                <input className={inputCls} defaultValue="jayclydetaguines@gmail.com" type="email" />
              </Field>
              <Field label="Language">
                <select className={selectCls}>
                  <option>English</option>
                  <option>Filipino</option>
                  <option>Japanese</option>
                </select>
              </Field>
              <Field label="Theme">
                <select className={selectCls}>
                  <option>System</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80">
                Save Changes
              </button>
              <button className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted">
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="max-w-md space-y-4">
            <div>
              <h2 className="text-base font-semibold">Account</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Manage your plan and data</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium">Personal Plan</p>
              <p className="mt-0.5 text-xs text-muted-foreground">You're on the free Personal plan. Upgrade to unlock team features.</p>
              <button className="mt-3 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background">Upgrade to Team</button>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-900/10 p-4">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Permanently delete your account and all its data. This cannot be undone.</p>
              <button className="mt-3 rounded-lg border border-red-400 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400">Delete Account</button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="max-w-md space-y-4">
            <div>
              <h2 className="text-base font-semibold">Notifications</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Choose what updates you receive</p>
            </div>
            {[
              { label: "New email received", description: "Notify when a new email arrives in your inbox", enabled: true },
              { label: "Calendar reminders", description: "15-minute reminders before scheduled events", enabled: true },
              { label: "Document comments", description: "When someone comments on your shared documents", enabled: false },
              { label: "System updates", description: "Product announcements and maintenance notices", enabled: false },
              { label: "Weekly digest", description: "A summary of your workspace activity every Monday", enabled: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-border p-3.5">
                <div>
                  <p className="text-[13px] font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.description}</p>
                </div>
                <Toggle enabled={item.enabled} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "security" && (
          <div className="max-w-md space-y-4">
            <div>
              <h2 className="text-base font-semibold">Security</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Protect your account</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium">Password</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Last changed 3 months ago</p>
              <button className="mt-3 rounded-lg border border-border px-3 py-1.5 text-xs">Change Password</button>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Add an extra layer of security to your account</p>
              <button className="mt-3 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background">Enable 2FA</button>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="mb-2 text-sm font-medium">Active Sessions</p>
              {[
                { device: "MacBook Pro 16″", location: "Manila, PH", current: true },
                { device: "iPhone 15 Pro", location: "Manila, PH", current: false },
              ].map((s) => (
                <div key={s.device} className="flex items-center justify-between py-1.5 text-sm">
                  <div>
                    <span className="font-medium text-[13px]">{s.device}</span>
                    {s.current && <span className="ml-2 rounded-full bg-green-100 px-1.5 text-[10px] font-medium text-green-700">current</span>}
                    <p className="text-[11px] text-muted-foreground">{s.location}</p>
                  </div>
                  {!s.current && <button className="text-xs text-red-500 hover:underline">Revoke</button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
