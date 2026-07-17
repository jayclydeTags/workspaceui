"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
} from "lucide-react"

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

export function DocsPageActions({ markdown, prev, next }: DocsPageActionsProps) {
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
          {copied ? <Check /> : <Copy />}
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
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={viewAsMarkdown}>
              <FileText />
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
            <ChevronLeft />
          </Button>
        ) : (
          <Button variant="outline" size="icon-sm" aria-label="No previous page" disabled>
            <ChevronLeft />
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
            <ChevronRight />
          </Button>
        ) : (
          <Button variant="outline" size="icon-sm" aria-label="No next page" disabled>
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  )
}
