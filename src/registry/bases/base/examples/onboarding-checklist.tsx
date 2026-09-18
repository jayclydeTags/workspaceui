"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  OnboardingChecklist,
  type OnboardingStep,
} from "@/registry/bases/base/workspaceui/onboarding-checklist"

export function OnboardingChecklistDemo() {
  const [done, setDone] = React.useState<Set<string>>(
    () => new Set(["account"])
  )
  const [dismissed, setDismissed] = React.useState(false)

  const complete = (id: string) => setDone((prev) => new Set(prev).add(id))

  const steps: OnboardingStep[] = [
    { id: "account", title: "Create your workspace" },
    {
      id: "invite",
      title: "Invite your team",
      description:
        "Workspaces are better together. Invite up to 5 teammates free.",
      action: (
        <Button size="sm" onClick={() => complete("invite")}>
          Send invites
        </Button>
      ),
    },
    {
      id: "connect",
      title: "Connect a data source",
      description: "Sync records from Postgres, Stripe, or a CSV upload.",
      action: (
        <Button size="sm" onClick={() => complete("connect")}>
          Connect source
        </Button>
      ),
    },
    {
      id: "dashboard",
      title: "Build your first dashboard",
      description: "Start from a template or a blank canvas.",
      action: (
        <Button size="sm" onClick={() => complete("dashboard")}>
          Create dashboard
        </Button>
      ),
    },
  ].map((step) => ({ ...step, completed: done.has(step.id) }))

  if (dismissed) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          setDone(new Set(["account"]))
          setDismissed(false)
        }}
      >
        Reset demo
      </Button>
    )
  }

  return (
    <div className="w-full max-w-sm overflow-y-auto p-px">
      <OnboardingChecklist
        description="Finish setup to get the most out of your workspace."
        steps={steps}
        onDismiss={() => setDismissed(true)}
      />
    </div>
  )
}
