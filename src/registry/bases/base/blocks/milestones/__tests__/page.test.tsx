import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest"

import { Milestones } from "../page"
import { isValid, emptyDraft, progress, state, type Milestone } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

// `state()` is derived from the clock, so pin it — otherwise the seeded
// at-risk / overdue expectations rot as real time passes.
const TODAY = new Date("2026-07-08T00:00:00Z")

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(TODAY)
})
afterAll(() => vi.useRealTimers())

const m = (over: Partial<Milestone>): Milestone =>
  ({ due: "2026-12-01", tasksTotal: 10, tasksDone: 0, completedOn: "", ...over }) as Milestone

describe("state", () => {
  it("is completed once signed off, whatever the due date", () => {
    expect(state(m({ due: "2020-01-01", completedOn: "2020-01-01" }), TODAY)).toBe(
      "completed"
    )
  })

  it("is overdue past the due date", () => {
    expect(state(m({ due: "2026-06-30" }), TODAY)).toBe("overdue")
  })

  it("is at risk when due within a week with work left", () => {
    expect(state(m({ due: "2026-07-10", tasksDone: 6 }), TODAY)).toBe("at-risk")
  })

  it("is on track when the scope is finished", () => {
    expect(state(m({ due: "2026-07-10", tasksDone: 10 }), TODAY)).toBe("on-track")
  })
})

describe("progress", () => {
  it("rounds the task share", () => {
    expect(progress(m({ tasksTotal: 8, tasksDone: 6 }))).toBe(75)
  })

  it("guards against an empty scope", () => {
    expect(progress(m({ tasksTotal: 0 }))).toBe(0)
  })
})

describe("isValid", () => {
  it("rejects more done than in scope", () => {
    const d = { ...emptyDraft(), name: "X", due: "2026-07-10" }
    expect(isValid({ ...d, tasksTotal: 3, tasksDone: 4 })).toBe(false)
    expect(isValid({ ...d, tasksTotal: 3, tasksDone: 3 })).toBe(true)
  })
})

describe("Milestones", () => {
  it("lists the seeded milestones with derived states", () => {
    render(<Milestones />)
    expect(screen.getByText("4 open · 1 overdue")).toBeInTheDocument()
    expect(screen.getAllByText("at risk").length).toBeGreaterThan(0)
    expect(screen.getAllByText("overdue").length).toBeGreaterThan(0)
  })

  it("marks a milestone complete, finishing its scope", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Milestones />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Beta cut" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Mark complete" }))

    expect(screen.getByText("3 open · 0 overdue")).toBeInTheDocument()
    expect(screen.getAllByText("10/10").length).toBeGreaterThan(0)
  })

  it("reopens a completed milestone", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Milestones />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Discovery sign-off" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Reopen" }))

    // Due 2026-05-29 with no sign-off — it goes straight back to overdue.
    expect(screen.getByText("5 open · 2 overdue")).toBeInTheDocument()
  })

  it("blocks saving more done tasks than are in scope", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Milestones />)

    await user.click(screen.getByRole("button", { name: /new milestone/i }))
    await user.type(screen.getByLabelText("Name"), "Cutover rehearsal")
    await user.type(screen.getByLabelText("Due date"), "2026-10-01")
    await user.clear(screen.getByLabelText("Tasks done"))
    await user.type(screen.getByLabelText("Tasks done"), "4")

    expect(screen.getByRole("button", { name: "Create milestone" })).toBeDisabled()
    expect(
      screen.getByText("Can't finish more tasks than are in scope.")
    ).toBeInTheDocument()

    await user.clear(screen.getByLabelText("Tasks in scope"))
    await user.type(screen.getByLabelText("Tasks in scope"), "6")
    await user.click(screen.getByRole("button", { name: "Create milestone" }))

    expect(screen.getAllByText("Cutover rehearsal").length).toBeGreaterThan(0)
    expect(screen.getByText("5 open · 1 overdue")).toBeInTheDocument()
  })

  it("deletes a milestone after confirmation", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Milestones />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Beta cut" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Beta cut")).not.toBeInTheDocument()
    expect(screen.getByText("3 open · 0 overdue")).toBeInTheDocument()
  })
})
