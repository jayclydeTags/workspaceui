"use client"

import { useState } from "react"
import { Check, MailCheck, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static demo — "Upgrade" is inert and "Ask an admin" just flips to the
// sent state. Wire the primary action to your checkout/billing route and the
// secondary to the real notify-admin endpoint; pass the gated feature + plan in
// when integrated.
const FEATURE = "Advanced analytics"
const CURRENT_PLAN = "Free"
const REQUIRED_PLAN = "Pro"
const PERKS = [
  "Unlimited history & exports",
  "Custom dashboards and reports",
  "Priority support",
]

export function UpgradeRequired() {
  const [requested, setRequested] = useState(false)

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-5 text-primary" />
          </div>

          <h1 className="mt-4 text-sm font-medium" role="alert">
            Upgrade to unlock {FEATURE}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            This feature isn&apos;t included in your{" "}
            <span className="font-medium text-foreground">{CURRENT_PLAN}</span>{" "}
            plan. Upgrade to{" "}
            <span className="font-medium text-foreground">{REQUIRED_PLAN}</span>{" "}
            to turn it on.
          </p>

          <Card size="sm" className="mt-4 w-full bg-muted/50">
            <CardContent className="flex flex-col gap-2 text-left text-xs text-muted-foreground">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-primary" />
                  {perk}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-6 flex w-full flex-col gap-2" aria-live="polite">
            <Button className="w-full">Upgrade to {REQUIRED_PLAN}</Button>
            {requested ? (
              <div className="flex items-center justify-center gap-2 rounded-md border border-dashed py-2 text-xs text-muted-foreground">
                <MailCheck className="size-3.5 shrink-0 text-foreground" />
                Upgrade request sent to your admin
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setRequested(true)}
              >
                Ask an admin to upgrade
              </Button>
            )}
          </div>
        </div>
      </div>
    </Page>
  )
}
