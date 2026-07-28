"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon, Copy01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

export function CopyButton({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={copy}
      className={className}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5" />
      ) : (
        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
      )}
    </Button>
  )
}
