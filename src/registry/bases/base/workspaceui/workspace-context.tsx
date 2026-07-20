"use client"

import * as React from "react"

export type WorkspaceSnapZone = "left" | "right" | "top" | "bottom"

export interface WorkspaceDragContextValue {
  isDragging: boolean
  snapState: { targetPaneId: string; zone: WorkspaceSnapZone } | null
  tabDropTarget: { targetPaneId: string; insertIndex: number } | null
  registerPane: (paneId: string, el: HTMLElement | null) => void
  registerTabStrip: (paneId: string, el: HTMLElement | null) => void
  /**
   * Begin a tab drag. Takes the pointerdown event so the drag owner also owns
   * the pointer capture, and can release it if the drag is cancelled.
   */
  startDrag: (
    sourcePaneId: string,
    tabId: string,
    tabTitle: string,
    event: React.PointerEvent<Element>,
  ) => void
  setLastActivePane: (paneId: string) => void
  /**
   * Every open pane, labelled by its active tab — the move-tab targets offered
   * in the tab menu. Includes the pane asking; filter it out at the call site.
   */
  paneTargets: { id: string; label: string }[]
  /** Split a tab out into a new pane. The keyboard equivalent of a snap-zone drop. */
  splitTab: (paneId: string, tabId: string, zone: WorkspaceSnapZone) => void
  /** Move a tab to the end of another pane's strip. Keyboard equivalent of a strip drop. */
  moveTab: (fromPaneId: string, tabId: string, toPaneId: string) => void
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
