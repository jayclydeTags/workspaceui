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
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Customers", href: "#" },
  {
    label: "Company",
    children: [
      { title: "About", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Press", href: "#" },
      { title: "Contact", href: "#" },
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
      <SheetContent side="right" className="w-full">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
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
            Start free trial
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar02() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <NavigationMenu className="hidden flex-1 md:flex">
          <NavigationMenuList>
            {NAV.map((item) =>
              "children" in item ? (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-1">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <NavigationMenuLink render={<a href={child.href} />}>
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
        <a
          href="#"
          className={buttonVariants({ className: "hidden md:inline-flex" })}
        >
          Start free trial
        </a>
        <MobileNav className="ms-auto md:hidden" />
      </div>
    </header>
  )
}
