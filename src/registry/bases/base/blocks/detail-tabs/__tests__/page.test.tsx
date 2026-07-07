import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { DetailTabs } from "../page"

describe("DetailTabs", () => {
  it("shows the record header and overview tab by default", () => {
    render(<DetailTabs />)
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument()
    // Overview field visible on load
    expect(screen.getByText("Lifetime value")).toBeInTheDocument()
  })

  it("switches to the activity tab", async () => {
    const user = userEvent.setup()
    render(<DetailTabs />)

    await user.click(screen.getByRole("tab", { name: "Activity" }))
    expect(
      screen.getByText("Upgraded to Enterprise plan")
    ).toBeInTheDocument()
  })

  it("switches to the orders tab", async () => {
    const user = userEvent.setup()
    render(<DetailTabs />)

    await user.click(screen.getByRole("tab", { name: "Orders" }))
    expect(screen.getByText("INV-1043")).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toBeInTheDocument()
  })
})
