import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { LeaveRequests } from "../page"
import { dayCount } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("dayCount", () => {
  it("counts an inclusive range", () => {
    expect(dayCount("2026-07-13", "2026-07-17")).toBe(5)
  })

  it("counts a single day as 1", () => {
    expect(dayCount("2026-07-06", "2026-07-06")).toBe(1)
  })

  it("returns 0 for an inverted or empty range", () => {
    expect(dayCount("2026-07-17", "2026-07-13")).toBe(0)
    expect(dayCount("", "2026-07-13")).toBe(0)
  })
})

describe("LeaveRequests", () => {
  it("lists the seeded requests with a pending count", () => {
    render(<LeaveRequests />)
    expect(screen.getAllByText("Ava Chen").length).toBeGreaterThan(0)
    expect(screen.getByText("5 requests · 2 pending")).toBeInTheDocument()
  })

  it("files a new request as pending", async () => {
    const user = userEvent.setup()
    render(<LeaveRequests />)

    await user.click(screen.getByRole("button", { name: /new request/i }))
    await user.type(screen.getByLabelText("Employee"), "Sam Ortiz")
    await user.type(screen.getByLabelText("Start date"), "2026-08-03")
    await user.type(screen.getByLabelText("End date"), "2026-08-04")
    await user.click(screen.getByRole("button", { name: "Submit request" }))

    expect(screen.getAllByText("Sam Ortiz").length).toBeGreaterThan(0)
    expect(screen.getByText("6 requests · 3 pending")).toBeInTheDocument()
  })

  it("approves a pending request", async () => {
    const user = userEvent.setup()
    render(<LeaveRequests />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Ava Chen" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Approve" }))

    expect(screen.getByText("5 requests · 1 pending")).toBeInTheDocument()
  })

  it("offers no decision actions on a settled request", async () => {
    const user = userEvent.setup()
    render(<LeaveRequests />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Marcus Webb" })[0]
    )
    await screen.findByRole("menuitem", { name: "Delete" })
    expect(
      screen.queryByRole("menuitem", { name: "Approve" })
    ).not.toBeInTheDocument()
  })

  it("filters by status", async () => {
    const user = userEvent.setup()
    render(<LeaveRequests />)

    await user.click(screen.getByLabelText("Filter by status"))
    await user.click(await screen.findByRole("option", { name: /^rejected$/i }))

    expect(screen.getAllByText("Tom Okafor").length).toBeGreaterThan(0)
    expect(screen.queryByText("Ava Chen")).not.toBeInTheDocument()
  })

  it("deletes a request after confirmation", async () => {
    const user = userEvent.setup()
    render(<LeaveRequests />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Tom Okafor" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Tom Okafor")).not.toBeInTheDocument()
    expect(screen.getByText("4 requests · 2 pending")).toBeInTheDocument()
  })
})
