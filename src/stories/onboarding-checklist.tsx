"use client"

import { Button } from "@/components/ui/button"
import { defineStory } from "@/components/studio/studio"
import {
  OnboardingChecklist,
  type OnboardingStep,
} from "@/registry/bases/base/workspaceui/onboarding-checklist"

const STEPS: Omit<OnboardingStep, "completed">[] = [
  { id: "account", title: "Create your workspace" },
  {
    id: "invite",
    title: "Invite your team",
    description:
      "Workspaces are better together. Invite up to 5 teammates free.",
    action: <Button size="sm">Send invites</Button>,
  },
  {
    id: "connect",
    title: "Connect a data source",
    description: "Sync records from Postgres, Stripe, or a CSV upload.",
    action: <Button size="sm">Connect source</Button>,
  },
  {
    id: "dashboard",
    title: "Build your first dashboard",
    description: "Start from a template or a blank canvas.",
    action: <Button size="sm">Create dashboard</Button>,
  },
]

interface Args {
  title: string
  description: string
  completed: number
  dismissible: boolean
  completeMessage: string
}

function Preview({
  title,
  description,
  completed,
  dismissible,
  completeMessage,
}: Args) {
  return (
    <OnboardingChecklist
      className="w-full max-w-md"
      title={title}
      description={description || undefined}
      steps={STEPS.map((step, i) => ({ ...step, completed: i < completed }))}
      onDismiss={dismissible ? () => {} : undefined}
      completeMessage={completeMessage || undefined}
    />
  )
}

export default defineStory<Args>({
  args: {
    title: "Get started",
    description: "Finish setup to unlock your workspace.",
    completed: 1,
    dismissible: true,
    completeMessage: "You're all set.",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    completed: {
      type: "number",
      label: "Completed steps",
      min: 0,
      max: STEPS.length,
      description: `0–${STEPS.length}. Set to ${STEPS.length} to see completeMessage.`,
    },
    dismissible: {
      group: "style",
      type: "boolean",
      description: "Passing onDismiss adds a dismiss button.",
    },
    completeMessage: { type: "text" },
  },
  preview: Preview,
})
