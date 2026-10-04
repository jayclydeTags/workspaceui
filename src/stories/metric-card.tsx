"use client"

import { defineStory } from "@/components/studio/studio"
import { MetricCard } from "@/registry/bases/base/workspaceui/metric-card"

interface Args {
  label: string
  value: string
  delta?: number
  deltaLabel: string
  invertDelta: boolean
  trend?: number[]
  loading: boolean
  size: "default" | "sm"
}

function Preview(args: Args) {
  return (
    <div className="w-full max-w-xs">
      <MetricCard {...args} />
    </div>
  )
}

export default defineStory<Args>({
  args: {
    label: "MRR",
    value: "$48,210",
    delta: 12.5,
    deltaLabel: "vs last month",
    invertDelta: false,
    trend: [31, 34, 33, 38, 41, 40, 45, 48],
    loading: false,
    size: "default",
  },
  controls: {
    label: { type: "text" },
    value: {
      type: "text",
      description: "Rendered as-is, so format it yourself.",
    },
    delta: {
      type: "number",
      step: 0.1,
      description: "Percent change. Positive reads as an increase.",
    },
    deltaLabel: { type: "text" },
    invertDelta: {
      type: "boolean",
      description: "Lower is better: churn, latency, cost.",
    },
    trend: { type: "numbers", description: "Sparkline series, oldest first." },
    loading: { group: "style", type: "boolean" },
    size: { group: "style", type: "select", options: ["default", "sm"] },
  },
  preview: Preview,
})
