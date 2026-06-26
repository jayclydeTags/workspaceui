import * as React from "react"

import { cn } from "@/lib/utils"
import { WorkspaceTabs } from "@/components/workspaceui/workspace-tabs"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

// Minimum column width: 20% of horizontal group (≥240px at 1200px viewport).
const MIN_COL_SIZE = 20
// Minimum row height: 30% of vertical group (≥195px at 650px workspace height).
const MIN_ROW_SIZE = 30

// ── Types ──────────────────────────────────────────────────────────────────

export interface WorkspaceTabDef {
  id: string
  title: string
  icon?: React.ReactNode
  badge?: number
  /** Pinned tabs cannot be closed and have no close button. */
  pinned?: boolean
}

export interface WorkspacePaneDef {
  id: string
  tabs: WorkspaceTabDef[]
  /** Initially active tab. Defaults to the first tab. */
  defaultActiveTabId?: string
  defaultSize?: number
  minSize?: number
  /** Renders a "+" button in the tab strip when provided. */
  onAddTab?: () => void
}

interface PaneState {
  id: string
  tabs: WorkspaceTabDef[]
  activeTabId: string
  defaultSize?: number
  minSize?: number
  onAddTab?: () => void
}

// Column model: each column can have one or two vertically-stacked panes.
interface PaneColumn {
  id: string
  topPane: PaneState
  bottomPane?: PaneState
}

interface WorkspaceLayout {
  columns: PaneColumn[]
}

// ── Drag types ─────────────────────────────────────────────────────────────

type SnapZone = "left" | "right" | "top" | "bottom"

interface DragSession {
  tabId: string
  tabTitle: string
  sourcePaneId: string
  pointerId: number
  startX: number
  startY: number
  didThreshold: boolean
}

interface SnapState {
  targetPaneId: string
  zone: SnapZone
}

interface TabDropTarget {
  targetPaneId: string
  insertIndex: number
}

// ── Context ────────────────────────────────────────────────────────────────

export interface WorkspaceContextValue {
  readonly panes: readonly PaneState[]
  readonly isShowingFallback: boolean
  readonly lastActivePaneId: string | null
  openTabInPane: (paneId: string, tab: WorkspaceTabDef) => void
  closeTab: (paneId: string, tabId: string) => void
  activateTab: (paneId: string, tabId: string) => void
  updateTab: (paneId: string, tabId: string, patch: Partial<WorkspaceTabDef>) => void
  openPane: (pane: WorkspacePaneDef) => void
  closePane: (paneId: string) => void
}

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace(): WorkspaceContextValue {
  const ctx = React.useContext(WorkspaceContext)
  if (ctx == null) throw new Error("useWorkspace must be used inside <Workspace>")
  return ctx
}

// ── Drag context ───────────────────────────────────────────────────────────

interface WorkspaceDragContextValue {
  isDragging: boolean
  snapState: SnapState | null
  tabDropTarget: TabDropTarget | null
  registerPane: (paneId: string, el: HTMLElement | null) => void
  registerTabStrip: (paneId: string, el: HTMLElement | null) => void
  startDrag: (sourcePaneId: string, tabId: string, tabTitle: string, pointerId: number, x: number, y: number) => void
  setLastActivePane: (paneId: string) => void
}

const WorkspaceDragContext = React.createContext<WorkspaceDragContextValue | null>(null)

function useWorkspaceDrag(): WorkspaceDragContextValue {
  const ctx = React.useContext(WorkspaceDragContext)
  if (ctx == null) throw new Error("useWorkspaceDrag must be used inside <Workspace>")
  return ctx
}

// ── Imperative handle ──────────────────────────────────────────────────────

export type WorkspaceHandle = Omit<
  WorkspaceContextValue,
  "panes" | "isShowingFallback" | "lastActivePaneId"
> & {
  readonly lastActivePaneId: string | null
}

// ── Workspace ──────────────────────────────────────────────────────────────

export interface WorkspaceProps {
  /** Initial pane configuration. */
  initialPanes?: WorkspacePaneDef[]
  /**
   * Renders content for the active tab of each pane.
   * Called during render; may safely close over external state.
   */
  renderTabContent: (paneId: string, activeTabId: string) => React.ReactNode
  /**
   * Content shown when all panes are closed.
   * Falls back to a built-in placeholder when omitted.
   */
  fallback?: React.ReactNode
  className?: string
}

