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

import { FOOTER_LINKS, LINKS, PLATFORM_GROUPS, type MenuLink } from "./data"

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

function PlatformMenu() {
  return (
    <div className="flex w-[min(92vw,60rem)] flex-col">
      <div className="grid gap-2 p-1 md:grid-cols-3">
        {PLATFORM_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-1 p-2">
            <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">
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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
        <p className="px-1 text-sm">
          New to Acme?{" "}
          <a
            href="#"
            className="rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Start a free trial
          </a>
        </p>
        <ul className="flex flex-wrap gap-1">
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <NavigationMenuLink render={<a href={link.href} />}>
                <HugeiconsIcon icon={link.icon} strokeWidth={2} />
                {link.label}
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
      <SheetContent side="right" className="w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          <div className="border-b">
            <Accordion>
              <AccordionItem value="platform">
                <AccordionTrigger>Platform</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pb-2">
                    {PLATFORM_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="px-2 text-xs font-medium text-muted-foreground">
                          {group.title}
                        </p>
                        <ul className="flex flex-col">
                          {group.links.map((link) => (
                            <li key={link.title}>
                              <a
                                href={link.href}
                                onClick={close}
                                className="block rounded-md px-2 py-2 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                              >
                                {link.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
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
          <a href="#" className={buttonVariants({ variant: "outline" })}>
            Contact sales
          </a>
          <a href="#" className={buttonVariants()}>
            Start free trial
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar07() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
              <NavigationMenuContent>
                <PlatformMenu />
              </NavigationMenuContent>
            </NavigationMenuItem>
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
        <div className="ms-auto hidden items-center gap-2 md:flex">
          <a href="#" className={buttonVariants({ variant: "outline" })}>
            Contact sales
          </a>
          <a href="#" className={buttonVariants()}>
            Start free trial
          </a>
        </div>
        <MobileNav className="ms-auto md:hidden" />
      </div>
    </header>
  )
}
