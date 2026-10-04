"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { defineStory } from "@/components/studio/studio"
import { BulkToolbar } from "@/registry/bases/base/workspaceui/bulk-toolbar"

interface Args {
  count: number
  actionLabel: string
}

function Preview({ count, actionLabel }: Args) {
  return (
    <BulkToolbar count={count} onClear={() => {}}>
      <Button variant="destructive" size="sm">
        <HugeiconsIcon
          icon={Delete02Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {actionLabel}
      </Button>
    </BulkToolbar>
  )
}

export default defineStory<Args>({
  args: { count: 2, actionLabel: "Delete" },
  controls: {
    count: {
      type: "number",
      min: 0,
      description: "Selected rows. The toolbar hides itself at 0.",
    },
    actionLabel: { type: "text", description: "Label of the action button." },
  },
  preview: Preview,
})
