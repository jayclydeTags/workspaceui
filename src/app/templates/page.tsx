import type { Metadata } from "next"
import Link from "next/link"

import { templates } from "@/lib/templates"

export const metadata: Metadata = { title: "Templates" }

export default function TemplatesIndex() {
  return (
    <div className="overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete, frontend-only app-shell starters. Browse a template, then download a zip
          you can install and run on its own.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => (
            <Link key={t.slug} href={`/templates/${t.slug}`} className="group block">
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
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {t.type}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
