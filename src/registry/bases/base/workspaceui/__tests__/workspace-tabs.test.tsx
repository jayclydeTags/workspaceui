import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { WorkspaceTabs } from "../workspace-tabs"
import {
  WorkspaceDragContext,
  type WorkspaceDragContextValue,
} from "../workspace-context"

const tab = (id: string, title: string, extra?: object) => ({
  id,
  title,
  ...extra,
})

/** A drag context with everything stubbed; override just what a test asserts on. */
function makeDragCtx(
  overrides: Partial<WorkspaceDragContextValue> = {},
): WorkspaceDragContextValue {
  return {
    isDragging: false,
    snapState: null,
    tabDropTarget: null,
    registerPane: vi.fn(),
    registerTabStrip: vi.fn(),
    startDrag: vi.fn(),
    setLastActivePane: vi.fn(),
    paneTargets: [],
    splitTab: vi.fn(),
    moveTab: vi.fn(),
    ...overrides,
  }
}

function renderTabs(
  overrides: Partial<React.ComponentProps<typeof WorkspaceTabs>> = {},
) {
  const props: React.ComponentProps<typeof WorkspaceTabs> = {
    tabs: [tab("a", "Alpha"), tab("b", "Beta")],
    activeTabId: "a",
    onTabChange: vi.fn(),
    children: <div>content</div>,
    ...overrides,
  }
  return { ...render(<WorkspaceTabs {...props} />), props }
}

