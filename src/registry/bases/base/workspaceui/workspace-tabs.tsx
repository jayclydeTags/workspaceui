"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { Tabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWorkspaceDragOptional } from "@/registry/bases/base/workspaceui/workspace-context"

// ── Types ─────────────────────────────────────────────────────────────────

export interface WorkspaceTab {
  id: string
  title: string
  icon?: React.ReactNode
  badge?: number
  /** Pinned tabs cannot be closed — no close button is rendered. */
  pinned?: boolean
}

export interface WorkspaceTabsProps {
  tabs: WorkspaceTab[]
  activeTabId: string
  onTabChange: (id: string) => void
  /** Omit to hide close buttons */
  onTabClose?: (id: string) => void
  /** Omit to hide "+" button */
  onAddTab?: () => void
  /** Required for drag-and-drop when used inside <Workspace>. */
  paneId?: string
  className?: string
  children: React.ReactNode
}

// ── Curved corner connectors ──────────────────────────────────────────────
// These sit outside the active tab's edges and are clipped to a quarter-circle
// shape, creating the macOS-style smooth curve where the tab meets the strip.
// The bg must match the active tab bg exactly.

const CONNECTOR_BG_CLASS = "bg-card"

function LeftConnector() {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-[-1px] left-[1px] h-[19px] w-[19px] -translate-x-full",
        CONNECTOR_BG_CLASS,
      )}
      style={{
        clipPath:
          'path("M 10.61 18.16 C 8.38 19 5.59 19 0 19 H 19 V 0 C 19 5.59 19 8.38 18.16 10.61 C 16.84 14.09 14.09 16.84 10.61 18.16 Z")',
      }}
    />
  )
}

function RightConnector() {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-[-1px] right-[1px] h-[19px] w-[19px] translate-x-full",
        CONNECTOR_BG_CLASS,
      )}
      style={{
        clipPath:
          'path("M 8.39 18.16 C 10.62 19 13.41 19 19 19 H 0 V 0 C 0 5.59 0 8.38 0.84 10.61 C 2.16 14.09 4.91 16.84 8.39 18.16 Z")',
      }}
    />
  )
}

// ── WorkspaceTabs ──────────────────────────────────────────────────────────

function TabDropIndicator() {
  return (
    <div
      aria-hidden
      className="mx-0.5 h-5 w-0.5 shrink-0 self-center rounded-full bg-primary"
    />
  )
}

function WorkspaceTabs({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onAddTab,
  paneId,
  className,
  children,
}: WorkspaceTabsProps) {
  const dragCtx = useWorkspaceDragOptional()
  const registerTabStrip = dragCtx?.registerTabStrip

  const tabStripRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      if (paneId != null) registerTabStrip?.(paneId, el)
    },
    [paneId, registerTabStrip],
  )

  const tabDropInsertIndex =
    paneId != null && dragCtx?.tabDropTarget?.targetPaneId === paneId
      ? dragCtx.tabDropTarget.insertIndex
      : null

  return (
    // Tabs.Root/List/Tab/Panel supply roving focus, Home/End/Arrow nav, and
    // the tab/tablist/tabpanel aria wiring. Styling, drag, connectors, badge,
    // and close buttons are all ours — Base UI only owns the a11y engine.
    <Tabs.Root
      value={activeTabId}
      onValueChange={(value) => onTabChange(String(value))}
      data-slot="workspace-tabs"
      className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}
    >
      {/* ── Tab strip ── */}
      <div
        ref={tabStripRef}
        data-slot="workspace-tab-list"
        className="flex shrink-0 items-end border-b border-border bg-muted/30 pl-2"
      >
        {/* Scrollable tab row */}
        <Tabs.List
          aria-label="Open tabs"
          className="flex min-w-0 items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId
            return (
              <React.Fragment key={tab.id}>
                {/* Drop indicator shown when dragging over this strip position */}
                {tabDropInsertIndex === index && <TabDropIndicator />}

                <Tabs.Tab
                  value={tab.id}
                  id={`workspace-tab-${tab.id}`}
                  onPointerDown={(e) => {
                    if (tab.pinned || !paneId || !dragCtx) return
                    onTabChange(tab.id)
                    e.currentTarget.setPointerCapture(e.pointerId)
                    e.preventDefault()
                    dragCtx.startDrag(paneId, tab.id, tab.title, e.pointerId, e.clientX, e.clientY)
                  }}
                  className={cn(
                    // Layout & sizing
                    "group relative flex min-w-[152px] max-w-[180px] cursor-pointer items-center gap-1.5",
                    "rounded-t-[10px] px-3 py-2 text-[13px] select-none whitespace-nowrap",
                    "outline-none transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    // Inactive
                    !isActive &&
                      "text-foreground/60 hover:bg-foreground/5 hover:text-foreground/80",
                    // Active: overlap tab strip bottom border by 1px
                    isActive &&
                      "z-10 mb-[-1px] bg-card text-foreground",
                  )}
                >
                  {/* Left curve connector (active tab only) */}
                  {isActive && <LeftConnector />}

                  {/* Favicon / icon */}
                  {tab.icon != null && (
                    <span className="flex shrink-0 [&_svg]:size-[14px]">
                      {tab.icon}
                    </span>
                  )}

                  {/* Label with right-edge fade on overflow */}
                  <span
                    className="min-w-0 flex-1 overflow-hidden text-left"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {tab.title}
                  </span>

                  {/* Unread badge */}
                  {tab.badge != null && tab.badge > 0 && (
                    <Badge className="h-4 min-w-4 shrink-0 rounded-full px-1 text-[10px]">
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </Badge>
                  )}

                  {/* Close button — hidden for pinned tabs */}
                  {/* Must be a div, not a button — buttons cannot be nested inside buttons */}
                  {onTabClose != null && !tab.pinned && (
                    <div
                      role="button"
                      tabIndex={-1}
                      aria-label={`Close ${tab.title}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onTabClose(tab.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          e.stopPropagation()
                          onTabClose(tab.id)
                        }
                      }}
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded",
                        "text-foreground/40 hover:bg-foreground/10 hover:text-foreground",
                        "opacity-0 transition-all group-hover:opacity-100",
                        isActive && "opacity-50 group-hover:opacity-100",
                      )}
                    >
                      <X className="size-3" />
                    </div>
                  )}

                  {/* Right curve connector (active tab only) */}
                  {isActive && <RightConnector />}
                </Tabs.Tab>
              </React.Fragment>
            )
          })}
          {/* Trailing drop indicator (append at end) */}
          {tabDropInsertIndex === tabs.length && <TabDropIndicator />}
        </Tabs.List>

        {/* Add-tab button (32×32) */}
        {onAddTab != null && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New tab"
            onClick={onAddTab}
            className="mx-1 mb-1.5 shrink-0 text-foreground/50"
          >
            <Plus />
          </Button>
        )}
      </div>

      {/* ── Content area ── */}
      {/* Single panel: value always matches the active tab, so it's always shown.
          Base UI wires role="tabpanel" + aria-labelledby to the active tab. */}
      <Tabs.Panel
        value={activeTabId}
        className="min-h-0 flex-1 overflow-auto"
      >
        {children}
      </Tabs.Panel>
    </Tabs.Root>
  )
}

export { WorkspaceTabs }
