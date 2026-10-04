"use client"

import type { ReactElement, ReactNode } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { StudioLink } from "@/components/studio/types"

// Shared by the component canvas and the block preview so both toolbars look
// and behave the same. Callers wrap the toolbar in a TooltipProvider.

// Icon-only toolbar buttons get a tooltip saying what they do; the aria-label
// stays on the button itself for assistive tech.
export function Tip({
  label,
  render,
  children,
}: {
  label: string
  render: ReactElement
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={render}>{children}</TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}

// Previous/next arrows. `noun` is "component" or "block".
export function NavArrows({
  prev,
  next,
  noun,
}: {
  prev?: StudioLink
  next?: StudioLink
  noun: string
}) {
  return (
    <div className="flex items-center gap-1">
      <NavArrow
        link={prev}
        icon={ArrowLeft01Icon}
        label={`Previous ${noun}`}
        verb="Previous"
      />
      <NavArrow
        link={next}
        icon={ArrowRight01Icon}
        label={`Next ${noun}`}
        verb="Next"
      />
    </div>
  )
}

// Links to the neighbouring page; disabled at either end of the list.
function NavArrow({
  link,
  icon,
  label,
  verb,
}: {
  link?: StudioLink
  icon: typeof ArrowLeft01Icon
  label: string
  verb: string
}) {
  if (!link) {
    return (
      <Button variant="ghost" size="icon-sm" aria-label={label} disabled>
        <HugeiconsIcon icon={icon} strokeWidth={2} />
      </Button>
    )
  }
  return (
    // A real <a>, not a button: this navigates.
    <Tip
      label={`${verb}: ${link.title}`}
      render={
        <Link
          href={link.href}
          aria-label={`${label}: ${link.title}`}
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        />
      }
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} />
    </Tip>
  )
}
