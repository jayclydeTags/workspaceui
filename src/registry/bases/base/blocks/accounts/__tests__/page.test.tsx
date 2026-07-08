import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest"

import { Accounts } from "../page"
import { daysSinceContact, emptyDraft, health, isValid, type Account } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

// `health()` is derived from the clock, so pin it — otherwise the seeded
// at-risk expectations rot as real time passes.
const TODAY = new Date("2026-07-08T00:00:00Z")

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(TODAY)
})
afterAll(() => vi.useRealTimers())

const withContact = (lastContact: string) => ({ lastContact }) as Account

describe("daysSinceContact", () => {
  it("counts whole days", () => {
    expect(daysSinceContact(withContact("2026-07-02"), TODAY)).toBe(6)
  })

  it("is Infinity when never contacted", () => {
    expect(daysSinceContact(withContact(""), TODAY)).toBe(Infinity)
  })
})

describe("health", () => {
  it("is healthy inside 30 days", () => {
    expect(health(withContact("2026-07-02"), TODAY)).toBe("healthy")
  })

  it("is watch past 30 days", () => {
    expect(health(withContact("2026-06-01"), TODAY)).toBe("watch")
  })

  it("is at risk past 60 days, and when never contacted", () => {
    expect(health(withContact("2026-04-18"), TODAY)).toBe("at-risk")
    expect(health(withContact(""), TODAY)).toBe("at-risk")
  })
})

describe("isValid", () => {
  it("rejects a negative ARR", () => {
    expect(isValid({ ...emptyDraft(), name: "X", arr: -1 })).toBe(false)
    expect(isValid({ ...emptyDraft(), name: "X", arr: 0 })).toBe(true)
  })
})

describe("Accounts", () => {
  it("summarises ARR and at-risk accounts", () => {
    render(<Accounts />)
    expect(
      screen.getByText("5 accounts · $738,000 ARR · 2 at risk")
    ).toBeInTheDocument()
  })

  it("filters by tier", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Accounts />)

    await user.click(screen.getByLabelText("Filter by tier"))
    await user.click(await screen.findByRole("option", { name: "strategic" }))

    expect(screen.getAllByText("Northwind").length).toBeGreaterThan(0)
    expect(screen.queryByText("Tailspin")).not.toBeInTheDocument()
  })

  it("can't delete an account with open deals", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Accounts />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Northwind" })[0]
    )
    expect(
      await screen.findByRole("menuitem", { name: "Has open deals" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  it("logging a contact date moves the account back to healthy", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Accounts />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Fabrikam" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))
    await user.clear(screen.getByLabelText("Last contact"))
    await user.type(screen.getByLabelText("Last contact"), "2026-07-07")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(
      screen.getByText("5 accounts · $738,000 ARR · 1 at risk")
    ).toBeInTheDocument()
  })

  it("creates an account with no open deals", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Accounts />)

    await user.click(screen.getByRole("button", { name: /new account/i }))
    await user.type(screen.getByLabelText("Name"), "Wingtip Toys")
    await user.type(screen.getByLabelText("ARR"), "30000")
    await user.type(screen.getByLabelText("Last contact"), "2026-07-07")
    await user.click(screen.getByRole("button", { name: "Create account" }))

    expect(screen.getAllByText("Wingtip Toys").length).toBeGreaterThan(0)
    expect(
      screen.getByText("6 accounts · $768,000 ARR · 2 at risk")
    ).toBeInTheDocument()
  })

  it("deletes a deal-free account after confirmation", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Accounts />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Fabrikam" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Fabrikam")).not.toBeInTheDocument()
    expect(
      screen.getByText("4 accounts · $642,000 ARR · 1 at risk")
    ).toBeInTheDocument()
  })
})
