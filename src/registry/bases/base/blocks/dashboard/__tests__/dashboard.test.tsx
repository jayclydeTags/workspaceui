import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeAll } from "vitest"

import { Dashboard } from "../page"

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

describe("Dashboard block", () => {
  it("opens with the Dashboard tab rendered inside the Page component", () => {
    render(<Dashboard />)
    // The Page header renders the title as an <h1>; DashboardContent passes "Dashboard".
    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Overview of your workspace")).toBeInTheDocument()
  })

  it("opens a new tab when a sidebar nav item is clicked", async () => {
    const user = userEvent.setup()
    render(<Dashboard />)

    expect(screen.queryByText("Overview of your workspace")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Analytics" }))

    // Analytics tab now active — its Page-wrapped placeholder shows the title heading.
    expect(
      screen.getByRole("heading", { level: 1, name: "Analytics" }),
    ).toBeInTheDocument()
  })

  it("renders the sidebar trigger inside the sidebar", () => {
    render(<Dashboard />)
    expect(
      screen.getByRole("button", { name: /toggle sidebar/i }),
    ).toBeInTheDocument()
  })
})
