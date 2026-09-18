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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const LINKS = [
  { label: "Platform", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "Customers", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Company", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
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

function NewsletterForm() {
  const id = React.useId()
  const [submitted, setSubmitted] = React.useState(false)

  if (submitted) {
    return (
      <p role="status" className="text-sm">
        Thanks — check your inbox to confirm your subscription.
      </p>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={id}>Email</FieldLabel>
          <div className="flex gap-2">
            <Input
              id={id}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
            <Button type="submit">Subscribe</Button>
          </div>
          <FieldDescription>
            Product news once a month. Unsubscribe anytime.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

// Full-screen menu split in two: navigation on the left, and a side panel for
// the things a visitor might want instead of a page — updates and contact.
export function Navbar11() {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="ms-auto"
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
            <div className="grid flex-1 overflow-y-auto md:grid-cols-[1fr_minmax(0,26rem)]">
              <nav
                aria-label="Main"
                className="grid content-center gap-x-8 gap-y-2 p-6 sm:grid-cols-2 sm:p-10"
              >
                {LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={close}
                    className="w-fit rounded-md text-3xl font-semibold tracking-tight text-foreground/80 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-4xl"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <aside className="flex flex-col gap-8 bg-muted/50 p-6 sm:p-10">
                <section className="flex flex-col gap-3">
                  <h2 className="font-medium">Subscribe</h2>
                  <NewsletterForm />
                </section>
                <section className="flex flex-col gap-2 text-sm">
                  <h2 className="text-base font-medium">Get in touch</h2>
                  <a
                    href="tel:+18001234567"
                    className="w-fit rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    +1 (800) 123-4567
                  </a>
                  <a
                    href="mailto:hello@acme.com"
                    className="w-fit rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    hello@acme.com
                  </a>
                  <p className="text-muted-foreground">
                    100 Market St, San Francisco, CA
                  </p>
                </section>
                <ul className="mt-auto flex gap-1">
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
              </aside>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
