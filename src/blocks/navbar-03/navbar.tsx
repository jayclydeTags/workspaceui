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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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

interface SubLink {
  title: string
  href: string
}

type NavItem =
  { label: string; href: string } | { label: string; children: SubLink[] }

const NAV: NavItem[] = [
  { label: "Shop", href: "#" },
  { label: "Journal", href: "#" },
  {
    label: "About",
    children: [
      { title: "Our story", href: "#" },
      { title: "Sustainability", href: "#" },
      { title: "Stockists", href: "#" },
    ],
  },
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
      <SheetContent side="left" className="w-full">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          {NAV.map((item) =>
            "children" in item ? (
              <div key={item.label} className="border-b">
                <Accordion>
                  <AccordionItem value={item.label}>
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
              </div>
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
            Visit the store
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Three equal-width columns keep the logo optically centered no matter how
// wide the link group or the actions get.
export function Navbar03() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center">
          <MobileNav className="md:hidden" />
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {NAV.map((item) =>
                "children" in item ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-48 gap-1">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <NavigationMenuLink
                              render={<a href={child.href} />}
                            >
                              {child.title}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink
                      render={<a href={item.href} />}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Logo />
        <div className="flex justify-end">
          <a href="#" className={buttonVariants()}>
            Visit the store
          </a>
        </div>
      </div>
    </header>
  )
}
