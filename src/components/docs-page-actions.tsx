"use client"

import { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocsPageActionsProps {
  markdown: string
  prev?: { href: string; title: string }
  next?: { href: string; title: string }
}

export function DocsPageActions({
  markdown,
  prev,
  next,
}: DocsPageActionsProps) {
  const [copied, setCopied] = useState(false)

  async function copyPage() {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ponytail: opens the raw markdown via a Blob URL instead of a shareable
  // `/docs/x.md` route — this site is a static export (no server to answer
  // that request at runtime). Upgrade path: emit `.md` files into `out/` at
  // build time if a persistent link is ever needed.
  function viewAsMarkdown() {
    const url = URL.createObjectURL(
      new Blob([markdown], { type: "text/markdown" })
    )
    window.open(url, "_blank")
  }

  return (
    <div className="flex items-center gap-1.5">
      <ButtonGroup>
        <Button variant="outline" size="sm" onClick={copyPage}>
          {copied ? (
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          ) : (
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          )}
          Copy Page
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="More page formats"
              />
            }
          >
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={viewAsMarkdown}>
              <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
              View as Markdown
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <div className="ms-1 flex items-center gap-1">
        {prev ? (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Previous: ${prev.title}`}
            nativeButton={false}
            render={<Link href={prev.href} />}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="No previous page"
            disabled
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
        )}
        {next ? (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Next: ${next.title}`}
            nativeButton={false}
            render={<Link href={next.href} />}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="No next page"
            disabled
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        )}
      </div>
    </div>
  )
}
