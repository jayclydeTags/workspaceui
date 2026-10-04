"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ArrowDown01Icon,
  PlusSignIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { Tabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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
    [paneId, registerTabStrip]
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
        className="flex shrink-0 items-center border-b border-border"
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
                  className="ml-1 shrink-0"
                />
              }
            >
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
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
                    <Badge className="h-4 min-w-4 shrink-0 rounded-full px-1 text-xs">
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </Badge>
                  )}
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className={cn(
                      "size-3.5 shrink-0",
                      tab.id !== activeTabId && "invisible"
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
          className="flex min-w-0 [scrollbar-width:none] items-center gap-1 overflow-x-auto p-1 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId
            const closable = onTabClose != null && !tab.pinned
            return (
              <React.Fragment key={tab.id}>
                {/* Drop indicator shown when dragging over this strip position */}
                {tabDropInsertIndex === index && <TabDropIndicator />}

                <div
                  role="presentation"
                  className="group relative flex max-w-[180px] min-w-0 shrink-0"
                >
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
                      // Close from the tab itself: the close button is out of the
                      // tab order (tabIndex -1), so this is the keyboard path.
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
                      buttonVariants({
                        variant: isActive ? "secondary" : "ghost",
                      }),
                      "w-full min-w-0 justify-start",
                      // The close button is a sibling, so hovering it ends the
                      // tab's own :hover — repeat the variants' hover on the wrapper.
                      isActive
                        ? "group-hover:bg-secondary/80"
                        : "group-hover:bg-muted group-hover:text-foreground dark:group-hover:bg-muted/50",
                      // ! beats buttonVariants' px-2.5; reserves room for the close button
                      closable && "pe-8!"
                    )}
                  >
                    {/* Favicon / icon */}
                    {tab.icon != null && (
                      <span className="flex shrink-0 [&_svg]:size-[14px]">
                        {tab.icon}
                      </span>
                    )}

                    <span className="min-w-0 truncate text-left">
                      {tab.title}
                    </span>

                    {/* Unread badge */}
                    {tab.badge != null && tab.badge > 0 && (
                      <Badge className="h-4 min-w-4 shrink-0 rounded-full px-1 text-xs">
                        {tab.badge > 99 ? "99+" : tab.badge}
                      </Badge>
                    )}
                  </Tabs.Tab>
                  {/* Close button — a sibling of the tab, not a child: a button
                      nested inside the tab's button is invalid interactive
                      content. Out of the tab order (tabIndex -1) because the
                      focused tab already closes on Delete/Backspace. */}
                  {closable && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      tabIndex={-1}
                      aria-label={
                        tab.dirty
                          ? `Close ${tab.title} (unsaved changes)`
                          : `Close ${tab.title}`
                      }
                      onClick={() => onTabClose(tab.id)}
                      className={cn(
                        "absolute end-0.5 top-0.5 opacity-60 group-hover:opacity-100",
                        // Ghost's hover (bg-muted) matches the hovered tab behind it.
                        "hover:bg-foreground/10 dark:hover:bg-foreground/15",
                        // A dirty tab always shows its dot, even unhovered/inactive.
                        tab.dirty && "opacity-100"
                      )}
                    >
                      {tab.dirty ? (
                        <>
                          <span
                            aria-hidden
                            className="size-2 rounded-full bg-current group-hover:hidden"
                          />
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            strokeWidth={2}
                            className="hidden group-hover:block"
                          />
                        </>
                      ) : (
                        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                      )}
                    </Button>
                  )}
                </div>
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
            className="mx-1 shrink-0"
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
        )}
      </div>

      {/* ── Content area ── */}
      {/* Single panel: value always matches the active tab, so it's always shown.
          Base UI wires role="tabpanel" + aria-labelledby to the active tab. */}
      <Tabs.Panel value={activeTabId} className="min-h-0 flex-1 overflow-auto">
        {children}
      </Tabs.Panel>
    </Tabs.Root>
  )
}

export { WorkspaceTabs }