export const Workspace = React.forwardRef<WorkspaceHandle, WorkspaceProps>(
  function Workspace(
    {
      initialPanes = [],
      renderTabContent,
      fallback,
      className,
    },
    ref,
  ) {
    const [layout, setLayout] = React.useState<WorkspaceLayout>(() => ({
      columns: initialPanes.map((p) => ({ id: p.id, topPane: toPaneState(p) })),
    }))

    const [lastActivePaneId, setLastActivePaneId] = React.useState<string | null>(
      () => initialPanes[0]?.id ?? null,
    )

    const setLastActivePane = React.useCallback((paneId: string) => {
      setLastActivePaneId(paneId)
    }, [])

    // Flat pane view for context consumers — derived, no extra state.
    const panes = React.useMemo(
      () =>
        layout.columns.flatMap((col) =>
          col.bottomPane ? [col.topPane, col.bottomPane] : [col.topPane],
        ),
      [layout],
    )

    // Resolve the last-active pane: fall back to the first pane if the active one was closed.
    const resolvedLastActivePaneId = panes.some((p) => p.id === lastActivePaneId)
      ? lastActivePaneId
      : (panes[0]?.id ?? null)

    // ── Drag state ─────────────────────────────────────────────────────────

    const dragSession = React.useRef<DragSession | null>(null)
    const dragAbortController = React.useRef<AbortController | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const [ghostPos, setGhostPos] = React.useState<{ x: number; y: number } | null>(null)
    const [ghostTitle, setGhostTitle] = React.useState<string | null>(null)
    const [snapState, setSnapState] = React.useState<SnapState | null>(null)
    const snapStateRef = React.useRef<SnapState | null>(null)
    const [tabDropTarget, setTabDropTarget] = React.useState<TabDropTarget | null>(null)
    const tabDropTargetRef = React.useRef<TabDropTarget | null>(null)
    const paneRefs = React.useRef<Map<string, HTMLElement>>(new Map())
    const tabStripRefs = React.useRef<Map<string, HTMLElement>>(new Map())

    const setSnapStateSynced = React.useCallback((s: SnapState | null) => {
      snapStateRef.current = s
      setSnapState(s)
    }, [])

    const setTabDropTargetSynced = React.useCallback((t: TabDropTarget | null) => {
      tabDropTargetRef.current = t
      setTabDropTarget(t)
    }, [])

    // ── Mutations (layout-aware) ────────────────────────────────────────────

    const openTabInPane = React.useCallback(
      (paneId: string, tab: WorkspaceTabDef) => {
        setLayout((prev) => {
          const found = findPaneInLayout(prev, paneId)
          if (!found) {
            // Pane was closed — recreate as a new column
            const newColumn: PaneColumn = {
              id: paneId,
              topPane: { id: paneId, tabs: [tab], activeTabId: tab.id },
            }
            return { columns: [...prev.columns, newColumn] }
          }
          return mapPane(prev, paneId, (p) => ({
            ...p,
            tabs: p.tabs.some((t) => t.id === tab.id) ? p.tabs : [...p.tabs, tab],
            activeTabId: tab.id,
          }))
        })
      },
      [],
    )

    const closeTab = React.useCallback((paneId: string, tabId: string) => {
      setLayout((prev) => {
        const found = findPaneInLayout(prev, paneId)
        if (!found) return prev
        const pane = found.pane
        const tab = pane.tabs.find((t) => t.id === tabId)
        if (tab?.pinned) return prev
        const next = pane.tabs.filter((t) => t.id !== tabId)
        if (next.length === 0) {
          // Last tab — remove the pane from its column (or remove the column)
          return removePane(prev, paneId)
        }
        const wasActive = pane.activeTabId === tabId
        const removedIdx = pane.tabs.findIndex((t) => t.id === tabId)
        const newActiveId = wasActive
          ? (next[Math.max(0, removedIdx - 1)]?.id ?? next[0]!.id)
          : pane.activeTabId
        return mapPane(prev, paneId, (p) => ({ ...p, tabs: next, activeTabId: newActiveId }))
      })
    }, [])

    const activateTab = React.useCallback((paneId: string, tabId: string) => {
      setLastActivePaneId(paneId)
      setLayout((prev) => mapPane(prev, paneId, (p) => ({ ...p, activeTabId: tabId })))
    }, [])

    const updateTab = React.useCallback(
      (paneId: string, tabId: string, patch: Partial<WorkspaceTabDef>) => {
        setLayout((prev) =>
          mapPane(prev, paneId, (p) => ({
            ...p,
            tabs: p.tabs.map((t) => (t.id === tabId ? { ...t, ...patch } : t)),
          })),
        )
      },
      [],
    )

    const openPane = React.useCallback((paneDef: WorkspacePaneDef) => {
      setLayout((prev) => {
        if (prev.columns.some((col) => col.id === paneDef.id || col.bottomPane?.id === paneDef.id)) {
          return prev
        }
        const newColumn: PaneColumn = { id: paneDef.id, topPane: toPaneState(paneDef) }
        return { columns: [...prev.columns, newColumn] }
      })
    }, [])

    const closePane = React.useCallback((paneId: string) => {
      setLayout((prev) => removePane(prev, paneId))
    }, [])

    const registerTabStrip = React.useCallback((paneId: string, el: HTMLElement | null) => {
      if (el) tabStripRefs.current.set(paneId, el)
      else tabStripRefs.current.delete(paneId)
    }, [])

    const reorderTabInPane = React.useCallback((paneId: string, tabId: string, toIndex: number) => {
      setLayout((prev) =>
        mapPane(prev, paneId, (p) => {
          const fromIndex = p.tabs.findIndex((t) => t.id === tabId)
          if (fromIndex === -1 || toIndex === fromIndex || toIndex === fromIndex + 1) return p
          const tabs = [...p.tabs]
          const [tab] = tabs.splice(fromIndex, 1)
          tabs.splice(toIndex > fromIndex ? toIndex - 1 : toIndex, 0, tab!)
          return { ...p, tabs }
        }),
      )
    }, [])

    const moveTabToPane = React.useCallback(
      (sourcePaneId: string, tabId: string, targetPaneId: string, toIndex: number) => {
        setLayout((prev) => {
          const sourceFound = findPaneInLayout(prev, sourcePaneId)
          if (!sourceFound) return prev
          const sourcePane = sourceFound.pane
          const draggedTab = sourcePane.tabs.find((t) => t.id === tabId)
          if (!draggedTab) return prev

          const remainingTabs = sourcePane.tabs.filter((t) => t.id !== tabId)
          let layoutAfterRemove: WorkspaceLayout
          if (remainingTabs.length === 0) {
            layoutAfterRemove = removePane(prev, sourcePaneId)
          } else {
            const wasActive = sourcePane.activeTabId === tabId
            const removedIdx = sourcePane.tabs.findIndex((t) => t.id === tabId)
            const newActiveId = wasActive
              ? (remainingTabs[Math.max(0, removedIdx - 1)]?.id ?? remainingTabs[0]!.id)
              : sourcePane.activeTabId
            layoutAfterRemove = mapPane(prev, sourcePaneId, (p) => ({
              ...p,
              tabs: remainingTabs,
              activeTabId: newActiveId,
            }))
          }

          const targetFound = findPaneInLayout(layoutAfterRemove, targetPaneId)
          if (!targetFound) return layoutAfterRemove

          return mapPane(layoutAfterRemove, targetPaneId, (p) => {
            const tabs = [...p.tabs]
            tabs.splice(Math.min(toIndex, tabs.length), 0, draggedTab)
            return { ...p, tabs, activeTabId: draggedTab.id }
          })
        })
      },
      [],
    )

    // ── Split operation ────────────────────────────────────────────────────

    const executeSplit = React.useCallback(
      (sourcePaneId: string, tabId: string, targetPaneId: string, zone: SnapZone) => {
        setLayout((prev) => {
          // 1. Extract the dragged tab from source pane
          const sourceFound = findPaneInLayout(prev, sourcePaneId)
          if (!sourceFound) return prev
          const sourcePane = sourceFound.pane
          const draggedTab = sourcePane.tabs.find((t) => t.id === tabId)
          if (!draggedTab) return prev

          // 2. Remove tab from source; determine if source pane becomes empty
          const remainingTabs = sourcePane.tabs.filter((t) => t.id !== tabId)
          let layoutAfterRemove: WorkspaceLayout
          if (remainingTabs.length === 0) {
            layoutAfterRemove = removePane(prev, sourcePaneId)
          } else {
            const wasActive = sourcePane.activeTabId === tabId
            const removedIdx = sourcePane.tabs.findIndex((t) => t.id === tabId)
            const newActiveId = wasActive
              ? (remainingTabs[Math.max(0, removedIdx - 1)]?.id ?? remainingTabs[0]!.id)
              : sourcePane.activeTabId
            layoutAfterRemove = mapPane(prev, sourcePaneId, (p) => ({
              ...p,
              tabs: remainingTabs,
              activeTabId: newActiveId,
            }))
          }

          // 3. Create new pane for the dragged tab
          const newPaneId = `${tabId}-pane-${Date.now()}`
          const newPane: PaneState = {
            id: newPaneId,
            tabs: [draggedTab],
            activeTabId: draggedTab.id,
            minSize: MIN_COL_SIZE,
          }

          // 4. Find target column in the updated layout
          const targetFound = findPaneInLayout(layoutAfterRemove, targetPaneId)
          if (!targetFound) {
            // Target pane was removed (was the source and only pane) — just append
            const newColumn: PaneColumn = { id: newPaneId, topPane: newPane }
            return normalizeColumnSizes({ columns: [...layoutAfterRemove.columns, newColumn] })
          }
          const targetColId = targetFound.columnId

          // 5. Insert based on zone
          const cols = layoutAfterRemove.columns
          const targetColIdx = cols.findIndex((c) => c.id === targetColId)
          if (targetColIdx === -1) return layoutAfterRemove

          const targetCol = cols[targetColIdx]!

          if (zone === "left") {
            const newColumn: PaneColumn = { id: newPaneId, topPane: newPane }
            const next = [...cols]
            next.splice(targetColIdx, 0, newColumn)
            return normalizeColumnSizes({ columns: next })
          }

          if (zone === "right") {
            const newColumn: PaneColumn = { id: newPaneId, topPane: newPane }
            const next = [...cols]
            next.splice(targetColIdx + 1, 0, newColumn)
            return normalizeColumnSizes({ columns: next })
          }

          // top / bottom — vertical split within the column
          // If column already has a bottomPane, fall back to a new side column
          if (zone === "top") {
            if (targetFound.slot === "bottom") {
              // Target is already the bottom pane — insert column to the left
              const newColumn: PaneColumn = { id: newPaneId, topPane: newPane }
              const next = [...cols]
              next.splice(targetColIdx, 0, newColumn)
              return normalizeColumnSizes({ columns: next })
            }
            // Target is topPane — push current topPane to bottomPane, newPane becomes topPane
            if (targetCol.bottomPane) {
              // Already split — insert column to the left
              const newColumn: PaneColumn = { id: newPaneId, topPane: newPane }
              const next = [...cols]
              next.splice(targetColIdx, 0, newColumn)
              return normalizeColumnSizes({ columns: next })
            }
            const updatedCol: PaneColumn = {
              ...targetCol,
              topPane: newPane,
              bottomPane: targetCol.topPane,
            }
            return { columns: cols.map((c, i) => (i === targetColIdx ? updatedCol : c)) }
          }

          // zone === "bottom"
          if (targetFound.slot === "top") {
            if (targetCol.bottomPane) {
              // Already split — insert column to the right
              const newColumn: PaneColumn = { id: newPaneId, topPane: newPane }
              const next = [...cols]
              next.splice(targetColIdx + 1, 0, newColumn)
              return normalizeColumnSizes({ columns: next })
            }
            const updatedCol: PaneColumn = { ...targetCol, bottomPane: newPane }
            return { columns: cols.map((c, i) => (i === targetColIdx ? updatedCol : c)) }
          }

          // Target is bottomPane — insert column to the right
          const newColumn: PaneColumn = { id: newPaneId, topPane: newPane }
          const next = [...cols]
          next.splice(targetColIdx + 1, 0, newColumn)
          return normalizeColumnSizes({ columns: next })
        })
      },
      [],
    )

    // ── Pointer event handlers ─────────────────────────────────────────────

    const handlePointerMove = React.useCallback((e: PointerEvent) => {
      const session = dragSession.current
      if (!session) return

      if (!session.didThreshold) {
        const dx = e.clientX - session.startX
        const dy = e.clientY - session.startY
        if (Math.hypot(dx, dy) < 4) return
        session.didThreshold = true
      }

      setGhostPos({ x: e.clientX, y: e.clientY })

      // ── Tab strip detection (priority over snap zones) ──────────────────
      for (const [paneId, el] of tabStripRefs.current) {
        const rect = el.getBoundingClientRect()
        if (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom
        ) {
          const tabButtons = el.querySelectorAll<HTMLElement>('[role="tab"]')
          let insertIndex = tabButtons.length
          for (let i = 0; i < tabButtons.length; i++) {
            const btnRect = tabButtons[i]!.getBoundingClientRect()
            if (e.clientX < btnRect.left + btnRect.width / 2) {
              insertIndex = i
              break
            }
          }
          const next: TabDropTarget = { targetPaneId: paneId, insertIndex }
          const cur = tabDropTargetRef.current
          if (cur?.targetPaneId !== next.targetPaneId || cur?.insertIndex !== next.insertIndex) {
            setTabDropTargetSynced(next)
          }
          if (snapStateRef.current !== null) setSnapStateSynced(null)
          return
        }
      }
      if (tabDropTargetRef.current !== null) setTabDropTargetSynced(null)

      // ── Snap zone detection ─────────────────────────────────────────────
      let bestPaneId: string | null = null
      let bestRect: DOMRect | null = null
      for (const [paneId, el] of paneRefs.current) {
        const rect = el.getBoundingClientRect()
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          bestPaneId = paneId
          bestRect = rect
          break
        }
      }

      if (!bestPaneId || !bestRect) {
        setSnapStateSynced(null)
        return
      }

      // Clip rect to visible viewport — elements may extend beyond the fold
      // when parent containers use overflow:hidden, so we must use the visible
      // portion when calculating snap zone edges.
      const visibleRight = Math.min(bestRect.right, window.innerWidth)
      const visibleBottom = Math.min(bestRect.bottom, window.innerHeight)
      const visibleWidth = visibleRight - bestRect.left
      const visibleHeight = visibleBottom - bestRect.top

      const snapSize = Math.min(visibleWidth * 0.25, 120)
      const snapSizeV = Math.min(visibleHeight * 0.25, 120)
      let zone: SnapZone | null = null

      if (e.clientX - bestRect.left < snapSize) zone = "left"
      else if (visibleRight - e.clientX < snapSize) zone = "right"
      else if (e.clientY - bestRect.top < snapSizeV) zone = "top"
      else if (visibleBottom - e.clientY < snapSizeV) zone = "bottom"

      const next: SnapState | null = zone ? { targetPaneId: bestPaneId, zone } : null

      const cur = snapStateRef.current
      if (next?.targetPaneId !== cur?.targetPaneId || next?.zone !== cur?.zone) {
        setSnapStateSynced(next)
      }
    }, [setSnapStateSynced, setTabDropTargetSynced])

    const handlePointerUp = React.useCallback(() => {
      dragAbortController.current?.abort()
      dragAbortController.current = null

      const session = dragSession.current
      const snap = snapStateRef.current
      const tabDrop = tabDropTargetRef.current
      dragSession.current = null
      setIsDragging(false)
      setGhostPos(null)
      setGhostTitle(null)
      setSnapStateSynced(null)
      setTabDropTargetSynced(null)
      document.body.style.cursor = ""

      if (session && session.didThreshold) {
        if (tabDrop) {
          if (tabDrop.targetPaneId === session.sourcePaneId) {
            reorderTabInPane(session.sourcePaneId, session.tabId, tabDrop.insertIndex)
          } else {
            moveTabToPane(session.sourcePaneId, session.tabId, tabDrop.targetPaneId, tabDrop.insertIndex)
          }
        } else if (snap) {
          executeSplit(session.sourcePaneId, session.tabId, snap.targetPaneId, snap.zone)
        }
      }
    }, [executeSplit, reorderTabInPane, moveTabToPane, setSnapStateSynced, setTabDropTargetSynced])

    const handlePointerCancel = React.useCallback(() => {
      dragAbortController.current?.abort()
      dragAbortController.current = null
      dragSession.current = null
      setIsDragging(false)
      setGhostPos(null)
      setGhostTitle(null)
      setSnapStateSynced(null)
      setTabDropTargetSynced(null)
      document.body.style.cursor = ""
    }, [setSnapStateSynced, setTabDropTargetSynced])

    const startDrag = React.useCallback(
      (sourcePaneId: string, tabId: string, tabTitle: string, pointerId: number, x: number, y: number) => {
        dragSession.current = {
          tabId,
          tabTitle,
          sourcePaneId,
          pointerId,
          startX: x,
          startY: y,
          didThreshold: false,
        }
        setIsDragging(true)
        setGhostTitle(tabTitle)
        document.body.style.cursor = "grabbing"
        const ac = new AbortController()
        dragAbortController.current = ac
        document.addEventListener("pointermove", handlePointerMove, { signal: ac.signal })
        document.addEventListener("pointerup", handlePointerUp, { signal: ac.signal })
        document.addEventListener("pointercancel", handlePointerCancel, { signal: ac.signal })
      },
      [handlePointerMove, handlePointerUp, handlePointerCancel],
    )

    const registerPane = React.useCallback((paneId: string, el: HTMLElement | null) => {
      if (el) {
        paneRefs.current.set(paneId, el)
      } else {
        paneRefs.current.delete(paneId)
      }
    }, [])

    // ── Imperative handle ──────────────────────────────────────────────────

    React.useImperativeHandle(
      ref,
      () => ({
        lastActivePaneId: resolvedLastActivePaneId,
        openTabInPane,
        closeTab,
        activateTab,
        updateTab,
        openPane,
        closePane,
      }),
      [resolvedLastActivePaneId, openTabInPane, closeTab, activateTab, updateTab, openPane, closePane],
    )

    // ── Contexts ───────────────────────────────────────────────────────────

    const isShowingFallback = panes.length === 0

    const ctx = React.useMemo<WorkspaceContextValue>(
      () => ({
        panes,
        isShowingFallback,
        lastActivePaneId: resolvedLastActivePaneId,
        openTabInPane,
        closeTab,
        activateTab,
        updateTab,
        openPane,
        closePane,
      }),
      [panes, isShowingFallback, resolvedLastActivePaneId, openTabInPane, closeTab, activateTab, updateTab, openPane, closePane],
    )

    const dragCtx = React.useMemo<WorkspaceDragContextValue>(
      () => ({ isDragging, snapState, tabDropTarget, registerPane, registerTabStrip, startDrag, setLastActivePane }),
      [isDragging, snapState, tabDropTarget, registerPane, registerTabStrip, startDrag, setLastActivePane],
    )

    // ── Render ─────────────────────────────────────────────────────────────

    return (
      <WorkspaceContext.Provider value={ctx}>
        <WorkspaceDragContext.Provider value={dragCtx}>
          <div
            data-slot="workspace"
            className={cn("flex h-full w-full overflow-hidden", className)}
          >
            {isShowingFallback ? (
              <WorkspaceFallback>
                {fallback ?? <WorkspaceDefaultFallback />}
              </WorkspaceFallback>
            ) : (
              <WorkspacePaneGroupFromLayout
                layout={layout}
                onTabChange={activateTab}
                onTabClose={closeTab}
                renderTabContent={renderTabContent}
              />
            )}
            {ghostPos && ghostTitle && (
              <DragGhost
                title={ghostTitle}
                x={ghostPos.x}
                y={ghostPos.y}
              />
            )}
          </div>
        </WorkspaceDragContext.Provider>
      </WorkspaceContext.Provider>
    )
  },
)

