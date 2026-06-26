import * as React from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

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
})
