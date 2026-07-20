import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeAll } from "vitest"

import { DashboardRail } from "../page"

// ui/sidebar's useIsMobile reads window.matchMedia; jsdom does not ship it.
beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
})

describe("DashboardRail block", () => {
  it("renders the app rail and nav sidebar alongside the Dashboard tab", () => {
    render(<DashboardRail />)
    expect(screen.getByRole("heading", { level: 2, name: "Dashboard" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Workspace" })).toBeInTheDocument()
  })

  it("opens a new tab when a nav sidebar item is clicked", async () => {
    const user = userEvent.setup()
    render(<DashboardRail />)

    await user.click(screen.getByRole("button", { name: "Analytics" }))
    expect(screen.getByText("Analytics", { selector: "p" })).toBeInTheDocument()
  })

  it("renders a single mobile-only sidebar trigger in the content header", () => {
    render(<DashboardRail />)
    expect(screen.getByRole("button", { name: /toggle sidebar/i })).toBeInTheDocument()
  })

  it("toggles the outer sidebar's collapsed state via the app rail icon", async () => {
    const user = userEvent.setup()
    const { container } = render(<DashboardRail />)
    const outerSidebar = container.querySelector('[data-slot="sidebar"]')

    expect(outerSidebar).toHaveAttribute("data-state", "expanded")
    await user.click(screen.getByRole("button", { name: "Workspace" }))
    expect(outerSidebar).toHaveAttribute("data-state", "collapsed")
    await user.click(screen.getByRole("button", { name: "Workspace" }))
    expect(outerSidebar).toHaveAttribute("data-state", "expanded")
  })

  it("switches the nav sidebar to the Email app's menu and opens its Inbox tab", async () => {
    const user = userEvent.setup()
    render(<DashboardRail />)

    await user.click(screen.getByRole("button", { name: "Email" }))
    expect(screen.getByRole("button", { name: "Sent" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Analytics" })).not.toBeInTheDocument()
    expect(screen.getByText("Inbox", { selector: "p" })).toBeInTheDocument()
  })
})
