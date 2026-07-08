import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Timesheets } from "../page"
import { emptyDraft, isValid, utilization, type TimeEntry } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("utilization", () => {
  it("is the billable share of logged hours", () => {
    const entries = [
      { hours: 6, billable: true },
      { hours: 2, billable: false },
    ] as TimeEntry[]
    expect(utilization(entries)).toBe(75)
  })

  it("guards against an empty timesheet", () => {
    expect(utilization([])).toBe(0)
  })
})

describe("isValid", () => {
  const filled = { ...emptyDraft(), member: "Ava Chen" }

  it("rejects zero or over-long entries", () => {
    expect(isValid({ ...filled, hours: 0 })).toBe(false)
    expect(isValid({ ...filled, hours: 25 })).toBe(false)
    expect(isValid({ ...filled, hours: 7.5 })).toBe(true)
  })
})

describe("Timesheets", () => {
  it("summarises logged and billable hours", () => {
    render(<Timesheets />)
    expect(screen.getByText("23.0h logged · 80% billable")).toBeInTheDocument()
  })

  it("filters by project", async () => {
    const user = userEvent.setup()
    render(<Timesheets />)

    await user.click(screen.getByLabelText("Filter by project"))
    await user.click(
      await screen.findByRole("option", { name: "PRJ-101 Billing migration" })
    )

    expect(screen.getByText("13.5h logged · 100% billable")).toBeInTheDocument()
    expect(screen.queryByText("Marcus Webb")).not.toBeInTheDocument()
  })

  it("logs a new entry as a draft", async () => {
    const user = userEvent.setup()
    render(<Timesheets />)

    await user.click(screen.getByRole("button", { name: /log time/i }))
    await user.type(screen.getByLabelText("Member"), "Sam Ortiz")
    await user.type(screen.getByLabelText("Task"), "Schema review")
    await user.type(screen.getByLabelText("Hours"), "2")
    await user.click(screen.getByRole("button", { name: "Log entry" }))

    expect(screen.getAllByText("Sam Ortiz").length).toBeGreaterThan(0)
    expect(screen.getByText("25.0h logged · 82% billable")).toBeInTheDocument()
  })

  it("advances a draft through submit then approve", async () => {
    const user = userEvent.setup()
    render(<Timesheets />)

    const open = async () =>
      user.click(
        screen.getAllByRole("button", { name: "Actions for Site survey" })[0]
      )

    await open()
    await user.click(await screen.findByRole("menuitem", { name: "Submit" }))

    await open()
    // Editing and deleting are gone once the entry leaves draft.
    expect(screen.queryByRole("menuitem", { name: "Edit" })).not.toBeInTheDocument()
    await user.click(await screen.findByRole("menuitem", { name: "Approve" }))

    await open()
    expect(await screen.findByRole("menuitem", { name: "Locked" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })

  it("deletes a draft entry after confirmation", async () => {
    const user = userEvent.setup()
    render(<Timesheets />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Site survey" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Site survey")).not.toBeInTheDocument()
    expect(screen.getByText("19.5h logged · 95% billable")).toBeInTheDocument()
  })
})
