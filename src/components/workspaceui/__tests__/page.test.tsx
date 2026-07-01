import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Page } from "../page"

describe("Page", () => {
  it("renders title and subtitle", () => {
    render(<Page title="Settings" subtitle="Manage your account" />)
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Manage your account")).toBeInTheDocument()
  })

  it("renders breadcrumbs instead of the plain title", () => {
    render(
      <Page
        title="ignored"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}
      />,
    )
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.queryByText("ignored")).not.toBeInTheDocument()
  })

  it("omits the header when hasHeader is false", () => {
    render(
      <Page title="Settings" hasHeader={false}>
        <div>body</div>
      </Page>,
    )
    expect(screen.queryByText("Settings")).not.toBeInTheDocument()
    expect(screen.getByText("body")).toBeInTheDocument()
  })

  it("applies padding to content when hasPadding is set", () => {
    render(
      <Page title="Settings" hasPadding>
        <div>body</div>
      </Page>,
    )
    expect(screen.getByText("body").parentElement).toHaveClass("p-6")
  })
})
