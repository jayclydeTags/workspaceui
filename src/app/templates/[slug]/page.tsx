import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ChevronLeft, ExternalLink } from "lucide-react"

import { getTemplate, parsePage, templates } from "@/lib/templates"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemMedia } from "@/components/ui/item"
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
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          nativeButton={false}
          render={<Link href="/templates" />}
        >
          <ChevronLeft />
          Templates
        </Button>

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
            {template.liveDemoUrl && (
              <Button
                variant="secondary"
                className="w-full"
                nativeButton={false}
                render={
                  <a href={template.liveDemoUrl} target="_blank" rel="noreferrer" />
                }
              >
                Live demo
                <ExternalLink />
              </Button>
            )}

            <dl className={cn("space-y-3 text-sm", template.liveDemoUrl ? "mt-6 border-t border-border pt-6" : "")}>
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
                  <Badge key={tech} variant="outline" className="rounded-full">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-start-1">
            <h2 className="text-sm font-semibold">Features</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {template.features.map((f) => (
                <Item key={f} variant="muted" size="sm" render={<li />}>
                  <ItemMedia variant="icon" className="text-primary">
                    <Check />
                  </ItemMedia>
                  <ItemContent className="text-sm text-muted-foreground">{f}</ItemContent>
                </Item>
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
