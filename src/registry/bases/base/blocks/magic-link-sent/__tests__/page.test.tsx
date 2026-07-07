import { act, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"

import { MagicLinkSent } from "../page"

afterEach(() => {
  vi.useRealTimers()
})

describe("MagicLinkSent", () => {
  it("renders the sent confirmation with a resend cooldown", () => {
    render(<MagicLinkSent />)
    expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    expect(screen.getByText(/resend in/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /resend/i })).toBeDisabled()
  })

  it("enables resend once the cooldown elapses", () => {
    vi.useFakeTimers()
    render(<MagicLinkSent />)
    act(() => {
      vi.advanceTimersByTime(30 * 1000)
    })
    expect(
      screen.getByRole("button", { name: /resend link/i })
    ).not.toBeDisabled()
  })
})
