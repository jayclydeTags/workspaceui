import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { SecretField, maskSecret } from "../secret-field"

const KEY = "sk_demo_51HxQ2mZ9aB3cD4eF5gH6iJ7k"

describe("maskSecret", () => {
  it("keeps the type prefix and the last characters", () => {
    expect(maskSecret(KEY)).toBe(`sk_demo_${"•".repeat(21)}iJ7k`)
  })

  it("caps the mask length for long tokens", () => {
    const masked = maskSecret("a".repeat(200), 4)
    expect(masked).toBe(`${"•".repeat(24)}aaaa`)
  })

  it("never reveals more than half of a short secret", () => {
    expect(maskSecret("abcd", 4)).toBe("••cd")
    expect(maskSecret("abcd", 0)).toBe("••••")
  })
})

describe("SecretField", () => {
  it("masks by default and toggles reveal", async () => {
    const user = userEvent.setup()
    render(<SecretField aria-label="API key" value={KEY} />)
    const input = screen.getByLabelText("API key")
    expect(input).toHaveValue(maskSecret(KEY))
    expect(input).toHaveAttribute("readonly")

    await user.click(screen.getByRole("button", { name: "Show secret" }))
    expect(input).toHaveValue(KEY)
    expect(screen.getByRole("button", { name: "Hide secret" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("copies the full secret even while masked and announces it", async () => {
    const user = userEvent.setup()
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined)
    const onCopied = vi.fn()
    render(<SecretField aria-label="API key" value={KEY} onCopied={onCopied} />)

    await user.click(screen.getByRole("button", { name: "Copy secret" }))
    expect(writeText).toHaveBeenCalledWith(KEY)
    expect(onCopied).toHaveBeenCalledWith(KEY)
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard")
  })

  it("announces a failed copy", async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("denied")
    )
    const onCopied = vi.fn()
    render(<SecretField aria-label="API key" value={KEY} onCopied={onCopied} />)

    await user.click(screen.getByRole("button", { name: "Copy secret" }))
    expect(onCopied).not.toHaveBeenCalled()
    expect(screen.getByRole("status")).toHaveTextContent("Couldn't copy")
  })

  it("hides the reveal toggle when revealable is false", () => {
    render(<SecretField aria-label="Token" value={KEY} revealable={false} />)
    expect(
      screen.queryByRole("button", { name: /show secret/i })
    ).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Copy secret" })).toBeEnabled()
  })

  it("disables both controls when disabled", () => {
    render(<SecretField aria-label="Token" value={KEY} disabled />)
    expect(screen.getByRole("button", { name: "Show secret" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Copy secret" })).toBeDisabled()
  })
})
