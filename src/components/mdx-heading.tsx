"use client"

import type { ComponentProps } from "react"
import { useCopyButton } from "@fumadocs/base-ui/utils/use-copy-button"
import { CopyCheckIcon, LinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function Heading({
  as: As,
  className,
  children,
  ...props
}: ComponentProps<"h1"> & { as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
  const [isChecked, onCopy] = useCopyButton(() => {
    if (!props.id) return
    const url = new URL(window.location.href)
    url.hash = props.id
    return navigator.clipboard.writeText(url.href)
  })

  if (!props.id) return <As className={className}>{children}</As>

  return (
    <As {...props} className={cn("group/heading flex flex-row items-center gap-1", className)}>
      <a href={`#${props.id}`}>{children}</a>
      <button
        type="button"
        aria-label="Copy anchor link"
        onClick={onCopy}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100"
        )}
      >
        {isChecked ? <CopyCheckIcon /> : <LinkIcon />}
      </button>
    </As>
  )
}
