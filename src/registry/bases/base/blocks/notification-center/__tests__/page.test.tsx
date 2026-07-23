import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { NotificationCenter } from "../page"
import { NotificationBell } from "../components/notification-bell"
import type { Notification } from "../data"

describe("NotificationCenter", () => {
  it("paginates at 20 per page", async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
    expect(screen.getByText("24 notifications")).toBeInTheDocument()
    expect(
      screen.queryByText(/traceability exports enabled/)
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText(/traceability exports enabled/)).toBeInTheDocument()
  })

  it("filters by read state", async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)

    await user.click(screen.getByRole("button", { name: /^All/ }))
    await user.click(
      await screen.findByRole("menuitemradio", { name: "Unread" })
    )

    expect(screen.getByText("6 notifications")).toBeInTheDocument()
  })

  it("shows a filter-aware empty state", async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)

    await user.click(screen.getByRole("button", { name: /Severity/ }))
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "Critical" })
    )
    // date-range filter narrows the criticals away entirely
    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "2099-01-01" },
    })

    expect(screen.getByText("No matches")).toBeInTheDocument()
  })

  it("marks one read on click and drops the unread count", async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)

    expect(screen.getByText("6 unread")).toBeInTheDocument()
    await user.click(screen.getByText(/PH-MFR-0042 has expired/))
    expect(screen.getByText("5 unread")).toBeInTheDocument()
  })

  it("reports a missing entity instead of navigating", async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)

    await user.click(screen.getByText(/Anomalous batch reassignment/))
    expect(
      screen.getByText("This record is no longer available.")
    ).toBeInTheDocument()
  })

  it("marks all read and disables the mark-all control", async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)

    const markAll = screen.getByRole("button", { name: /mark all as read/i })
    await user.click(markAll)

    expect(screen.getByText("All caught up")).toBeInTheDocument()
    expect(markAll).toBeDisabled()
  })
})

function makeItems(unread: number): Notification[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: String(i),
    severity: "info" as const,
    message: `Notification ${i}`,
    createdAt: new Date(Date.now() - i * 60_000).toISOString(),
    read: i >= unread,
  }))
}

describe("NotificationBell", () => {
  const noop = () => {}

  it("caps the unread badge at 9+", () => {
    render(
      <NotificationBell
        items={makeItems(11)}
        onSelect={noop}
        onMarkAllRead={noop}
      />
    )
    const bell = screen.getByRole("button", {
      name: "Notifications, 11 unread",
    })
    expect(within(bell).getByText("9+")).toBeInTheDocument()
  })

  it("renders no badge when nothing is unread", () => {
    render(
      <NotificationBell
        items={makeItems(0)}
        onSelect={noop}
        onMarkAllRead={noop}
      />
    )
    const bell = screen.getByRole("button", { name: "Notifications" })
    expect(bell).toHaveTextContent("")
  })

  it("shows only the 5 most recent plus a View all item", async () => {
    const user = userEvent.setup()
    const onViewAll = vi.fn()
    render(
      <NotificationBell
        items={makeItems(3)}
        onSelect={noop}
        onMarkAllRead={noop}
        onViewAll={onViewAll}
      />
    )

    await user.click(screen.getByRole("button", { name: /Notifications/ }))
    const items = await screen.findAllByRole("menuitem")
    expect(items).toHaveLength(6)
    expect(screen.getByText("Notification 4")).toBeInTheDocument()
    expect(screen.queryByText("Notification 5")).not.toBeInTheDocument()

    await user.click(screen.getByRole("menuitem", { name: "View all" }))
    expect(onViewAll).toHaveBeenCalled()
  })

  it("shows an empty state with no notifications", async () => {
    const user = userEvent.setup()
    render(<NotificationBell items={[]} onSelect={noop} onMarkAllRead={noop} />)

    await user.click(screen.getByRole("button", { name: "Notifications" }))
    expect(await screen.findByText("You're all caught up")).toBeInTheDocument()
  })
})
