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

import { COMPANY_GROUPS, FEATURES, type MenuLink } from "./data"

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

function MenuLinkItem({ title, description, href, icon }: MenuLink) {
  return (
    <li>
      <NavigationMenuLink
        render={<a href={href} />}
        className="items-start gap-3"
      >
        <HugeiconsIcon
          icon={icon}
          strokeWidth={2}
          className="mt-0.5 shrink-0 text-muted-foreground"
        />
        <span className="flex flex-col gap-1">
          <span className="leading-none font-medium">{title}</span>
          <span className="line-clamp-2 text-muted-foreground">
            {description}
          </span>
        </span>
      </NavigationMenuLink>
    </li>
  )
}

function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)
  const sections = [{ title: "Features", links: FEATURES }, ...COMPANY_GROUPS]

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
      <SheetContent side="right" className="w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          <Accordion>
            {sections.map((section) => (
              <AccordionItem
                key={section.title}
                value={section.title}
                className="border-b"
              >
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-1 pb-2">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          onClick={close}
                          className="block rounded-md px-2 py-2 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <a
            href="#"
            onClick={close}
            className="rounded-md border-b py-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Pricing
          </a>
        </nav>
        <SheetFooter>
          <a href="#" className={buttonVariants({ variant: "outline" })}>
            Log in
          </a>
          <a href="#" className={buttonVariants()}>
            Sign up
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Panels open under their trigger (aligned to the end, since the links sit on
// the right) instead of spanning the page like a mega menu.
export function Navbar08() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <NavigationMenu align="end" className="ms-auto hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-80 flex-col gap-1">
                  {FEATURES.map((link) => (
                    <MenuLinkItem key={link.title} {...link} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<a href="#" />}
                className={navigationMenuTriggerStyle()}
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Company</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[min(92vw,34rem)] gap-2 md:grid-cols-2">
                  {COMPANY_GROUPS.map((group) => (
                    <div key={group.title} className="flex flex-col gap-1 p-1">
                      <p className="px-2 pt-1 pb-1 text-xs font-medium text-muted-foreground">
                        {group.title}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {group.links.map((link) => (
                          <MenuLinkItem key={link.title} {...link} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden items-center gap-2 md:flex">
          <a href="#" className={buttonVariants({ variant: "outline" })}>
            Log in
          </a>
          <a href="#" className={buttonVariants()}>
            Sign up
          </a>
        </div>
        <MobileNav className="ms-auto md:hidden" />
      </div>
    </header>
  )
}
