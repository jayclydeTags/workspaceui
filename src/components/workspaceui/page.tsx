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
}

export interface PageProps {
  /** Page title. Ignored when `breadcrumbs` is set — the last breadcrumb becomes the title. */
  title?: React.ReactNode
  subtitle?: React.ReactNode
  /** Renders a breadcrumb trail in place of the plain title; the last item is the current page. */
  breadcrumbs?: PageBreadcrumb[]
  /** Decorative visual (icon, image, illustration) shown left of the title/breadcrumbs. */
  visual?: React.ReactNode
  /** Shown next to the title, or next to the last breadcrumb when `breadcrumbs` is set. */
  badge?: React.ReactNode
  actions?: React.ReactNode
  /** Set to `false` to omit the header entirely. Default `true`. */
  hasHeader?: boolean
  /** Adds padding to the content area. Default `false`. */
  hasPadding?: boolean
  className?: string
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
}: PageProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
          <div className="flex items-start gap-3">
            {visual}
            <div className="flex flex-col gap-1">
              {breadcrumbs ? (
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, i) => {
                      const isLast = i === breadcrumbs.length - 1
                      return (
                        <React.Fragment key={i}>
                          {i > 0 && <BreadcrumbSeparator />}
                          <BreadcrumbItem>
                            {isLast ? (
                              <span className="flex items-center gap-2">
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                {badge}
                              </span>
                            ) : (
                              <BreadcrumbLink href={crumb.href}>
                                {crumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      )
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{title}</h1>
                  {badge}
                </div>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      )}
      <div className={cn("flex-1 overflow-auto", hasPadding && "p-6")}>
        {children}
      </div>
    </div>
  )
}
