import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { CommentsThread01 } from "../page"

describe("CommentsThread01", () => {
  it("lists seeded comments and replies with a total count", () => {
    render(<CommentsThread01 />)
    // 3 comments + 1 reply
    expect(screen.getByText("4 comments")).toBeInTheDocument()
    expect(screen.getByText(/confirm the renewal terms/)).toBeInTheDocument()
    expect(screen.getByText(/should be 15%, not 25%/)).toBeInTheDocument()
  })

  it("posts a top-level comment", async () => {
    const user = userEvent.setup()
    render(<CommentsThread01 />)

    await user.type(
      screen.getByPlaceholderText("Add a comment…"),
      "Looks good to me."
    )
    await user.click(screen.getByRole("button", { name: "Comment" }))

    expect(screen.getByText("Looks good to me.")).toBeInTheDocument()
    expect(screen.getByText("5 comments")).toBeInTheDocument()
  })

  it("posts a reply to an existing comment", async () => {
    const user = userEvent.setup()
    render(<CommentsThread01 />)

    // open the reply composer on Emma's comment (the second, no replies yet)
    await user.click(screen.getAllByRole("button", { name: "Reply" })[1])
    const textarea = screen.getByPlaceholderText("Reply to Emma Davis…")
    await user.type(textarea, "Thanks for that.")
    // scope to the composer form — toggle buttons share the "Reply" label
    const form = textarea.closest("form")!
    await user.click(within(form).getByRole("button", { name: "Reply" }))

    expect(screen.getByText("Thanks for that.")).toBeInTheDocument()
    expect(screen.getByText("5 comments")).toBeInTheDocument()
  })
})
