import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getTemplate, templateZipPath, templates } from "@/lib/templates"

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
    <div className="overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground">
          ← Templates
        </Link>

        <div className="mt-4 flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
              <img
                src={template.screenshots[0]}
                alt={`${template.title} screenshot`}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            <section className="mt-8">
              <h2 className="text-sm font-semibold">Features</h2>
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                {template.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-semibold">Pages included</h2>
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                {template.pages.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="w-full shrink-0 lg:w-72">
            <h1 className="text-2xl font-semibold tracking-tight">{template.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>

            <a
              href={templateZipPath(template.slug)}
              download
              className="mt-4 flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
                Live demo
              </a>
            )}

            <dl className="mt-6 space-y-3 text-sm">
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
                <dt className="text-muted-foreground">Updated</dt>
                <dd className="text-right font-medium">{template.updatedDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Pages</dt>
                <dd className="text-right font-medium">{template.pages.length}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <h2 className="text-sm font-semibold">Tech stack</h2>
              <div className="mt-2 flex flex-wrap gap-2">
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
        </div>
      </div>
    </div>
  )
}
