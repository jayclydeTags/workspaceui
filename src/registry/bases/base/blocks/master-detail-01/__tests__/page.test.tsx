import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { MasterDetail01 } from "../page"

describe("MasterDetail01", () => {
  it("lists the seeded tasks and shows an empty detail panel initially", () => {
    render(<MasterDetail01 />)
    expect(screen.getByText("5 tasks")).toBeInTheDocument()
    expect(screen.getByText("Migrate billing to Stripe")).toBeInTheDocument()
    expect(screen.getByText("No task selected")).toBeInTheDocument()
  })

  it("shows the selected task's detail on click", async () => {
    const user = userEvent.setup()
    render(<MasterDetail01 />)

    await user.click(screen.getByText("Redesign onboarding flow"))

    expect(screen.getByRole("heading", { name: "Redesign onboarding flow" })).toBeInTheDocument()
    expect(screen.getByText(/Simplify the 5-step signup wizard/)).toBeInTheDocument()
    // "Emma Davis" appears in both the list row and the detail panel
    expect(screen.getAllByText("Emma Davis").length).toBeGreaterThan(1)
    expect(screen.queryByText("No task selected")).not.toBeInTheDocument()
  })

  it("switches selection between tasks", async () => {
    const user = userEvent.setup()
    render(<MasterDetail01 />)

    await user.click(screen.getByText("Migrate billing to Stripe"))
    expect(screen.getByText("2026-07-12")).toBeInTheDocument()

    await user.click(screen.getByText("Write Q3 roadmap doc"))
    expect(screen.getByText("2026-07-20")).toBeInTheDocument()
  })
})
