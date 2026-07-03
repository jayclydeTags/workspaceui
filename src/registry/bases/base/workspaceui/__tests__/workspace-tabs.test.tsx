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

  describe("drag wiring", () => {
    // Guards the Base UI <Tabs.Tab> swap: the drag onPointerDown must still
    // reach startDrag. Base UI owns the button, so this proves it forwards
    // our handler rather than swallowing it.
    function dragCtx(startDrag: WorkspaceDragContextValue["startDrag"]) {
      return {
        isDragging: false,
        snapState: null,
        tabDropTarget: null,
        registerPane: vi.fn(),
        registerTabStrip: vi.fn(),
        startDrag,
        setLastActivePane: vi.fn(),
      } satisfies WorkspaceDragContextValue
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
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
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
})
