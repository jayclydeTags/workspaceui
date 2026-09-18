"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Image01Icon,
  Menu01Icon,
  Search01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { CART_COUNT, CATEGORY_GROUPS, COLLECTIONS, LINKS } from "./data"

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

function ShopMenu() {
  return (
    <div className="grid w-[min(92vw,56rem)] gap-4 p-2 md:grid-cols-[1fr_1fr_2fr]">
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">
            {group.title}
          </p>
          <ul className="flex flex-col">
            {group.links.map((link) => (
              <li key={link.label}>
                <NavigationMenuLink render={<a href={link.href} />}>
                  {link.label}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <ul className="grid gap-3 sm:grid-cols-2">
        {COLLECTIONS.map((collection) => (
          <li key={collection.title}>
            <NavigationMenuLink
              render={<a href={collection.href} />}
              className="relative flex aspect-4/5 flex-col items-start justify-end gap-1 overflow-hidden bg-muted p-4"
            >
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center text-muted-foreground/40"
              >
                <HugeiconsIcon
                  icon={Image01Icon}
                  strokeWidth={1.5}
                  className="size-10"
                />
              </span>
              <span className="relative font-medium">{collection.title}</span>
              <span className="relative text-muted-foreground">
                {collection.description}
              </span>
              <span className="relative flex items-center gap-1 pt-1 font-medium">
                Shop now
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </span>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
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
      <SheetContent side="left" className="w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          <Accordion>
            {CATEGORY_GROUPS.map((group) => (
              <AccordionItem
                key={group.title}
                value={group.title}
                className="border-b"
              >
                <AccordionTrigger>{group.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-1 pb-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={close}
                          className="block rounded-md px-2 py-2 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
      </SheetContent>
    </Sheet>
  )
}

export function Navbar09() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <MobileNav className="md:hidden" />
        <Logo />
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ShopMenu />
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
        <div className="ms-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Cart, ${CART_COUNT} items`}
            className="relative"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={2} />
            <Badge
              aria-hidden
              className="absolute -end-1 -top-1 h-4 min-w-4 px-1 tabular-nums"
            >
              {CART_COUNT}
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  )
}
