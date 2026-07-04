"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  ACTIVE_SESSIONS,
  BILLING_INFO,
  SETTINGS_SECTIONS,
  initialCompanyProfile,
  initialNotificationPrefs,
  type BillingInfo,
  type CompanyProfile,
  type NotificationPrefs,
  type Session,
  type SettingsSectionId,
} from "@/registry/bases/base/blocks/settings-01/data"
import { SettingsNav } from "@/registry/bases/base/blocks/settings-01/components/settings-nav"
import {
  BillingSection,
  GeneralSection,
  NotificationsSection,
  SecuritySection,
} from "@/registry/bases/base/blocks/settings-01/components/sections"

export function Settings01({ className }: { className?: string }) {
  const [activeId, setActiveId] = React.useState<SettingsSectionId>("general")
  const [profile, setProfile] = React.useState<CompanyProfile>(initialCompanyProfile)
  const [prefs, setPrefs] = React.useState<NotificationPrefs>(initialNotificationPrefs)
  const [billing, setBilling] = React.useState<BillingInfo>(BILLING_INFO)
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)
  const [sessions, setSessions] = React.useState<Session[]>(ACTIVE_SESSIONS)
  const [saved, setSaved] = React.useState(false)

  function withDirty<T>(setter: (patch: T) => void) {
    return (patch: T) => {
      setSaved(false)
      setter(patch)
    }
  }

  const section = SETTINGS_SECTIONS.find((s) => s.id === activeId)!

  return (
    <Page
      title="Settings"
      subtitle={section.label}
      className={cn("@container overflow-hidden", className)}
    >
      <div className="flex h-full @max-md:flex-col">
        <SettingsNav
          activeId={activeId}
          onChange={(id) => {
            setActiveId(id)
            setSaved(false)
          }}
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {activeId === "general" && (
              <GeneralSection profile={profile} onChange={withDirty((patch) => setProfile((p) => ({ ...p, ...patch })))} />
            )}
            {activeId === "notifications" && (
              <NotificationsSection prefs={prefs} onChange={withDirty((patch) => setPrefs((p) => ({ ...p, ...patch })))} />
            )}
            {activeId === "billing" && (
              <BillingSection billing={billing} onChange={withDirty((patch) => setBilling((b) => ({ ...b, ...patch })))} />
            )}
            {activeId === "security" && (
              <SecuritySection
                twoFactorEnabled={twoFactorEnabled}
                onToggleTwoFactor={withDirty(setTwoFactorEnabled)}
                sessions={sessions}
                onRevoke={(id) => setSessions((prev) => prev.filter((s) => s.id !== id))}
              />
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 border-t border-border px-6 py-3">
            <Button size="sm" onClick={() => setSaved(true)}>
              Save changes
            </Button>
            {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          </div>
        </div>
      </div>
    </Page>
  )
}