// ── Helpers ────────────────────────────────────────────────────────────────

function toPaneState(p: WorkspacePaneDef): PaneState {
  return {
    id: p.id,
    tabs: p.tabs,
    activeTabId: p.defaultActiveTabId ?? p.tabs[0]?.id ?? "",
    defaultSize: p.defaultSize,
    minSize: p.minSize,
    onAddTab: p.onAddTab,
  }
}

/** Find a pane anywhere in the layout. Returns the pane, its column ID, and its slot. */
function findPaneInLayout(
  layout: WorkspaceLayout,
  paneId: string,
): { pane: PaneState; columnId: string; slot: "top" | "bottom" } | null {
  for (const col of layout.columns) {
    if (col.topPane.id === paneId) return { pane: col.topPane, columnId: col.id, slot: "top" }
    if (col.bottomPane?.id === paneId) return { pane: col.bottomPane, columnId: col.id, slot: "bottom" }
  }
  return null
}

/** Apply a mutation function to a specific pane, returning a new layout. */
function mapPane(
  layout: WorkspaceLayout,
  paneId: string,
  fn: (p: PaneState) => PaneState,
): WorkspaceLayout {
  return {
    columns: layout.columns.map((col) => {
      if (col.topPane.id === paneId) return { ...col, topPane: fn(col.topPane) }
      if (col.bottomPane?.id === paneId) return { ...col, bottomPane: fn(col.bottomPane) }
      return col
    }),
  }
}

