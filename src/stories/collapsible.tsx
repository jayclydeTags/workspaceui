"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { defineStory } from "@/components/studio/studio"

interface Args {
  open: boolean
  disabled: boolean
}

function Preview({ open, disabled }: Args) {
  return (
    <Collapsible
      key={String(open)}
      defaultOpen={open}
      disabled={disabled}
      className="flex w-72 flex-col gap-2"
    >
      <CollapsibleTrigger render={<Button variant="outline" />}>
        Toggle details
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-sm text-muted-foreground">
          This content expands and collapses.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default defineStory<Args>({
  args: { open: true, disabled: false },
  controls: {
    open: { type: "boolean", label: "Initially open" },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
