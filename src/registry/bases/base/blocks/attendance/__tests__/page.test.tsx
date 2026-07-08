import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Attendance } from "../page"
import { deriveStatus, hoursWorked, isValid, emptyDraft } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("hoursWorked", () => {
  it("rounds to a tenth of an hour", () => {
    expect(hoursWorked({ clockIn: "08:56", clockOut: "17:32" })).toBe(8.6)
  })

  it("returns 0 without both punches", () => {
    expect(hoursWorked({ clockIn: "09:00", clockOut: "" })).toBe(0)
  })

  it("returns 0 for a clock-out before clock-in", () => {
    expect(hoursWorked({ clockIn: "17:00", clockOut: "09:00" })).toBe(0)
  })
})

describe("deriveStatus", () => {
  const base = { ...emptyDraft(), employee: "X", clockOut: "17:00" }

  it("marks a punch after the shift start late", () => {
    expect(deriveStatus({ ...base, clockIn: "09:24" })).toBe("late")
  })

  it("marks an on-time punch present", () => {
    expect(deriveStatus({ ...base, clockIn: "09:00" })).toBe("present")
  })

  it("marks a missing punch absent", () => {
    expect(deriveStatus({ ...base, clockIn: "" })).toBe("absent")
  })
})

describe("isValid", () => {
  it("rejects an inverted punch pair", () => {
    const d = { ...emptyDraft(), employee: "X", clockIn: "17:00", clockOut: "09:00" }
    expect(isValid(d)).toBe(false)
  })

  it("allows an open shift with no clock-out", () => {
    expect(isValid({ ...emptyDraft(), employee: "X", clockIn: "09:00" })).toBe(true)
  })
})

describe("Attendance", () => {
  it("lists the seeded entries with total hours", () => {
    render(<Attendance />)
    expect(screen.getAllByText("Marcus Webb").length).toBeGreaterThan(0)
    expect(screen.getByText("6 entries · 33.9h logged")).toBeInTheDocument()
  })

  it("filters by date", async () => {
    const user = userEvent.setup()
    render(<Attendance />)

    await user.click(screen.getByLabelText("Filter by date"))
    await user.click(await screen.findByRole("option", { name: "2026-07-06" }))

    expect(screen.getByText("1 entries · 8.8h logged")).toBeInTheDocument()
    expect(screen.queryByText("Marcus Webb")).not.toBeInTheDocument()
  })

  it("creates an entry and derives its status from the punch", async () => {
    const user = userEvent.setup()
    render(<Attendance />)

    await user.click(screen.getByRole("button", { name: /new entry/i }))
    await user.type(screen.getByLabelText("Employee"), "Sam Ortiz")
    await user.clear(screen.getByLabelText("Date"))
    await user.type(screen.getByLabelText("Date"), "2026-07-07")
    await user.type(screen.getByLabelText("Clock in"), "09:30")
    await user.type(screen.getByLabelText("Clock out"), "17:30")
    await user.click(screen.getByRole("button", { name: "Create entry" }))

    expect(screen.getAllByText("Sam Ortiz").length).toBeGreaterThan(0)
    expect(screen.getAllByText("late").length).toBeGreaterThan(1)
    expect(screen.getByText("7 entries · 41.9h logged")).toBeInTheDocument()
  })

  it("keeps a leave day on leave when edited without punches", async () => {
    const user = userEvent.setup()
    render(<Attendance />)

    await user.click(
      screen.getAllByRole("button", {
        name: "Actions for Priya Nair on 2026-07-07",
      })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getAllByText("leave").length).toBeGreaterThan(0)
  })

  it("deletes an entry after confirmation", async () => {
    const user = userEvent.setup()
    render(<Attendance />)

    await user.click(
      screen.getAllByRole("button", {
        name: "Actions for Tom Okafor on 2026-07-07",
      })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Tom Okafor")).not.toBeInTheDocument()
    expect(screen.getByText("5 entries · 33.9h logged")).toBeInTheDocument()
  })
})