/** Remove a pane from the layout. Removes its column if it was the last pane in it. */
function removePane(layout: WorkspaceLayout, paneId: string): WorkspaceLayout {
  const columns = layout.columns.reduce<PaneColumn[]>((acc, col) => {
    if (col.topPane.id === paneId) {
      // If there's a bottomPane, promote it to topPane
      if (col.bottomPane) {
        acc.push({ ...col, topPane: col.bottomPane, bottomPane: undefined })
      }
      // Otherwise drop the column entirely
      return acc
    }
    if (col.bottomPane?.id === paneId) {
      acc.push({ ...col, bottomPane: undefined })
      return acc
    }
    acc.push(col)
    return acc
  }, [])
  return { columns }
}

/** Distribute column defaultSize equally and enforce a consistent minSize floor. */
function normalizeColumnSizes(layout: WorkspaceLayout): WorkspaceLayout {
  const count = layout.columns.length
  if (count === 0) return layout
  const equalSize = 100 / count
  return {
    columns: layout.columns.map((col) => ({
      ...col,
      topPane: { ...col.topPane, defaultSize: equalSize, minSize: MIN_COL_SIZE },
    })),
  }
}

// ── WorkspaceFallback ──────────────────────────────────────────────────────

function WorkspaceFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}

function WorkspaceDefaultFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
      <p className="text-sm">No open panels</p>
      <p className="text-xs opacity-60">Open a tab to get started</p>
    </div>
  )
}

