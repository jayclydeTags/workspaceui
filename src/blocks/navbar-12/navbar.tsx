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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const LINKS = [
  { label: "Menu", href: "#" },
  { label: "Reservations", href: "#" },
  { label: "Private dining", href: "#" },
  { label: "Gift cards", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
]

const SOCIALS = [
  { label: "Facebook", href: "#", icon: Facebook01Icon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "X", href: "#", icon: NewTwitterIcon },
  { label: "LinkedIn", href: "#", icon: Linkedin01Icon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
]

const contactLink =
  "w-fit rounded-sm underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

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

// A wide drawer with large links and contact details at the foot — the page
// behind stays visible, so it reads as a panel rather than a new screen.
export function Navbar12() {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <a
          href="#"
          className={buttonVariants({
            variant: "outline",
            className: "ms-auto hidden sm:inline-flex",
          })}
        >
          Book a table
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
          <SheetContent
            side="right"
            className="w-full overflow-y-auto data-[side=right]:sm:max-w-md"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Main" className="flex flex-col gap-2 px-6 pt-6">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  className="w-fit rounded-md text-3xl font-semibold tracking-tight text-foreground/80 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <SheetFooter className="mt-auto gap-4 px-6 pb-6">
              <address className="flex flex-col gap-1 text-sm not-italic">
                <a href="tel:+18001234567" className={contactLink}>
                  +1 (800) 123-4567
                </a>
                <a href="mailto:hello@acme.com" className={contactLink}>
                  hello@acme.com
                </a>
                <span className="text-muted-foreground">
                  100 Market St, San Francisco, CA
                </span>
              </address>
              <ul className="flex gap-1">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                      })}
                    >
                      <HugeiconsIcon icon={social.icon} strokeWidth={2} />
                    </a>
                  </li>
                ))}
              </ul>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
