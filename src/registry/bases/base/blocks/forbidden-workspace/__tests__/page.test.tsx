import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { ForbiddenWorkspace } from "../page"

describe("ForbiddenWorkspace", () => {
  it("names the blocked workspace and lists switchable ones", () => {
    render(<ForbiddenWorkspace />)
    expect(screen.getByRole("alert")).toHaveTextContent(/globex corp/i)
    expect(screen.getByText("Acme Inc")).toBeInTheDocument()
    expect(screen.getByText("Hooli")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /different account/i })
    ).toBeInTheDocument()
  })
})
