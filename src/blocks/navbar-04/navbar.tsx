"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SubLink {
  title: string
  href: string
}

type NavItem =
  { label: string; href: string } | { label: string; children: SubLink[] }

const NAV: NavItem[] = [
  { label: "Home", href: "#" },
  {
    label: "Services",
    children: [
      { title: "Strategy", href: "#" },
      { title: "Design", href: "#" },
      { title: "Engineering", href: "#" },
    ],
  },
  { label: "Work", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
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

// The menu button is the only navigation at every width — suited to sites
// with few pages, where a link row would feel sparse.
export function Navbar04() {
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
          Book a call
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
          <SheetContent side="right" className="w-full">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Main" className="flex flex-col px-4">
              {NAV.map((item) =>
                "children" in item ? (
                  <Accordion key={item.label}>
                    <AccordionItem value={item.label} className="border-b">
                      <AccordionTrigger>{item.label}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col gap-1 pb-2">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <a
                                href={child.href}
                                onClick={close}
                                className="block rounded-md px-2 py-2 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                              >
                                {child.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    className="rounded-md border-b py-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>
            <SheetFooter>
              <a href="#" className={buttonVariants()}>
                Book a call
              </a>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
