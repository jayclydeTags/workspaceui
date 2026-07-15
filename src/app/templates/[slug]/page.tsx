import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getTemplate, parsePage, templateZipPath, templates } from "@/lib/templates"
import { Badge } from "@/components/ui/badge"
import { Screenshots } from "./screenshots"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return { title: getTemplate(slug)?.title }
}

export default async function TemplatePage({ params }: PageProps) {
  const { slug } = await params
  const template = getTemplate(slug)
  if (!template) notFound()

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground">
          ← Templates
        </Link>

        <div className="mt-4 flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{template.title}</h1>
          <Badge variant="secondary">{template.type}</Badge>
          <Badge variant="outline">{template.category}</Badge>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{template.description}</p>

        {/* Prototype order (mobile stack): hero → rail → features → pages. On
            desktop the rail moves to the right column beside the content. */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_18rem]">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <Screenshots screenshots={template.screenshots} title={template.title} />
          </div>

          <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-3">
            <a
              href={templateZipPath(template.slug)}
              download
              className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Download .zip
            </a>
            {template.liveDemoUrl && (
              <a
                href={template.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Live demo ↗
              </a>
            )}

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="text-right font-medium">{template.type}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="text-right font-medium">{template.category}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="text-right font-medium">{template.createdDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Last updated</dt>
                <dd className="text-right font-medium">{template.updatedDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Pages</dt>
                <dd className="text-right font-medium">{template.pages.length}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="text-sm font-semibold">Tech stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {template.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-start-1">
            <h2 className="text-sm font-semibold">Features</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {template.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm text-muted-foreground"
                >
                  <span aria-hidden className="mt-0.5 text-primary">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="lg:col-start-1">
            <h2 className="text-sm font-semibold">Pages included</h2>
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
              {template.pages.map((entry) => {
                const { route, block } = parsePage(entry)
                return (
                  <li
                    key={entry}
                    className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{route}</span>
                    {block && (
                      <span className="text-muted-foreground">
                        from <code className="text-xs">{block}</code>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
