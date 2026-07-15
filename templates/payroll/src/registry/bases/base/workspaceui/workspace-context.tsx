"use client"

import * as React from "react"

export interface WorkspaceDragContextValue {
  isDragging: boolean
  snapState: { targetPaneId: string; zone: "left" | "right" | "top" | "bottom" } | null
  tabDropTarget: { targetPaneId: string; insertIndex: number } | null
  registerPane: (paneId: string, el: HTMLElement | null) => void
  registerTabStrip: (paneId: string, el: HTMLElement | null) => void
  startDrag: (
    sourcePaneId: string,
    tabId: string,
    tabTitle: string,
    pointerId: number,
    x: number,
    y: number,
  ) => void
  setLastActivePane: (paneId: string) => void
}

export const WorkspaceDragContext = React.createContext<WorkspaceDragContextValue | null>(null)

/** Throws when used outside <Workspace>. For internal components that require the context. */
export function useWorkspaceDrag(): WorkspaceDragContextValue {
  const ctx = React.useContext(WorkspaceDragContext)
  if (ctx == null) throw new Error("useWorkspaceDrag must be used inside <Workspace>")
  return ctx
}

/** Returns null when used outside <Workspace>. For components that work standalone too. */
export function useWorkspaceDragOptional(): WorkspaceDragContextValue | null {
  return React.useContext(WorkspaceDragContext)
}
