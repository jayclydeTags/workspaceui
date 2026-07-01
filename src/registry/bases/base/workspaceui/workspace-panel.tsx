import * as React from "react"

import { cn } from "@/lib/utils"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export interface WorkspacePanelProps {
  /** One or two <WorkspaceTabs> instances stacked vertically. */
  children: React.ReactNode
  className?: string
}

export function WorkspacePanel({ children, className }: WorkspacePanelProps) {
  const panes = React.Children.toArray(children)

  if (panes.length === 1) {
    return (
      <div className={cn("flex h-full flex-col", className)}>{panes[0]}</div>
    )
  }

  return (
    <ResizablePanelGroup
      orientation="vertical"
      className={cn("h-full", className)}
    >
      {panes.map((pane, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ResizableHandle />}
          <ResizablePanel
            defaultSize={Math.floor(100 / panes.length)}
            minSize={30}
          >
            {pane}
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  )
}
