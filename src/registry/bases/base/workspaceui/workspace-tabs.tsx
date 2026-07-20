"use client"

import * as React from "react"
import { Check, ChevronDown, Plus, X } from "lucide-react"
import { Tabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWorkspaceDragOptional } from "@/registry/bases/base/workspaceui/workspace-context"

// ── Types ─────────────────────────────────────────────────────────────────

export interface WorkspaceTab {
  id: string
  title: string
  icon?: React.ReactNode
  badge?: number
  /** Pinned tabs cannot be closed — no close button is rendered. */
  pinned?: boolean
  /** Unsaved changes: shows a dot instead of the close button until hovered. */
  dirty?: boolean
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

  // Split and move are otherwise drag-only, i.e. unreachable by keyboard. The
  // menu is the keyboard path — and the discoverable one for everyone else.
  const activeTab = tabs.find((t) => t.id === activeTabId)
  const canRearrange =
    dragCtx != null && paneId != null && activeTab != null && !activeTab.pinned
  const moveTargets = canRearrange
    ? dragCtx.paneTargets.filter((p) => p.id !== paneId)
    : []
  // Splitting a pane's only tab would just rebuild the same pane elsewhere.
  const canSplit = canRearrange && tabs.length > 1

  return (
    // Tabs.Root/List/Tab/Panel supply roving focus, Home/End/Arrow nav, and
    // the tab/tablist/tabpanel aria wiring. Styling, drag, badge, and close
    // buttons are all ours — Base UI only owns the a11y engine.
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
        // No border-b: the bg-muted strip meeting the bg-card panel is the
        // edge. A border here would also show *under* the active tab — the
        // tab can't overlap it, since the scrolling tab list clips vertically.
        className="flex shrink-0 items-end bg-muted"
      >
        {/* Tab menu — every open tab in this strip, plus split/move for the
            active one (the keyboard route to what dragging does). */}
        {tabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Tab menu"
                  // self-center (not the strip's items-end) so it sits on the
                  // tabs' centreline; hover matches the inactive tabs'.
                  className="ml-1 shrink-0 self-center rounded-[8px] text-foreground/50 hover:bg-foreground/5"
                />
              }
            >
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="gap-2"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-[14px]">
                    {tab.icon}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{tab.title}</span>
                  {tab.badge != null && tab.badge > 0 && (
                    <Badge className="h-4 min-w-4 shrink-0 rounded-full px-1 text-[10px]">
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </Badge>
                  )}
                  <Check
                    className={cn(
                      "size-3.5 shrink-0",
                      tab.id !== activeTabId && "invisible",
                    )}
                  />
                </DropdownMenuItem>
              ))}

              {(canSplit || moveTargets.length > 0) && activeTab != null && (
                <>
                  <DropdownMenuSeparator />
                  {/* Grouped so the label names what these actions act on —
                      Base UI also requires a Group parent for the label. */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-muted-foreground">
                      {activeTab.title}
                    </DropdownMenuLabel>
                    {canSplit && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            dragCtx!.splitTab(paneId!, activeTab.id, "right")
                          }
                        >
                          Split right
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            dragCtx!.splitTab(paneId!, activeTab.id, "bottom")
                          }
                        >
                          Split down
                        </DropdownMenuItem>
                      </>
                    )}
                    {/* Flat rather than a submenu: a workspace has few panes,
                        and this drops a whole traversal step for keyboard. */}
                    {moveTargets.map((target) => (
                      <DropdownMenuItem
                        key={target.id}
                        onClick={() =>
                          dragCtx!.moveTab(paneId!, activeTab.id, target.id)
                        }
                      >
                        Move to {target.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Scrollable tab row */}
        <Tabs.List
          aria-label="Open tabs"
          className="flex min-w-0 items-end overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    // preventDefault suppresses text selection *and* the focus
                    // that pointerdown would normally do — so focus by hand, or
                    // Base UI's roving focus never engages after a click.
                    e.preventDefault()
                    e.currentTarget.focus()
                    dragCtx.startDrag(paneId, tab.id, tab.title, e)
                  }}
                  onKeyDown={(e) => {
                    // Close from the tab itself: the close affordance is a
                    // tabIndex={-1} div (can't be a button inside a button), so
                    // this is the only keyboard path to it.
                    if (
                      onTabClose != null &&
                      !tab.pinned &&
                      (e.key === "Delete" || e.key === "Backspace")
                    ) {
                      e.preventDefault()
                      onTabClose(tab.id)
                    }
                  }}
                  className={cn(
                    // Layout & sizing
                    "group relative flex min-w-[152px] max-w-[180px] cursor-pointer items-center gap-1.5",
                    "px-3 py-2 text-[13px] select-none whitespace-nowrap",
                    "outline-none transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    // Inactive
                    !isActive &&
                      "text-foreground/60 hover:bg-foreground/5 hover:text-foreground/80",
                    isActive && "bg-card text-foreground",
                  )}
                >
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
                      aria-label={
                        tab.dirty
                          ? `Close ${tab.title} (unsaved changes)`
                          : `Close ${tab.title}`
                      }
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onTabClose(tab.id)
                      }}
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded",
                        "text-foreground/40 hover:bg-foreground/10 hover:text-foreground",
                        "opacity-0 transition-all group-hover:opacity-100",
                        isActive && "opacity-50 group-hover:opacity-100",
                        // A dirty tab always shows its dot, even unhovered/inactive.
                        tab.dirty && "opacity-100",
                      )}
                    >
                      {tab.dirty ? (
                        <>
                          <span
                            aria-hidden
                            className="size-2 rounded-full bg-foreground/60 group-hover:hidden"
                          />
                          <X className="hidden size-3 group-hover:block" />
                        </>
                      ) : (
                        <X className="size-3" />
                      )}
                    </div>
                  )}
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
            className="mx-1 shrink-0 self-center rounded-[8px] text-foreground/50 hover:bg-foreground/5"
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
