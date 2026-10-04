import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BlockPreview } from "@/components/docs/block-preview"

const props = {
  title: "Settings",
  slug: "settings",
  installCmd: "npx shadcn@latest add jayclydeTags/workspaceui/settings",
  files: [{ name: "page.tsx", path: "page.tsx", code: "export const a = 1" }],
  prev: { title: "Credit Usage", href: "/blocks/credit-usage" },
  next: { title: "Login", href: "/blocks/login" },
}

describe("BlockPreview", () => {
  it("is the block on a canvas: toolbar plus preview, no side panel", () => {
    render(<BlockPreview {...props} />)

    expect(screen.getByTitle("Settings")).toHaveAttribute(
      "src",
      "/blocks/preview/settings"
    )
    expect(screen.queryByRole("complementary")).toBeNull()
  })

  it("links to the previous and next blocks", () => {
    render(<BlockPreview {...props} />)

    expect(
      screen.getByRole("link", { name: "Previous block: Credit Usage" })
    ).toHaveAttribute("href", "/blocks/credit-usage")
    expect(
      screen.getByRole("link", { name: "Next block: Login" })
    ).toHaveAttribute("href", "/blocks/login")
  })

  it("disables an arrow at either end of the list", () => {
    render(<BlockPreview {...props} prev={undefined} next={undefined} />)

    expect(
      screen.getByRole("button", { name: "Previous block" })
    ).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next block" })).toBeDisabled()
  })

  it("shows the install command, and omits it for copy-only blocks", () => {
    const { rerender } = render(<BlockPreview {...props} />)
    expect(
      screen.getByRole("button", { name: "Copy install command" })
    ).toHaveTextContent("npx shadcn@latest add")

    rerender(<BlockPreview {...props} installCmd={undefined} />)
    expect(
      screen.queryByRole("button", { name: "Copy install command" })
    ).toBeNull()
  })

  it("switches to the source files on the Code tab", () => {
    render(<BlockPreview {...props} />)

    // fireEvent: the resizable panel group throws on pointer events in jsdom.
    fireEvent.click(screen.getByRole("tab", { name: "Code" }))

    expect(screen.getByText("Files")).toBeInTheDocument()
    expect(screen.queryByTitle("Settings")).toBeNull()
    expect(screen.queryByRole("group", { name: "Preview width" })).toBeNull()
  })
})
