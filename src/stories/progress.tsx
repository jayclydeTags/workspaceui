"use client"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { defineStory } from "@/components/studio/studio"

interface Args {
  value: number
  showLabel: boolean
}

function Preview({ value, showLabel }: Args) {
  return (
    <Progress value={value} className="w-64">
      {showLabel && (
        <>
          <ProgressLabel>Uploading</ProgressLabel>
          <ProgressValue />
        </>
      )}
    </Progress>
  )
}

export default defineStory<Args>({
  args: { value: 60, showLabel: true },
  controls: {
    value: { type: "number", min: 0, max: 100, step: 5 },
    showLabel: { type: "boolean", group: "style", label: "Label and value" },
  },
  preview: Preview,
})
