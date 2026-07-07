import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { NotificationsInbox } from "../page"

describe("NotificationsInbox", () => {
  it("shows the unread count in the subtitle and tab badge", () => {
    render(<NotificationsInbox />)
    expect(screen.getByText("3 unread")).toBeInTheDocument()
    expect(
      within(screen.getByRole("tab", { name: /unread/i })).getByText("3")
    ).toBeInTheDocument()
  })

  it("marks a single notification read on click", async () => {
    const user = userEvent.setup()
    render(<NotificationsInbox />)

    await user.click(screen.getByText("Sarah Chen mentioned you"))
    expect(screen.getByText("2 unread")).toBeInTheDocument()
  })

  it("marks all read and disables the button", async () => {
    const user = userEvent.setup()
    render(<NotificationsInbox />)

    const markAll = screen.getByRole("button", { name: /mark all read/i })
    await user.click(markAll)

    expect(screen.getByText("All caught up")).toBeInTheDocument()
    expect(markAll).toBeDisabled()
  })

  it("shows only unread items on the Unread tab", async () => {
    const user = userEvent.setup()
    render(<NotificationsInbox />)

    await user.click(screen.getByRole("tab", { name: /unread/i }))

    expect(screen.getByText("Sarah Chen mentioned you")).toBeInTheDocument()
    // a read item is filtered out
    expect(screen.queryByText("Export ready")).not.toBeInTheDocument()
  })
})