describe("WorkspaceTabs", () => {
  describe("rendering", () => {
    it("renders all tab titles", () => {
      renderTabs()
      expect(screen.getByRole("tab", { name: "Alpha" })).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: "Beta" })).toBeInTheDocument()
    })

    it("marks the active tab as selected", () => {
      renderTabs({ activeTabId: "b" })
      expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute(
        "aria-selected",
        "true",
      )
      expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute(
        "aria-selected",
        "false",
      )
    })

    it("renders children in the tabpanel", () => {
      renderTabs({ children: <p>Hello panel</p> })
      expect(
        screen.getByRole("tabpanel").querySelector("p"),
      ).toHaveTextContent("Hello panel")
    })

    it("connects tabpanel aria-labelledby to the active tab id", () => {
      renderTabs({ activeTabId: "a" })
      const panel = screen.getByRole("tabpanel")
      expect(panel.getAttribute("aria-labelledby")).toBe("workspace-tab-a")
    })
  })

  describe("badge", () => {
    it("renders badge count when badge > 0", () => {
      renderTabs({
        tabs: [tab("a", "Alpha", { badge: 5 }), tab("b", "Beta")],
      })
      expect(screen.getByText("5")).toBeInTheDocument()
    })

    it("caps badge at 99+", () => {
      renderTabs({
        tabs: [tab("a", "Alpha", { badge: 120 }), tab("b", "Beta")],
      })
      expect(screen.getByText("99+")).toBeInTheDocument()
    })

    it("does not render badge when badge is 0", () => {
      renderTabs({
        tabs: [tab("a", "Alpha", { badge: 0 }), tab("b", "Beta")],
      })
      expect(screen.queryByText("0")).not.toBeInTheDocument()
    })
  })

  describe("tab activation", () => {
    it("calls onTabChange with the clicked tab id", async () => {
      const onTabChange = vi.fn()
      renderTabs({ onTabChange })
      await userEvent.click(screen.getByRole("tab", { name: "Beta" }))
      expect(onTabChange).toHaveBeenCalledWith("b")
    })

    it("does not call onTabChange for the already-active tab", async () => {
      const onTabChange = vi.fn()
      renderTabs({ activeTabId: "a", onTabChange })
      await userEvent.click(screen.getByRole("tab", { name: "Alpha" }))
      // Base UI Tabs only fires onValueChange on an actual change — clicking
      // the already-active tab is a no-op.
      expect(onTabChange).not.toHaveBeenCalled()
    })
  })

  describe("close button", () => {
    it("does not render close buttons when onTabClose is omitted", () => {
      renderTabs()
      expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument()
    })

    it("renders close buttons when onTabClose is provided", () => {
      renderTabs({ onTabClose: vi.fn() })
      expect(screen.getAllByRole("button", { name: /close/i })).toHaveLength(2)
    })

    it("calls onTabClose with the correct tab id", async () => {
      const onTabClose = vi.fn()
      renderTabs({ onTabClose })
      await userEvent.click(
        screen.getByRole("button", { name: "Close Alpha" }),
      )
      expect(onTabClose).toHaveBeenCalledWith("a")
    })
  })

  describe("pinned tabs", () => {
    it("does not render a close button for pinned tabs even when onTabClose is provided", () => {
      renderTabs({
        tabs: [tab("a", "Alpha", { pinned: true }), tab("b", "Beta")],
        onTabClose: vi.fn(),
      })
      expect(screen.queryByRole("button", { name: "Close Alpha" })).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Close Beta" })).toBeInTheDocument()
    })
  })

  describe("add-tab button", () => {
    it("renders the add button when onAddTab is provided", () => {
      renderTabs({ onAddTab: vi.fn() })
      expect(screen.getByRole("button", { name: "New tab" })).toBeInTheDocument()
    })

    it("does not render the add button when onAddTab is omitted", () => {
      renderTabs()
      expect(screen.queryByRole("button", { name: "New tab" })).not.toBeInTheDocument()
    })

    it("calls onAddTab when the add button is clicked", async () => {
      const onAddTab = vi.fn()
      renderTabs({ onAddTab })
      await userEvent.click(screen.getByRole("button", { name: "New tab" }))
      expect(onAddTab).toHaveBeenCalledTimes(1)
    })
  })

  describe("tab-search dropdown", () => {
    it("lists every open tab and activates the one clicked", async () => {
      const onTabChange = vi.fn()
      renderTabs({ onTabChange })

      await userEvent.click(screen.getByRole("button", { name: "Tab menu" }))

      const items = await screen.findAllByRole("menuitem")
      expect(items.map((i) => i.textContent)).toEqual(["Alpha", "Beta"])

      await userEvent.click(items[1])
      expect(onTabChange).toHaveBeenCalledWith("b")
    })

    it("is not rendered when there are no tabs", () => {
      renderTabs({ tabs: [], activeTabId: "" })
      expect(
        screen.queryByRole("button", { name: "Tab menu" }),
      ).not.toBeInTheDocument()
    })
  })

  describe("keyboard rearrange menu", () => {
    // Split and move used to be drag-only. These cover the keyboard route.
    function renderWithCtx(
      ctx: WorkspaceDragContextValue,
      props: Partial<React.ComponentProps<typeof WorkspaceTabs>> = {},
    ) {
      return render(
        <WorkspaceDragContext.Provider value={ctx}>
          <WorkspaceTabs
            tabs={[tab("a", "Alpha"), tab("b", "Beta")]}
            activeTabId="a"
            onTabChange={vi.fn()}
            paneId="pane-1"
            {...props}
          >
            <div>content</div>
          </WorkspaceTabs>
        </WorkspaceDragContext.Provider>,
      )
    }

    it("splits the active tab from the menu", async () => {
      const splitTab = vi.fn()
      renderWithCtx(makeDragCtx({ splitTab }))

      await userEvent.click(screen.getByRole("button", { name: "Tab menu" }))
      await userEvent.click(await screen.findByRole("menuitem", { name: "Split down" }))

      expect(splitTab).toHaveBeenCalledWith("pane-1", "a", "bottom")
    })

    it("moves the active tab to another pane, offering every pane but its own", async () => {
      const moveTab = vi.fn()
      renderWithCtx(
        makeDragCtx({
          moveTab,
          paneTargets: [
            { id: "pane-1", label: "Alpha" },
            { id: "pane-2", label: "Gamma" },
          ],
        }),
      )

      await userEvent.click(screen.getByRole("button", { name: "Tab menu" }))

      // Its own pane is not offered as a move target.
      expect(
        screen.queryByRole("menuitem", { name: "Move to Alpha" }),
      ).not.toBeInTheDocument()
      await userEvent.click(
        await screen.findByRole("menuitem", { name: "Move to Gamma" }),
      )

      expect(moveTab).toHaveBeenCalledWith("pane-1", "a", "pane-2")
    })

    it("offers no split for a pane holding a single tab", async () => {
      renderWithCtx(makeDragCtx(), { tabs: [tab("a", "Alpha")] })

      await userEvent.click(screen.getByRole("button", { name: "Tab menu" }))
      await screen.findByRole("menuitem", { name: "Alpha" })
      expect(screen.queryByRole("menuitem", { name: "Split right" })).not.toBeInTheDocument()
    })

    it("offers no rearrange actions for a pinned active tab", async () => {
      renderWithCtx(makeDragCtx({ paneTargets: [{ id: "pane-2", label: "Gamma" }] }), {
        tabs: [tab("a", "Alpha", { pinned: true }), tab("b", "Beta")],
      })

      await userEvent.click(screen.getByRole("button", { name: "Tab menu" }))
      await screen.findByRole("menuitem", { name: "Beta" })
      expect(screen.queryByRole("menuitem", { name: "Split right" })).not.toBeInTheDocument()
      expect(screen.queryByRole("menuitem", { name: /^Move to/ })).not.toBeInTheDocument()
    })

    it("offers no rearrange actions outside a Workspace", async () => {
      renderTabs()
      await userEvent.click(screen.getByRole("button", { name: "Tab menu" }))
      await screen.findByRole("menuitem", { name: "Alpha" })
      expect(screen.queryByRole("menuitem", { name: "Split right" })).not.toBeInTheDocument()
    })
  })

  describe("drag wiring", () => {
    // Guards the Base UI <Tabs.Tab> swap: the drag onPointerDown must still
    // reach startDrag. Base UI owns the button, so this proves it forwards
    // our handler rather than swallowing it.
    function dragCtx(startDrag: WorkspaceDragContextValue["startDrag"]) {
      return makeDragCtx({ startDrag })
    }

    it("calls startDrag on pointer down when a paneId and drag context exist", async () => {
      const startDrag = vi.fn()
      render(
        <WorkspaceDragContext.Provider value={dragCtx(startDrag)}>
          <WorkspaceTabs
            tabs={[tab("a", "Alpha"), tab("b", "Beta")]}
            activeTabId="a"
            onTabChange={vi.fn()}
            paneId="pane-1"
          >
            <div>content</div>
          </WorkspaceTabs>
        </WorkspaceDragContext.Provider>,
      )
      await userEvent.pointer({
        keys: "[MouseLeft>]",
        target: screen.getByRole("tab", { name: "Beta" }),
      })
      expect(startDrag).toHaveBeenCalledWith(
        "pane-1",
        "b",
        "Beta",
        // The pointerdown event itself — startDrag owns the pointer capture.
        expect.objectContaining({ pointerId: expect.any(Number) }),
      )
    })

    it("does not start a drag for pinned tabs", async () => {
      const startDrag = vi.fn()
      render(
        <WorkspaceDragContext.Provider value={dragCtx(startDrag)}>
          <WorkspaceTabs
            tabs={[tab("a", "Alpha", { pinned: true })]}
            activeTabId="a"
            onTabChange={vi.fn()}
            paneId="pane-1"
          >
            <div>content</div>
          </WorkspaceTabs>
        </WorkspaceDragContext.Provider>,
      )
      await userEvent.pointer({
        keys: "[MouseLeft>]",
        target: screen.getByRole("tab", { name: "Alpha" }),
      })
      expect(startDrag).not.toHaveBeenCalled()
    })
  })

  describe("single tab edge case", () => {
    it("renders correctly with a single tab", () => {
      renderTabs({ tabs: [tab("only", "Only Tab")], activeTabId: "only" })
      expect(screen.getByRole("tab", { name: "Only Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      )
    })
  })

  describe("dirty tabs", () => {
    it("marks the close control as unsaved and still closes on click", async () => {
      const user = userEvent.setup()
      const onTabClose = vi.fn()
      renderTabs({
        tabs: [tab("a", "Alpha", { dirty: true }), tab("b", "Beta")],
        onTabClose,
      })

      const close = screen.getByRole("button", { name: "Close Alpha (unsaved changes)" })
      await user.click(close)
      expect(onTabClose).toHaveBeenCalledWith("a")

      // A clean tab keeps the plain label.
      expect(screen.getByRole("button", { name: "Close Beta" })).toBeInTheDocument()
    })

    it("renders no close control for a pinned tab, dirty or not", () => {
      renderTabs({
        tabs: [tab("a", "Alpha", { dirty: true, pinned: true })],
        onTabClose: vi.fn(),
      })
      expect(screen.queryByRole("button", { name: /Close Alpha/ })).not.toBeInTheDocument()
    })
  })

  describe("keyboard", () => {
    it("closes the focused tab on Delete and Backspace", async () => {
      const user = userEvent.setup()
      const onTabClose = vi.fn()
      renderTabs({ onTabClose })

      screen.getByRole("tab", { name: "Alpha" }).focus()
      await user.keyboard("{Delete}")
      expect(onTabClose).toHaveBeenCalledWith("a")

      onTabClose.mockClear()
      await user.keyboard("{Backspace}")
      expect(onTabClose).toHaveBeenCalledWith("a")
    })

    it("does not close a pinned tab on Delete", async () => {
      const user = userEvent.setup()
      const onTabClose = vi.fn()
      renderTabs({ tabs: [tab("a", "Alpha", { pinned: true })], onTabClose })

      screen.getByRole("tab", { name: "Alpha" }).focus()
      await user.keyboard("{Delete}")
      expect(onTabClose).not.toHaveBeenCalled()
    })

    it("focuses the tab on pointerdown so roving focus engages", async () => {
      const user = userEvent.setup()
      const dragCtx = makeDragCtx()

      render(
        <WorkspaceDragContext.Provider value={dragCtx}>
          <WorkspaceTabs
            tabs={[tab("a", "Alpha"), tab("b", "Beta")]}
            activeTabId="a"
            onTabChange={vi.fn()}
            paneId="pane-1"
          >
            <div>content</div>
          </WorkspaceTabs>
        </WorkspaceDragContext.Provider>,
      )

      // pointerdown preventDefault()s (to suppress selection during a drag),
      // which would otherwise swallow the focus the tab needs.
      await user.click(screen.getByRole("tab", { name: "Alpha" }))
      expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus()
    })
  })
})
