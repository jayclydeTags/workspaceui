import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { RecoveryCodes } from "../page"

describe("RecoveryCodes", () => {
  it("renders eight codes and gates Continue until saved is checked", async () => {
    const user = userEvent.setup()
    render(<RecoveryCodes />)
    expect(screen.getByText("4X9K-7QP2")).toBeInTheDocument()
    const cont = screen.getByRole("button", { name: /continue/i })
    expect(cont).toBeDisabled()
    await user.click(screen.getByRole("checkbox"))
    expect(cont).not.toBeDisabled()
  })

  it("regenerates a fresh set of codes", async () => {
    const user = userEvent.setup()
    render(<RecoveryCodes />)
    await user.click(screen.getByRole("checkbox"))
    await user.click(screen.getByRole("button", { name: /regenerate codes/i }))
    // regeneration replaces the demo codes and re-locks the gate
    expect(screen.queryByText("4X9K-7QP2")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled()
  })
})