// ── WorkspaceResizeHandle ──────────────────────────────────────────────────

function WorkspaceResizeHandle({ className }: { className?: string }) {
  return (
    <ResizableHandle
      className={cn(
        "bg-border/30 transition-colors hover:bg-border [&>div]:hidden",
        // Column separator (vertical line)
        "w-[6px] after:w-3",
        // Row separator (horizontal line) — library sets aria-orientation=horizontal
        "aria-[orientation=horizontal]:h-[6px] aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:h-3",
        className,
      )}
    />
  )
}

// ── WorkspacePaneGroupFromLayout ───────────────────────────────────────────

function WorkspacePaneGroupFromLayout({
  layout,
  onTabChange,
  onTabClose,
  renderTabContent,
}: {
  layout: WorkspaceLayout
  onTabChange: (paneId: string, tabId: string) => void
  onTabClose: (paneId: string, tabId: string) => void
  renderTabContent: (paneId: string, activeTabId: string) => React.ReactNode
}) {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
      {layout.columns.map((col, i) => (
        <React.Fragment key={col.id}>
          {i > 0 && <WorkspaceResizeHandle />}
          <ResizablePanel
            id={col.id}
            defaultSize={col.topPane.defaultSize}
            minSize={col.topPane.minSize ?? MIN_COL_SIZE}
          >
            {col.bottomPane ? (
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel id={col.topPane.id} defaultSize={50} minSize={MIN_ROW_SIZE}>
                  <WorkspacePaneWrapper paneId={col.topPane.id}>
                    <WorkspaceTabs
                      tabs={col.topPane.tabs}
                      activeTabId={col.topPane.activeTabId}
                      onTabChange={(tabId) => onTabChange(col.topPane.id, tabId)}
                      onTabClose={(tabId) => onTabClose(col.topPane.id, tabId)}
                      onAddTab={col.topPane.onAddTab}
                      className="h-full"
                    >
                      {renderTabContent(col.topPane.id, col.topPane.activeTabId)}
                    </WorkspaceTabs>
                  </WorkspacePaneWrapper>
                </ResizablePanel>
                <WorkspaceResizeHandle />
                <ResizablePanel id={col.bottomPane.id} defaultSize={50} minSize={MIN_ROW_SIZE}>
                  <WorkspacePaneWrapper paneId={col.bottomPane.id}>
                    <WorkspaceTabs
                      tabs={col.bottomPane.tabs}
                      activeTabId={col.bottomPane.activeTabId}
                      onTabChange={(tabId) => onTabChange(col.bottomPane!.id, tabId)}
                      onTabClose={(tabId) => onTabClose(col.bottomPane!.id, tabId)}
                      onAddTab={col.bottomPane.onAddTab}
                      className="h-full"
                    >
                      {renderTabContent(col.bottomPane.id, col.bottomPane.activeTabId)}
                    </WorkspaceTabs>
                  </WorkspacePaneWrapper>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <WorkspacePaneWrapper paneId={col.topPane.id}>
                <WorkspaceTabs
                  tabs={col.topPane.tabs}
                  activeTabId={col.topPane.activeTabId}
                  onTabChange={(tabId) => onTabChange(col.topPane.id, tabId)}
                  onTabClose={(tabId) => onTabClose(col.topPane.id, tabId)}
                  onAddTab={col.topPane.onAddTab}
                  className="h-full"
                >
                  {renderTabContent(col.topPane.id, col.topPane.activeTabId)}
                </WorkspaceTabs>
              </WorkspacePaneWrapper>
            )}
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  )
}

// ── WorkspacePaneWrapper ───────────────────────────────────────────────────

type WorkspaceTabsInjectableProps = {
  onTabDragStart?: (tabId: string, tabTitle: string, pointerId: number, x: number, y: number) => void
  tabStripRef?: React.Ref<HTMLElement>
  tabDropInsertIndex?: number | null
}

function WorkspacePaneWrapper({
  paneId,
  children,
}: {
  paneId: string
  children: React.ReactNode
}) {
  const { isDragging, snapState, tabDropTarget, registerPane, registerTabStrip, startDrag, setLastActivePane } = useWorkspaceDrag()

  const paneRef = React.useCallback(
    (el: HTMLElement | null) => registerPane(paneId, el),
    [paneId, registerPane],
  )

  const tabStripRef = React.useCallback(
    (el: HTMLElement | null) => registerTabStrip(paneId, el),
    [paneId, registerTabStrip],
  )

  const handlePointerDown = React.useCallback(() => {
    setLastActivePane(paneId)
  }, [paneId, setLastActivePane])

  const tabDropInsertIndex = tabDropTarget?.targetPaneId === paneId ? tabDropTarget.insertIndex : null

  // Re-clone WorkspaceTabs to inject drag props
  const childrenWithDrag = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<WorkspaceTabsInjectableProps>, {
        onTabDragStart: (tabId: string, tabTitle: string, pointerId: number, x: number, y: number) =>
          startDrag(paneId, tabId, tabTitle, pointerId, x, y),
        tabStripRef,
        tabDropInsertIndex,
      })
    }
    return child
  })

  return (
    <div ref={paneRef} className="relative h-full w-full" onPointerDown={handlePointerDown}>
      {childrenWithDrag}
      {isDragging && tabDropTarget === null && (
        <SnapZoneOverlay
          activeZone={snapState?.targetPaneId === paneId ? snapState.zone : null}
        />
      )}
    </div>
  )
}

