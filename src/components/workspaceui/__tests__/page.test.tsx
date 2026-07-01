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
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0)
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

  it("exposes exactly one h1 with the plain title", () => {
    render(<Page title="Settings" />)
    const headings = screen.getAllByRole("heading", { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent("Settings")
  })

  it("exposes exactly one sr-only h1 matching the last breadcrumb", () => {
    render(<Page breadcrumbs={[{ label: "Home", href: "/" }, { label: "Billing" }]} />)
    const headings = screen.getAllByRole("heading", { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent("Billing")
    expect(headings[0]).toHaveClass("sr-only")
  })

  it("hides the decorative visual from assistive tech", () => {
    render(<Page title="Settings" visual={<svg data-testid="icon" />} />)
    expect(screen.getByTestId("icon").closest('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it("renders the header as a <header> landmark", () => {
    render(<Page title="Settings" />)
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })
})
