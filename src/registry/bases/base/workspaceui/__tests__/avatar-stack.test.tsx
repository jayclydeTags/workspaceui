import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { AvatarStack, getInitials, type AvatarStackUser } from "../avatar-stack"

const users: AvatarStackUser[] = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Grace Hopper" },
  { id: "3", name: "Alan Turing" },
  { id: "4", name: "Katherine Johnson" },
  { id: "5", name: "Linus Torvalds" },
  { id: "6", name: "Margaret Hamilton" },
]

describe("getInitials", () => {
  it("takes the first and last word", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL")
    expect(getInitials("Mary Jane Watson")).toBe("MW")
    expect(getInitials("  cher ")).toBe("C")
    expect(getInitials("")).toBe("?")
  })
})

describe("AvatarStack", () => {
  it("shows up to max avatars and collapses the rest into a count", () => {
    render(<AvatarStack users={users} max={3} />)
    expect(
      screen.getByRole("img", { name: "Ada Lovelace" })
    ).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "Alan Turing" })).toBeInTheDocument()
    expect(
      screen.queryByRole("img", { name: "Katherine Johnson" })
    ).not.toBeInTheDocument()
    expect(screen.getByText("+3")).toBeInTheDocument()
    expect(
      screen.getByRole("img", {
        name: "3 more: Katherine Johnson, Linus Torvalds and Margaret Hamilton",
      })
    ).toBeInTheDocument()
  })

  it("summarizes the whole group for assistive tech", () => {
    render(<AvatarStack users={users} max={2} />)
    expect(
      screen.getByRole("group", {
        name: "Ada Lovelace, Grace Hopper and 4 more",
      })
    ).toBeInTheDocument()
  })

  it("shows the last avatar instead of a '+1' count", () => {
    render(<AvatarStack users={users.slice(0, 5)} max={4} />)
    expect(screen.queryByText("+1")).not.toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Linus Torvalds" })
    ).toBeInTheDocument()
  })

  it("renders initials as the fallback", () => {
    render(<AvatarStack users={users.slice(0, 2)} />)
    expect(screen.getByText("AL")).toBeInTheDocument()
    expect(screen.getByText("GH")).toBeInTheDocument()
  })

  it("reveals a name tooltip on keyboard focus", async () => {
    const user = userEvent.setup()
    render(<AvatarStack users={users.slice(0, 2)} />)
    await user.tab()
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveFocus()
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument()
  })
})
