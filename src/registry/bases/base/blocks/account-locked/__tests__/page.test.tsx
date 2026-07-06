import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, afterEach } from "vitest"

import { AccountLocked } from "../page"

afterEach(() => {
  vi.useRealTimers()
})

describe("AccountLocked", () => {
  it("shows the locked state with an mm:ss countdown and reset action", () => {
    render(<AccountLocked />)
    expect(screen.getByText("Account locked")).toBeInTheDocument()
    expect(screen.getByText("14:00")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument()
  })

  it("confirms once reset password is clicked", async () => {
    const user = userEvent.setup()
    render(<AccountLocked />)
    await user.click(screen.getByRole("button", { name: /reset password/i }))
    expect(screen.getByText(/reset link sent to/i)).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /reset password/i })
    ).not.toBeInTheDocument()
  })

  it("unlocks once the countdown elapses", () => {
    vi.useFakeTimers()
    render(<AccountLocked />)
    act(() => {
      vi.advanceTimersByTime(14 * 60 * 1000)
    })
    expect(screen.getByText(/sign in again now/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /return to sign in/i })
    ).toBeInTheDocument()
  })
})
