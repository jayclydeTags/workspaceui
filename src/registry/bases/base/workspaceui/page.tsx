import * as React from "react"

import { cn } from "@/lib/utils"
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb"

export type PageProps = React.ComponentProps<"div">

export type PageHeaderProps = React.ComponentProps<"header">

export type PageHeadingProps = React.ComponentProps<"div">

export type PageVisualProps = React.ComponentProps<"span">

export type PageTitleProps = React.ComponentProps<"h1">

export type PageBreadcrumbsProps = React.ComponentProps<typeof Breadcrumb>

export type PageActionsProps = React.ComponentProps<"div">

export type PageSubtitleProps = React.ComponentProps<"p">

export interface PageContentProps extends React.ComponentProps<"div"> {
  /** Adds padding around the content. Default `false`. */
  padded?: boolean
}

/** The page shell: fills its parent and stacks an optional `Page.Header` over `Page.Content`. */
function PageRoot({ className, ...props }: PageProps) {
  return (
    <div
      data-slot="page"
      className={cn("flex h-full flex-col", className)}
      {...props}
    />
  )
}

/** The `<header>` landmark. Holds `Heading`, `Actions` and `Subtitle`; omit it for a page with no header. */
function PageHeader({ className, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-4 gap-y-1 border-b px-6 py-4",
        className
      )}
      {...props}
    />
  )
}

/** Left side of the header: a row for `Visual`, `Title` or `Breadcrumbs`, and any badge. */
function PageHeading({ className, ...props }: PageHeadingProps) {
  return (
    <div
      data-slot="page-heading"
      className={cn("flex min-w-0 items-center gap-3", className)}
      {...props}
    />
  )
}

/** Decorative visual (icon, image, illustration), hidden from assistive tech. */
function PageVisual({ className, ...props }: PageVisualProps) {
  return (
    <span
      data-slot="page-visual"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

/** The page's `<h1>`. Always render one, with `className="sr-only"` when a `Breadcrumbs` trail is the visible heading. */
function PageTitle({ className, title, children, ...props }: PageTitleProps) {
  return (
    <h1
      data-slot="page-title"
      title={title ?? (typeof children === "string" ? children : undefined)}
      className={cn("truncate text-lg font-semibold", className)}
      {...props}
    >
      {children}
    </h1>
  )
}

/**
 * A breadcrumb trail for the heading. Compose it from the shadcn `Breadcrumb*` items. It
 * renders no heading, so give the page a `Page.Title` too (add `className="sr-only"` to
 * keep it visually hidden).
 */
function PageBreadcrumbs({
  className,
  children,
  ...props
}: PageBreadcrumbsProps) {
  return (
    <Breadcrumb
      data-slot="page-breadcrumbs"
      className={cn("min-w-0", className)}
      {...props}
    >
      <BreadcrumbList className="flex-nowrap [&_[data-slot=breadcrumb-item]]:min-w-0 [&_[data-slot=breadcrumb-link]]:truncate [&_[data-slot=breadcrumb-page]]:truncate">
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/** Right-aligned actions in the header. */
function PageActions({ className, ...props }: PageActionsProps) {
  return (
    <div
      data-slot="page-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

/** Secondary line under the heading. Always renders on its own row, wherever it sits in the header. */
function PageSubtitle({
  className,
  title,
  children,
  ...props
}: PageSubtitleProps) {
  return (
    <p
      data-slot="page-subtitle"
      title={title ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "order-last w-full truncate text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/** The scrollable content area under the header. */
function PageContent({
  padded = false,
  className,
  ...props
}: PageContentProps) {
  return (
    <div
      data-slot="page-content"
      className={cn("flex-1 overflow-auto", padded && "p-6", className)}
      {...props}
    />
  )
}

const Page = {
  Root: PageRoot,
  Header: PageHeader,
  Heading: PageHeading,
  Visual: PageVisual,
  Title: PageTitle,
  Breadcrumbs: PageBreadcrumbs,
  Actions: PageActions,
  Subtitle: PageSubtitle,
  Content: PageContent,
}

export {
  Page,
  PageRoot,
  PageHeader,
  PageHeading,
  PageVisual,
  PageTitle,
  PageBreadcrumbs,
  PageActions,
  PageSubtitle,
  PageContent,
}
