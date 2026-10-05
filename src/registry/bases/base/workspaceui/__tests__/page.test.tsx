import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Page,
  PageActions,
  PageBreadcrumbs,
  PageContent,
  PageHeader,
  PageHeading,
  PageRoot,
  PageSubtitle,
  PageTitle,
  PageVisual,
} from "../page"

describe("Page", () => {
  it("renders title and subtitle", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Settings</Page.Title>
          </Page.Heading>
          <Page.Subtitle>Manage your account</Page.Subtitle>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Manage your account")).toBeInTheDocument()
  })

  it("renders a breadcrumb trail with the last item as the current page", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Breadcrumbs>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </Page.Breadcrumbs>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(
      screen.getByText("Settings", { selector: "[aria-current]" })
    ).toBeInTheDocument()
  })

  it("renders no header when Page.Header is omitted", () => {
    render(
      <Page.Root>
        <Page.Content>
          <div>body</div>
        </Page.Content>
      </Page.Root>
    )
    expect(screen.queryByRole("banner")).not.toBeInTheDocument()
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    expect(screen.getByText("body")).toBeInTheDocument()
  })

  it("pads the content only when padded is set", () => {
    render(
      <Page.Root>
        <Page.Content padded>
          <div>padded body</div>
        </Page.Content>
        <Page.Content>
          <div>plain body</div>
        </Page.Content>
      </Page.Root>
    )
    expect(screen.getByText("padded body").parentElement).toHaveClass("p-6")
    expect(screen.getByText("plain body").parentElement).not.toHaveClass("p-6")
  })

  it("exposes exactly one h1 with the plain title", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Settings</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    )
    const headings = screen.getAllByRole("heading", { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent("Settings")
  })

  it("keeps the page's single h1 on Page.Title when a trail is the visible heading", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Breadcrumbs>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Billing</BreadcrumbPage>
              </BreadcrumbItem>
            </Page.Breadcrumbs>
            <Page.Title className="sr-only">Billing</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    )
    const headings = screen.getAllByRole("heading", { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent("Billing")
    expect(headings[0]).toHaveClass("sr-only")
  })

  it("renders no heading of its own in Page.Breadcrumbs", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Billing</BreadcrumbPage>
            </BreadcrumbItem>
          </Page.Breadcrumbs>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-slot",
      "page-breadcrumbs"
    )
  })

  it("accepts custom crumbs, such as a router link via render", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<a data-testid="router-link" href="/s" />}
              >
                Settings
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Page.Breadcrumbs>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.getByTestId("router-link")).toHaveTextContent("Settings")
  })

  it("hides the decorative visual from assistive tech", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Visual>
              <svg data-testid="icon" />
            </Page.Visual>
            <Page.Title>Settings</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    )
    expect(
      screen.getByTestId("icon").closest('[aria-hidden="true"]')
    ).toBeInTheDocument()
  })

  it("renders Page.Header as a <header> landmark", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Settings</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })

  it("renders actions and badge-like children next to the title", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Billing</Page.Title>
            <span>Beta</span>
          </Page.Heading>
          <Page.Actions>
            <button>Save</button>
          </Page.Actions>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.getByText("Beta")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })

  it("puts a tooltip title on string titles and subtitles", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Billing</Page.Title>
          </Page.Heading>
          <Page.Subtitle>Invoices</Page.Subtitle>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.getByText("Billing")).toHaveAttribute("title", "Billing")
    expect(screen.getByText("Invoices")).toHaveAttribute("title", "Invoices")
  })

  it("keeps the subtitle on its own row wherever it sits in the header", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Subtitle>Invoices</Page.Subtitle>
          <Page.Heading>
            <Page.Title>Billing</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    )
    expect(screen.getByText("Invoices")).toHaveClass("order-last", "w-full")
  })

  it("forwards className and div props to Page.Root and merges them", () => {
    render(
      <Page.Root className="custom" data-testid="root" id="x">
        <Page.Content>body</Page.Content>
      </Page.Root>
    )
    const root = screen.getByTestId("root")
    expect(root).toHaveClass("custom", "flex", "h-full", "flex-col")
    expect(root).toHaveAttribute("id", "x")
  })

  it("tags every part with a data-slot", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Visual />
            <Page.Title>T</Page.Title>
          </Page.Heading>
          <Page.Actions />
          <Page.Subtitle>S</Page.Subtitle>
        </Page.Header>
        <Page.Content />
      </Page.Root>
    )
    for (const slot of [
      "page",
      "page-header",
      "page-heading",
      "page-visual",
      "page-title",
      "page-actions",
      "page-subtitle",
      "page-content",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
  })

  it("exports the namespace and the flat parts", () => {
    expect(Page.Root).toBe(PageRoot)
    expect(Page.Header).toBe(PageHeader)
    expect(Page.Heading).toBe(PageHeading)
    expect(Page.Visual).toBe(PageVisual)
    expect(Page.Title).toBe(PageTitle)
    expect(Page.Breadcrumbs).toBe(PageBreadcrumbs)
    expect(Page.Actions).toBe(PageActions)
    expect(Page.Subtitle).toBe(PageSubtitle)
    expect(Page.Content).toBe(PageContent)
  })
})
