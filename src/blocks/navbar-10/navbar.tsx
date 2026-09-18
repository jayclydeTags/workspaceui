"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Facebook01Icon,
  InstagramIcon,
  Linkedin01Icon,
  Menu01Icon,
  NewTwitterIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const LINKS = [
  { label: "Work", href: "#" },
  { label: "Services", href: "#" },
  { label: "Studio", href: "#" },
  { label: "Journal", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
]

const SOCIALS = [
  { label: "Facebook", href: "#", icon: Facebook01Icon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "X", href: "#", icon: NewTwitterIcon },
  { label: "LinkedIn", href: "#", icon: Linkedin01Icon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
]

function Logo() {
  return (
    <a
      href="#"
      className="flex items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground"
      >
        A
      </span>
      Acme
    </a>
  )
}

function SocialLinks() {
  return (
    <ul className="flex gap-1">
      {SOCIALS.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            aria-label={social.label}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <HugeiconsIcon icon={social.icon} strokeWidth={2} />
          </a>
        </li>
      ))}
    </ul>
  )
}

// The whole menu is one full-screen overlay with oversized links — a common
// pattern for studios and portfolios with a handful of top-level pages.
export function Navbar10() {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <a
          href="#"
          className={buttonVariants({
            className: "ms-auto hidden sm:inline-flex",
          })}
        >
          Start a project
        </a>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="max-sm:ms-auto"
              />
            }
          >
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
          </SheetTrigger>
          <SheetContent side="top" className="gap-0 data-[side=top]:h-dvh">
            <SheetHeader className="h-16 justify-center px-4 sm:px-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
            </SheetHeader>
            <nav
              aria-label="Main"
              className="flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto p-4"
            >
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  className="rounded-md px-4 py-1 text-4xl font-semibold tracking-tight text-foreground/80 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-5xl"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center justify-between gap-4 border-t px-4 py-3 sm:px-6">
              <a
                href="mailto:hello@acme.com"
                className="rounded-md text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                hello@acme.com
              </a>
              <SocialLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
