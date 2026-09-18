"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const LINKS = [
  { label: "Features", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Blog", href: "#" },
]

function Logo() {
  return (
    <a
      href="#"
      className="flex items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
      >
        A
      </span>
      Acme
    </a>
  )
}

function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className={className}
          />
        }
      >
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={close}
              className="rounded-md border-b py-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <SheetFooter>
          <a href="#" className={buttonVariants()}>
            Download
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// A detached, rounded bar that floats over the page and stays pinned while
// scrolling — put it above the hero rather than inside a bordered header.
export function Navbar05() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex h-14 max-w-4xl items-center gap-4 rounded-full border bg-background/80 ps-5 pe-2 shadow-sm backdrop-blur">
        <Logo />
        <NavigationMenu className="hidden flex-1 md:flex">
          <NavigationMenuList>
            {LINKS.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink
                  render={<a href={link.href} />}
                  className={navigationMenuTriggerStyle()}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <a
          href="#"
          className={buttonVariants({
            className: "hidden rounded-full md:inline-flex",
          })}
        >
          Download
        </a>
        <MobileNav className="ms-auto md:hidden" />
      </div>
    </header>
  )
}
