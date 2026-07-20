import * as React from "react"
import { render, screen, act, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest"

import {
  Workspace,
  useWorkspace,
  type WorkspaceHandle,
  type WorkspacePaneDef,
} from "../workspace"

// ── Helpers ────────────────────────────────────────────────────────────────

const pane = (id: string, tabs: string[], extra?: Partial<WorkspacePaneDef>): WorkspacePaneDef => ({
  id,
  tabs: tabs.map((t) => ({ id: t, title: t })),
  defaultActiveTabId: tabs[0],
  defaultSize: 100,
  minSize: 30,
  ...extra,
})

const renderContent = (_paneId: string, tabId: string) => (
  <div data-testid={`content-${tabId}`}>Content: {tabId}</div>
)

function renderWorkspace(
  initialPanes: WorkspacePaneDef[],
  ref?: React.RefObject<WorkspaceHandle | null>,
  extra?: Partial<React.ComponentProps<typeof Workspace>>,
) {
  return render(
    <Workspace
      ref={ref}
      initialPanes={initialPanes}
      renderTabContent={renderContent}
      {...extra}
    />,
  )
}

/**
 * jsdom gives every element a 0×0 box at (0, 0). One pane's worth of UI still
 * works, but as soon as two panes are on screen userEvent can no longer decide
 * what a click landed on and silently drops it — which is why anything needing
 * a menu in a multi-pane workspace has to run under this.
 *
 * Hands out one stable, distinct box per element. Per-element `mockRect` spies
 * still win: those set an own property, and this only replaces the prototype.
 * Returns a restore function; not global, since the drag tests below depend on
 * unmocked elements reading as 0×0.
 */
function stubLayout() {
  const original = Element.prototype.getBoundingClientRect
  const boxes = new WeakMap<Element, DOMRect>()
  let seen = 0
  Element.prototype.getBoundingClientRect = function () {
    let box = boxes.get(this)
    if (!box) {
      const top = seen++ * 20
      box = {
        x: 0, y: top, left: 0, top, right: 200, bottom: top + 20,
        width: 200, height: 20,
        toJSON: () => ({}),
      } as DOMRect
      boxes.set(this, box)
    }
    return box
  }
  return () => {
    Element.prototype.getBoundingClientRect = original
  }
}

// ── Drag helpers ───────────────────────────────────────────────────────────

function mockRect(el: Element, r: Partial<Omit<DOMRect, "toJSON">>) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0,
    toJSON: () => {},
    ...r,
  } as DOMRect)
}

function dragStart(tab: HTMLElement, from = { x: 10, y: 20 }) {
  fireEvent.pointerDown(tab, { pointerId: 1, clientX: from.x, clientY: from.y, bubbles: true })
}

function dragMove(to: { x: number; y: number }) {
  document.dispatchEvent(new PointerEvent("pointermove", { clientX: to.x, clientY: to.y, bubbles: true }))
}

