"use client"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { defineStory } from "@/components/studio/studio"

interface Args {
  keys: string
}

function Preview({ keys }: Args) {
  const parts = keys.split(/\s+/).filter(Boolean)
  if (parts.length > 1) {
    return (
      <KbdGroup>
        {parts.map((part, i) => (
          <Kbd key={`${part}-${i}`}>{part}</Kbd>
        ))}
      </KbdGroup>
    )
  }
  return <Kbd>{parts[0] ?? ""}</Kbd>
}

export default defineStory<Args>({
  args: { keys: "⌘ K" },
  controls: {
    keys: {
      type: "text",
      description: "Space-separated keys. More than one renders a KbdGroup.",
    },
  },
  preview: Preview,
})
