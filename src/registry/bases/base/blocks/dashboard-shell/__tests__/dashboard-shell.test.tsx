import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeAll } from "vitest"

import { DashboardShell } from "../page"

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

describe("DashboardShell block", () => {
  it("opens with the Active Tab, Files, and Terminal tabs, showing the Home placeholder", () => {
    render(<DashboardShell />)
    expect(screen.getByRole("tab", { name: "Active Tab" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Files" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Terminal" })).toBeInTheDocument()
    expect(screen.getByText("Home", { selector: "p" })).toBeInTheDocument()
  })

  it("opens a new tab when a sidebar nav item is clicked", async () => {
    const user = userEvent.setup()
    render(<DashboardShell />)

    await user.click(screen.getByRole("button", { name: "Analytics" }))

    expect(
      screen.getByRole("heading", { level: 1, name: "Analytics" })
    ).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Analytics" })).toBeInTheDocument()
  })

  it("opens a new tab for a Documents section item", async () => {
    const user = userEvent.setup()
    render(<DashboardShell />)

    await user.click(screen.getByRole("button", { name: "Data Library" }))

    expect(
      screen.getByRole("heading", { level: 1, name: "Data Library" })
    ).toBeInTheDocument()
  })

  it("renders the sidebar toggle above the workspace tabs", () => {
    render(<DashboardShell />)
    expect(
      screen.getByRole("button", { name: /toggle sidebar/i })
    ).toBeInTheDocument()
  })

  it("opens the user menu with account actions", async () => {
    const user = userEvent.setup()
    render(<DashboardShell />)

    await user.click(screen.getByText("shadcn"))
    expect(
      await screen.findByRole("menuitem", { name: /log out/i })
    ).toBeInTheDocument()
  })
})
