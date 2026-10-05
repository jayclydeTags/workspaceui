"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { defineStory } from "@/components/studio/studio"

interface Args {
  orientation: "horizontal" | "vertical"
  withHandle: boolean
}

function Panel({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
      {label}
    </div>
  )
}

function Preview({ orientation, withHandle }: Args) {
  return (
    <div className="h-56 w-full max-w-md overflow-hidden rounded-lg border">
      <ResizablePanelGroup key={orientation} orientation={orientation}>
        <ResizablePanel defaultSize="50%" minSize="20%">
          <Panel label="One" />
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} />
        <ResizablePanel defaultSize="50%" minSize="20%">
          <Panel label="Two" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default defineStory<Args>({
  args: { orientation: "horizontal", withHandle: true },
  controls: {
    orientation: {
      type: "select",
      group: "style",
      options: ["horizontal", "vertical"],
    },
    withHandle: {
      type: "boolean",
      group: "style",
      description: "A grip on the resize handle.",
    },
  },
  preview: Preview,
})
