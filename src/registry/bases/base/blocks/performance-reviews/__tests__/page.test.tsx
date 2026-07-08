import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { PerformanceReviews } from "../page"
import { averageRating, emptyDraft, isValid, type Review } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("averageRating", () => {
  it("ignores unrated reviews", () => {
    const reviews = [{ rating: 4 }, { rating: 0 }, { rating: 5 }] as Review[]
    expect(averageRating(reviews)).toBe(4.5)
  })

  it("returns 0 when nothing is rated", () => {
    expect(averageRating([{ rating: 0 }] as Review[])).toBe(0)
  })
})

describe("isValid", () => {
  const filled = {
    ...emptyDraft(),
    employee: "A",
    reviewer: "B",
    period: "H1 2026",
  }

  it("rejects a completed review with no rating", () => {
    expect(isValid({ ...filled, status: "completed" })).toBe(false)
    expect(isValid({ ...filled, status: "completed", rating: 3 })).toBe(true)
  })

  it("allows an unrated draft", () => {
    expect(isValid(filled)).toBe(true)
  })
})

describe("PerformanceReviews", () => {
  it("lists the seeded reviews with the average rating", () => {
    render(<PerformanceReviews />)
    expect(screen.getAllByText("Ava Chen").length).toBeGreaterThan(0)
    expect(screen.getByText("5 reviews · avg 4")).toBeInTheDocument()
    expect(screen.getAllByLabelText(/^5 of 5/).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Unrated").length).toBeGreaterThan(0)
  })

  it("filters by status", async () => {
    const user = userEvent.setup()
    render(<PerformanceReviews />)

    await user.click(screen.getByLabelText("Filter by status"))
    await user.click(await screen.findByRole("option", { name: "draft" }))

    expect(screen.getAllByText("Tom Okafor").length).toBeGreaterThan(0)
    expect(screen.queryByText("Ava Chen")).not.toBeInTheDocument()
  })

  it("creates a review", async () => {
    const user = userEvent.setup()
    render(<PerformanceReviews />)

    await user.click(screen.getByRole("button", { name: /new review/i }))
    await user.type(screen.getByLabelText("Employee"), "Sam Ortiz")
    await user.type(screen.getByLabelText("Reviewer"), "Dana Reyes")
    await user.type(screen.getByLabelText("Period"), "H1 2026")
    await user.click(screen.getByRole("button", { name: "Create review" }))

    expect(screen.getAllByText("Sam Ortiz").length).toBeGreaterThan(0)
    expect(screen.getByText("6 reviews · avg 4")).toBeInTheDocument()
  })

  it("blocks completing a review that has no rating", async () => {
    const user = userEvent.setup()
    render(<PerformanceReviews />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Tom Okafor" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    await user.click(screen.getByLabelText("Status"))
    await user.click(await screen.findByRole("option", { name: "completed" }))

    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled()
    expect(screen.getByText("A completed review needs a rating.")).toBeInTheDocument()

    await user.click(screen.getByLabelText("Rating"))
    await user.click(await screen.findByRole("option", { name: /^3 —/ }))
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getByText("5 reviews · avg 3.8")).toBeInTheDocument()
  })

  it("deletes a review after confirmation", async () => {
    const user = userEvent.setup()
    render(<PerformanceReviews />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Lena Fischer" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Lena Fischer")).not.toBeInTheDocument()
    expect(screen.getByText("4 reviews · avg 4")).toBeInTheDocument()
  })
})
