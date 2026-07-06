import { act, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"

import { AccountLocked } from "../page"

afterEach(() => {
  vi.useRealTimers()
})

describe("AccountLocked", () => {
  it("shows the locked state with a countdown and reset action", () => {
    render(<AccountLocked />)
    expect(screen.getByText("Account locked")).toBeInTheDocument()
    expect(screen.getByText(/try again in 14 minutes/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument()
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
