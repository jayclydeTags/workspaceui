"use client"

import { Button } from "@/components/ui/button"
import { defineStory } from "@/components/studio/studio"
import { UsageMeter } from "@/registry/bases/base/workspaceui/usage-meter"

interface Args {
  label: string
  used: number
  limit: number
  unlimited: boolean
  unit: string
  warningAt: number
  description: string
  upgradeAction: boolean
}

function Preview({
  unlimited,
  upgradeAction,
  limit,
  unit,
  description,
  ...rest
}: Args) {
  return (
    <div className="w-full max-w-sm">
      <UsageMeter
        {...rest}
        limit={unlimited ? null : limit}
        unit={unit || undefined}
        description={description || undefined}
        action={
          upgradeAction ? <Button size="xs">Upgrade plan</Button> : undefined
        }
      />
    </div>
  )
}

export default defineStory<Args>({
  args: {
    label: "API requests",
    used: 42180,
    limit: 100000,
    unlimited: false,
    unit: "",
    warningAt: 0.8,
    description: "Resets Oct 1",
    upgradeAction: false,
  },
  controls: {
    label: { type: "text" },
    used: { type: "number", min: 0, step: 1000 },
    limit: { type: "number", min: 0, step: 1000 },
    unlimited: {
      group: "style",
      type: "boolean",
      description: "Passes limit={null}: the bar is omitted.",
    },
    unit: { type: "text", placeholder: "GB, seats…" },
    warningAt: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      description: "Fraction of the limit where the meter turns to a warning.",
    },
    description: { type: "text" },
    upgradeAction: {
      type: "boolean",
      label: "Show action",
      description: "Trailing control under the bar.",
    },
  },
  preview: Preview,
})
