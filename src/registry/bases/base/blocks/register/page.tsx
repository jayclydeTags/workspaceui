"use client"

import { useState } from "react"
import { Loader2, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: strength is a 0–3 heuristic (length + character classes), enough to
// drive the meter and gate weak passwords. Swap for zxcvbn if real entropy
// scoring is needed — keep the 0–3 scale the meter reads.
function scorePassword(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
  return score as 0 | 1 | 2 | 3
}

const STRENGTH = ["Too weak", "Weak", "Good", "Strong"] as const

type Errors = { name?: string; email?: string; password?: string; terms?: string }

export function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const strength = scorePassword(password)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!name.trim()) next.name = "Enter your name."
    if (!email.trim()) next.email = "Enter your email."
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter a valid email."
    if (!password) next.password = "Enter a password."
    else if (strength < 1) next.password = "Use at least 8 characters."
    if (!terms) next.terms = "Accept the terms to continue."
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 700))
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Verify your email</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{email}</span>. Open it
              to activate your account.
            </p>
            <Button variant="ghost" className="mt-4 text-muted-foreground">
              Resend email
            </Button>
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Start your 14-day free trial</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="reg-name">Full name</FieldLabel>
                  <Input
                    id="reg-name"
                    autoComplete="name"
                    placeholder="Alex Rivera"
                    value={name}
                    disabled={submitting}
                    aria-invalid={!!errors.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="reg-email">Email</FieldLabel>
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@acme.com"
                    value={email}
                    disabled={submitting}
                    aria-invalid={!!errors.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="reg-password">Password</FieldLabel>
                  <Input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    disabled={submitting}
                    aria-invalid={!!errors.password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <div className="flex items-center gap-2" aria-live="polite">
                      <div className="flex flex-1 gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full",
                              i < strength ? "bg-primary" : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {STRENGTH[strength]}
                      </span>
                    </div>
                  )}
                  {errors.password ? (
                    <FieldError>{errors.password}</FieldError>
                  ) : (
                    <FieldDescription>
                      At least 8 characters, with a mix of cases, numbers, and symbols.
                    </FieldDescription>
                  )}
                </Field>

                <Field data-invalid={!!errors.terms}>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="reg-terms"
                      checked={terms}
                      disabled={submitting}
                      aria-invalid={!!errors.terms}
                      onCheckedChange={(v) => setTerms(v === true)}
                    />
                    <FieldLabel htmlFor="reg-terms" className="font-normal">
                      I agree to the{" "}
                      <a href="#" className="underline underline-offset-4">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline underline-offset-4">
                        Privacy Policy
                      </a>
                    </FieldLabel>
                  </div>
                  {errors.terms && <FieldError>{errors.terms}</FieldError>}
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && (
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                    )}
                    {submitting ? "Creating account…" : "Create account"}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Sign in
                    </a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