function dragDrop() {
  document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))
}

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("Workspace", () => {
  describe("initial rendering", () => {
    it("renders tabs from the initial pane configuration", () => {
      renderWorkspace([pane("main", ["dashboard", "inbox"])])
      expect(screen.getByRole("tab", { name: "dashboard" })).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: "inbox" })).toBeInTheDocument()
    })

    it("activates the defaultActiveTabId tab", () => {
      renderWorkspace([pane("main", ["dashboard", "inbox"], { defaultActiveTabId: "inbox" })])
      expect(screen.getByRole("tab", { name: "inbox" })).toHaveAttribute("aria-selected", "true")
      expect(screen.getByRole("tab", { name: "dashboard" })).toHaveAttribute("aria-selected", "false")
    })

    it("renders the active tab's content", () => {
      renderWorkspace([pane("main", ["dashboard", "inbox"])])
      expect(screen.getByTestId("content-dashboard")).toBeInTheDocument()
    })

    it("shows the fallback when initialPanes is empty", () => {
      renderWorkspace([])
      expect(screen.getByText("No open panels")).toBeInTheDocument()
    })

    it("renders a custom fallback when provided", () => {
      renderWorkspace([], undefined, { fallback: <p>Custom empty state</p> })
      expect(screen.getByText("Custom empty state")).toBeInTheDocument()
    })
  })

  describe("tab activation (click)", () => {
    it("switches to the clicked tab", async () => {
      renderWorkspace([pane("main", ["dashboard", "inbox"])])
      await userEvent.click(screen.getByRole("tab", { name: "inbox" }))
      expect(screen.getByRole("tab", { name: "inbox" })).toHaveAttribute("aria-selected", "true")
      expect(screen.getByTestId("content-inbox")).toBeInTheDocument()
    })
  })

  describe("tab close (click)", () => {
    it("removes the closed tab from the strip", async () => {
      renderWorkspace([pane("main", ["dashboard", "inbox"])])
      await userEvent.click(screen.getByRole("button", { name: "Close inbox" }))
      expect(screen.queryByRole("tab", { name: "inbox" })).not.toBeInTheDocument()
    })

    it("activates the previous tab when the active tab is closed", async () => {
      renderWorkspace([
        pane("main", ["a", "b", "c"], { defaultActiveTabId: "b" }),
      ])
      await userEvent.click(screen.getByRole("button", { name: "Close b" }))
      expect(screen.getByRole("tab", { name: "a" })).toHaveAttribute("aria-selected", "true")
    })

    it("activates the next tab when the first tab is closed", async () => {
      renderWorkspace([
        pane("main", ["a", "b"], { defaultActiveTabId: "a" }),
      ])
      await userEvent.click(screen.getByRole("button", { name: "Close a" }))
      expect(screen.getByRole("tab", { name: "b" })).toHaveAttribute("aria-selected", "true")
    })

    it("shows the fallback when the last tab in the last pane is closed", async () => {
      renderWorkspace([pane("main", ["only"])])
      await userEvent.click(screen.getByRole("button", { name: "Close only" }))
      expect(screen.getByText("No open panels")).toBeInTheDocument()
    })
  })

  describe("pinned tabs", () => {
    it("does not render a close button for pinned tabs", () => {
      renderWorkspace([
        pane("main", ["pinned", "normal"], {
          tabs: [
            { id: "pinned", title: "pinned", pinned: true },
            { id: "normal", title: "normal" },
          ],
        }),
      ])
      expect(screen.queryByRole("button", { name: "Close pinned" })).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Close normal" })).toBeInTheDocument()
    })

    it("does not remove a pinned tab when closeTab is called via ref", () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([
        pane("main", ["pinned", "normal"], {
          tabs: [
            { id: "pinned", title: "pinned", pinned: true },
            { id: "normal", title: "normal" },
          ],
        }),
      ], ref)
      ref.current?.closeTab("main", "pinned")
      expect(screen.getByRole("tab", { name: "pinned" })).toBeInTheDocument()
    })
  })

  describe("WorkspaceHandle (imperative API)", () => {
    it("openTabInPane adds a new tab and activates it", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("main", ["a"])], ref)
      await React.act(async () => {
        ref.current?.openTabInPane("main", { id: "b", title: "Beta" })
      })
      expect(screen.getByRole("tab", { name: "Beta" })).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true")
    })

    it("openTabInPane does not duplicate an already-open tab", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("main", ["a", "b"])], ref)
      await React.act(async () => {
        ref.current?.openTabInPane("main", { id: "b", title: "b" })
      })
      expect(screen.getAllByRole("tab", { name: "b" })).toHaveLength(1)
    })

    it("activateTab switches the active tab", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("main", ["a", "b"])], ref)
      await React.act(async () => {
        ref.current?.activateTab("main", "b")
      })
      expect(screen.getByRole("tab", { name: "b" })).toHaveAttribute("aria-selected", "true")
    })

    it("updateTab changes a tab's title", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("main", ["a"])], ref)
      await React.act(async () => {
        ref.current?.updateTab("main", "a", { title: "Renamed" })
      })
      expect(screen.getByRole("tab", { name: "Renamed" })).toBeInTheDocument()
      expect(screen.queryByRole("tab", { name: "a" })).not.toBeInTheDocument()
    })

    it("closeTab removes the tab", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("main", ["a", "b"])], ref)
      await React.act(async () => {
        ref.current?.closeTab("main", "b")
      })
      expect(screen.queryByRole("tab", { name: "b" })).not.toBeInTheDocument()
    })

    it("closePane removes all tabs for that pane and shows fallback when it was the only pane", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("main", ["a", "b"])], ref)
      await React.act(async () => {
        ref.current?.closePane("main")
      })
      expect(screen.getByText("No open panels")).toBeInTheDocument()
    })

    it("lastActivePaneId is set to the first pane on mount", () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("main", ["a"])], ref)
      expect(ref.current?.lastActivePaneId).toBe("main")
    })
  })

  describe("useWorkspace hook", () => {
    it("throws when used outside <Workspace>", () => {
      const BadComponent = () => {
        useWorkspace()
        return null
      }
      expect(() =>
        render(<BadComponent />),
      ).toThrow("useWorkspace must be used inside <Workspace>")
    })

    it("exposes the current panes list", () => {
      let captured: ReturnType<typeof useWorkspace> | null = null
      const Inspector = () => {
        captured = useWorkspace()
        return <div>tab content</div>
      }
      render(
        <Workspace
          initialPanes={[pane("main", ["a", "b"])]}
          renderTabContent={() => <Inspector />}
        />,
      )
      expect(captured!.panes).toHaveLength(1)
      expect(captured!.panes[0]!.id).toBe("main")
    })

    it("isShowingFallback is true when there are no panes", () => {
      let captured: ReturnType<typeof useWorkspace> | null = null
      const FallbackInspector = () => {
        captured = useWorkspace()
        return <p>empty</p>
      }
      render(
        <Workspace
          initialPanes={[]}
          renderTabContent={renderContent}
          fallback={<FallbackInspector />}
        />,
      )
      expect(captured!.isShowingFallback).toBe(true)
    })
  })

  describe("multi-pane layout", () => {
    it("renders tabs from both panes simultaneously", () => {
      renderWorkspace([
        pane("left", ["a"]),
        pane("right", ["b"]),
      ])
      expect(screen.getByRole("tab", { name: "a" })).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: "b" })).toBeInTheDocument()
    })

    it("shows fallback after both panes are independently closed via ref", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("left", ["a"]), pane("right", ["b"])], ref)
      await React.act(async () => {
        ref.current?.closePane("left")
        ref.current?.closePane("right")
      })
      expect(screen.getByText("No open panels")).toBeInTheDocument()
    })
  })

  describe("drag and drop", () => {
    // jsdom defaults window.innerWidth/innerHeight to 0, which makes the
    // snap-zone visible-width calculation produce a negative snapSize and
    // silently skips all zones.
    beforeAll(() => {
      vi.stubGlobal("innerWidth", 1024)
      vi.stubGlobal("innerHeight", 768)
    })
    afterAll(() => vi.unstubAllGlobals())
    afterEach(() => vi.restoreAllMocks())

    it("TC-TAB-2: reorders tabs within the same pane", async () => {
      renderWorkspace([pane("p1", ["a", "b", "c"])])

      const tabStrip = document.querySelector('[data-slot="workspace-tab-list"]')!
      const tabs = screen.getAllByRole("tab")

      mockRect(tabStrip, { left: 0, top: 0, right: 450, bottom: 40 })
      mockRect(tabs[0]!, { left: 0,   top: 0, right: 150, bottom: 40, width: 150 }) // "a"
      mockRect(tabs[1]!, { left: 150, top: 0, right: 300, bottom: 40, width: 150 }) // "b"
      mockRect(tabs[2]!, { left: 300, top: 0, right: 450, bottom: 40, width: 150 }) // "c"

      await act(async () => {
        dragStart(tabs[0]!)           // grab "a" at x=10
        dragMove({ x: 15, y: 20 })   // cross 4 px threshold
        dragMove({ x: 320, y: 20 })  // left of "c" midpoint (375) → insertIndex 2
        dragDrop()
      })

      expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["b", "a", "c"])
    })

    it("TC-TAB-3: moves a tab from one pane into another pane's tab strip", async () => {
      renderWorkspace([pane("left", ["a"]), pane("right", ["b"])])

      const tabStrips = document.querySelectorAll('[data-slot="workspace-tab-list"]')
      const tabs = screen.getAllByRole("tab")

      mockRect(tabStrips[0]!, { left: 0,   top: 0, right: 300, bottom: 40 })
      mockRect(tabStrips[1]!, { left: 300, top: 0, right: 600, bottom: 40 })
      mockRect(tabs[1]!, { left: 300, top: 0, right: 500, bottom: 40, width: 200 }) // "b" midpoint=400

      await act(async () => {
        dragStart(tabs[0]!)           // grab "a" from left pane
        dragMove({ x: 15, y: 20 })   // cross threshold
        dragMove({ x: 350, y: 20 })  // inside right strip, left of "b" midpoint → insertIndex 0
        dragDrop()
      })

      const after = screen.getAllByRole("tab")
      expect(after[0]).toHaveTextContent("a")
      expect(after[1]).toHaveTextContent("b")
    })

    it("TC-TAB-5: dragging the last tab out of a pane removes that pane", async () => {
      renderWorkspace([pane("left", ["a"]), pane("right", ["b"])])

      const tabStrips = document.querySelectorAll('[data-slot="workspace-tab-list"]')
      const tabs = screen.getAllByRole("tab")

      mockRect(tabStrips[0]!, { left: 0,   top: 0, right: 300, bottom: 40 })
      mockRect(tabStrips[1]!, { left: 300, top: 0, right: 600, bottom: 40 })
      mockRect(tabs[1]!, { left: 300, top: 0, right: 500, bottom: 40, width: 200 })

      await act(async () => {
        dragStart(tabs[0]!)
        dragMove({ x: 15, y: 20 })
        dragMove({ x: 350, y: 20 })
        dragDrop()
      })

      expect(screen.getAllByRole("tablist")).toHaveLength(1)
    })

    it("TC-TAB-4: dragging to a snap zone creates a new pane", async () => {
      renderWorkspace([pane("left", ["a", "b"]), pane("right", ["c"])])

      const paneWrappers = document.querySelectorAll('[data-slot="workspace-tabs"]')
      const rightWrapper = paneWrappers[1]!.parentElement!
      const tabs = screen.getAllByRole("tab") // "a", "b", "c"

      // Right pane wrapper x 300–600, y 0–600; tab strips stay at default (0,0,0,0)
      // so y=300 won't match any strip and snap-zone detection runs.
      mockRect(rightWrapper, { left: 300, top: 0, right: 600, bottom: 600 })

      await act(async () => {
        dragStart(tabs[0]!)            // grab "a" from left pane
        dragMove({ x: 15, y: 20 })    // cross threshold
        // x=305 is 5 px inside right pane's left edge; snapSize=75 → zone "left"
        dragMove({ x: 305, y: 300 })  // y=300 clears all tab strips (y 0–40)
        dragDrop()
      })

      // Three panes: left (["b"]), new pane (["a"]), right (["c"])
      expect(screen.getAllByRole("tablist")).toHaveLength(3)
      expect(screen.getByRole("tab", { name: "a" })).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: "b" })).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: "c" })).toBeInTheDocument()
    })

    it("TC-TAB-6: pressing Escape mid-drag cancels without changing the layout", async () => {
      renderWorkspace([pane("p1", ["a", "b"])])

      const tabs = screen.getAllByRole("tab")

      await act(async () => {
        dragStart(tabs[0]!)
        dragMove({ x: 15, y: 20 })
        pressEscape()
      })

      const after = screen.getAllByRole("tab")
      expect(after).toHaveLength(2)
      expect(after[0]).toHaveTextContent("a")
      expect(after[1]).toHaveTextContent("b")
    })
  })

  describe("onBeforeCloseTab", () => {
    it("keeps the tab open when the guard vetoes", async () => {
      const user = userEvent.setup()
      const onBeforeCloseTab = vi.fn().mockResolvedValue(false)
      renderWorkspace([pane("p1", ["a", "b"])], undefined, { onBeforeCloseTab })

      await user.click(screen.getByRole("button", { name: "Close a" }))

      expect(onBeforeCloseTab).toHaveBeenCalledWith("p1", "a", expect.objectContaining({ id: "a" }))
      expect(screen.getByRole("tab", { name: /a/ })).toBeInTheDocument()
    })

    it("closes the tab when the guard allows", async () => {
      const user = userEvent.setup()
      renderWorkspace([pane("p1", ["a", "b"])], undefined, {
        onBeforeCloseTab: () => true,
      })

      await user.click(screen.getByRole("button", { name: "Close a" }))

      expect(screen.queryByRole("tab", { name: /a/ })).not.toBeInTheDocument()
    })

    it("aborts a pane close when any one of its tabs vetoes", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      // Only the second tab is dirty — the pane must survive regardless.
      const onBeforeCloseTab = (_p: string, tabId: string) => tabId !== "b"
      renderWorkspace([pane("p1", ["a", "b"])], ref, { onBeforeCloseTab })

      await act(async () => {
        await ref.current!.closePane("p1")
      })

      expect(screen.getByRole("tab", { name: /a/ })).toBeInTheDocument()
    })

    it("guards pinned tabs on pane close, though they resist individual close", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      const onBeforeCloseTab = vi.fn().mockReturnValue(true)
      renderWorkspace(
        [{ id: "p1", tabs: [{ id: "a", title: "a", pinned: true }] }],
        ref,
        { onBeforeCloseTab },
      )

      await act(async () => {
        await ref.current!.closePane("p1")
      })

      expect(onBeforeCloseTab).toHaveBeenCalledWith("p1", "a", expect.objectContaining({ id: "a" }))
      expect(screen.queryByRole("tab", { name: /a/ })).not.toBeInTheDocument()
    })
  })

  describe("serialize / restore", () => {
    const resolve = (id: string) => ({ id, title: id })

    it("round-trips columns, tabs, and the active tab", async () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("p1", ["a", "b"]), pane("p2", ["c"])], ref)

      act(() => ref.current!.activateTab("p1", "b"))
      const snapshot = ref.current!.serialize()

      expect(snapshot.columns).toHaveLength(2)
      expect(snapshot.columns[0]!.topPane).toEqual({
        id: "p1",
        tabIds: ["a", "b"],
        activeTabId: "b",
      })

      // Mutate away from the snapshot, then restore it.
      await act(async () => {
        await ref.current!.closePane("p2")
      })
      act(() => ref.current!.restore(snapshot, resolve))

      expect(ref.current!.serialize()).toEqual(snapshot)
      expect(screen.getByTestId("content-b")).toBeInTheDocument()
    })

    it("drops unresolvable tabs and the panes they empty", () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("p1", ["a"]), pane("p2", ["gone"])], ref)

      const snapshot = ref.current!.serialize()
      act(() => ref.current!.restore(snapshot, (id) => (id === "gone" ? undefined : resolve(id))))

      const after = ref.current!.serialize()
      expect(after.columns).toHaveLength(1)
      expect(after.columns[0]!.topPane.id).toBe("p1")
    })

    it("falls back to the first tab when the active one no longer resolves", () => {
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("p1", ["a", "b"])], ref)

      act(() => ref.current!.activateTab("p1", "b"))
      const snapshot = ref.current!.serialize()
      act(() => ref.current!.restore(snapshot, (id) => (id === "b" ? undefined : resolve(id))))

      expect(ref.current!.serialize().columns[0]!.topPane).toEqual({
        id: "p1",
        tabIds: ["a"],
        activeTabId: "a",
      })
    })
  })
  describe("keyboard rearrange and announcements", () => {
    // The split/move gestures were pointer-only, and rearranging panes is
    // silent to a screen reader — the menu is the keyboard path, the live
    // region is what reports the result.
    it("splits a pane from the tab menu and announces it", async () => {
      const user = userEvent.setup()
      const ref = React.createRef<WorkspaceHandle>()
      renderWorkspace([pane("p1", ["a", "b"])], ref)

      await user.click(screen.getByRole("button", { name: "Tab menu" }))
      await user.click(await screen.findByRole("menuitem", { name: "Split right" }))

      expect(ref.current!.serialize().columns).toHaveLength(2)
      expect(screen.getByRole("status")).toHaveTextContent("Moved a to a new column.")
    })

    it("moves a tab into another pane from the tab menu and announces it", async () => {
      const restoreLayout = stubLayout()
      try {
        const user = userEvent.setup()
        const ref = React.createRef<WorkspaceHandle>()
        renderWorkspace([pane("p1", ["a", "b"]), pane("p2", ["c"])], ref)

        // Panes have no name of their own — they are labelled by their active tab.
        await user.click(screen.getAllByRole("button", { name: "Tab menu" })[0]!)
        await user.click(await screen.findByRole("menuitem", { name: "Move to c" }))

        const columns = ref.current!.serialize().columns
        expect(columns).toHaveLength(2)
        expect(columns[1]!.topPane.tabIds).toEqual(["c", "a"])
        expect(screen.getByRole("status")).toHaveTextContent("Moved a to c.")
      } finally {
        restoreLayout()
      }
    })

  })
})
