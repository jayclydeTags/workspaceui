"use client"

import { useState } from "react"
import Link from "next/link"

import { templateUrl, type TemplateMeta } from "@/lib/templates"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Single type-only filter axis (spec #17 / issue #19). `category` is a card
// badge only; a second category filter is the documented growth path, not built.
export function TemplatesGallery({ templates }: { templates: TemplateMeta[] }) {
  const types = ["All", ...new Set(templates.map((t) => t.type))]
  const [active, setActive] = useState("All")

  const visible = active === "All" ? templates : templates.filter((t) => t.type === active)

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActive(type)}
            aria-pressed={active === type}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              active === type
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((t) => (
          <Link key={t.slug} href={templateUrl(t.slug)} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted/30 transition group-hover:border-primary/40">
              <img
                src={t.screenshots[0]}
                alt={`${t.title} preview`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">{t.title}</h3>
                <Badge variant="secondary">{t.type}</Badge>
                <Badge variant="outline">{t.category}</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