// ── SnapZoneOverlay ────────────────────────────────────────────────────────

const ZONE_CLASSES: Record<SnapZone, string> = {
  left:   "inset-y-0 left-0 w-1/2",
  right:  "inset-y-0 right-0 w-1/2",
  top:    "inset-x-0 top-0 h-1/2",
  bottom: "inset-x-0 bottom-0 h-1/2",
}

const ZONE_BORDER: Record<SnapZone, string> = {
  left:   "border-r border-border",
  right:  "border-l border-border",
  top:    "border-b border-border",
  bottom: "border-t border-border",
}

const ZONE_LABEL: Record<SnapZone, string> = {
  left:   "Drop to add a new Column\nor move away to cancel",
  right:  "Drop to add a new Column\nor move away to cancel",
  top:    "Drop to add a new Row\nor move away to cancel",
  bottom: "Drop to add a new Row\nor move away to cancel",
}

function SnapZoneOverlay({ activeZone }: { activeZone: SnapZone | null }) {
  if (!activeZone) return null
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute flex items-center justify-center",
        "bg-muted/70 backdrop-blur-[1px]",
        "animate-in fade-in-0 duration-100",
        ZONE_CLASSES[activeZone],
        ZONE_BORDER[activeZone],
      )}
    >
      <p className="max-w-[180px] whitespace-pre-line text-center text-[11px] leading-relaxed text-muted-foreground">
        {ZONE_LABEL[activeZone]}
      </p>
    </div>
  )
}

// ── DragGhost ──────────────────────────────────────────────────────────────

function DragGhost({ title, x, y }: { title: string; x: number; y: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-50 select-none"
      style={{ left: x + 14, top: y - 10, rotate: "-2deg" }}
    >
      <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 shadow-md">
        <span className="text-[12px] font-medium text-foreground">{title}</span>
      </div>
    </div>
  )
}
