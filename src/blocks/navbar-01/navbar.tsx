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
  description: string
  href: string
}

type NavItem =
  { label: string; href: string } | { label: string; children: SubLink[] }

const NAV: NavItem[] = [
  { label: "Product", href: "#" },
  {
    label: "Solutions",
    children: [
      {
        title: "Analytics",
        description: "Dashboards and reports your whole team can read.",
        href: "#",
      },
      {
        title: "Automation",
        description: "Hand repetitive work to rules and triggers.",
        href: "#",
      },
      {
        title: "Integrations",
        description: "Connect the tools you already use.",
        href: "#",
      },
    ],
  },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
]

const mobileLink =
  "rounded-md py-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

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

function DesktopNav({ className }: { className?: string }) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {NAV.map((item) =>
          "children" in item ? (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-80 gap-1">
                  {item.children.map((child) => (
                    <li key={child.title}>
                      <NavigationMenuLink
                        render={<a href={child.href} />}
                        className="flex-col items-start gap-1"
                      >
                        <span className="font-medium">{child.title}</span>
                        <span className="line-clamp-2 text-muted-foreground">
                          {child.description}
                        </span>
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
                className={`border-b ${mobileLink}`}
              >
                {item.label}
              </a>
            )
          )}
        </nav>
        <SheetFooter>
          <a href="#" className={buttonVariants({ variant: "outline" })}>
            Log in
          </a>
          <a href="#" className={buttonVariants()}>
            Get started
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar01() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <DesktopNav className="ms-auto hidden md:flex" />
        <div className="hidden items-center gap-2 md:flex">
          <a href="#" className={buttonVariants({ variant: "outline" })}>
            Log in
          </a>
          <a href="#" className={buttonVariants()}>
            Get started
          </a>
        </div>
        <MobileNav className="ms-auto md:hidden" />
      </div>
    </header>
  )
}
