import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface PageBreadcrumb {
  label: string
  href?: string
  /** Overrides the rendered element (e.g. a router `Link`) — forwarded to the underlying `BreadcrumbLink`. */
  render?: React.ComponentProps<typeof BreadcrumbLink>["render"]
}

export interface PageProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children"
> {
  /** Page title. Ignored when `breadcrumbs` is set — the last breadcrumb becomes the title. */
  title?: React.ReactNode
  subtitle?: React.ReactNode
  /**
   * Renders a breadcrumb trail in place of the plain title; the last item is the current page.
   */
  breadcrumbs?: PageBreadcrumb[]
  /** Decorative visual (icon, image, illustration) shown left of the title/breadcrumbs. */
  visual?: React.ReactNode
  /** Shown next to the title, or next to the last breadcrumb when `breadcrumbs` is set. */
  badge?: React.ReactNode
  actions?: React.ReactNode
  /**
   * Set to `false` to omit the header entirely. Default `true`. The page then has no
   * `<h1>` — render your own heading in `children` if the page still needs one.
   */
  hasHeader?: boolean
  /** Adds padding to the content area. Default `false`. */
  hasPadding?: boolean
  children?: React.ReactNode
}

export function Page({
  title,
  subtitle,
  breadcrumbs,
  visual,
  badge,
  actions,
  hasHeader = true,
  hasPadding = false,
  className,
  children,
  ...props
}: PageProps) {
  return (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      {hasHeader && (
        <header className="flex flex-col gap-1 border-b px-6 py-4">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <div className="flex min-w-0 items-center gap-3">
              {visual && (
                <span aria-hidden="true" className="shrink-0">
                  {visual}
                </span>
              )}
              {breadcrumbs ? (
                <>
                  <h1 className="sr-only">
                    {breadcrumbs[breadcrumbs.length - 1]?.label}
                  </h1>
                  <Breadcrumb className="min-w-0">
                    <BreadcrumbList className="flex-nowrap">
                      {breadcrumbs.map((crumb, i) => {
                        const isLast = i === breadcrumbs.length - 1
                        return (
                          <React.Fragment key={i}>
                            {i > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem className="min-w-0">
                              {isLast ? (
                                <BreadcrumbPage
                                  title={crumb.label}
                                  className="truncate"
                                >
                                  {crumb.label}
                                </BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink
                                  href={crumb.href}
                                  render={crumb.render}
                                  title={crumb.label}
                                  className="truncate"
                                >
                                  {crumb.label}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </React.Fragment>
                        )
                      })}
                    </BreadcrumbList>
                  </Breadcrumb>
                </>
              ) : (
                <h1
                  title={typeof title === "string" ? title : undefined}
                  className="truncate text-lg font-semibold"
                >
                  {title}
                </h1>
              )}
              {badge}
            </div>
            {actions && (
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            )}
          </div>
          {subtitle && (
            <p
              title={typeof subtitle === "string" ? subtitle : undefined}
              className="truncate text-sm text-muted-foreground"
            >
              {subtitle}
            </p>
          )}
        </header>
      )}
      <div className={cn("flex-1 overflow-auto", hasPadding && "p-6")}>
        {children}
      </div>
    </div>
  )
}
