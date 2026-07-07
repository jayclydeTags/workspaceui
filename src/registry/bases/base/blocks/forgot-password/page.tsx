"use client"

import { useState } from "react"
import { ArrowLeft, Loader2, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: no backend — submit just flips to the sent state. Wire to the real
// reset-request endpoint when integrated; keep the neutral "if an account
// exists" copy so the form doesn't leak which emails are registered.
export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Enter your email.")
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email.")
      return
    }
    setError(undefined)
    setSubmitting(true)
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 700))
    setSubmitting(false)
    setSent(true)
  }

  if (sent) {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Check your email</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              If an account exists for{" "}
              <span className="font-medium text-foreground">{email}</span>, we sent
              a link to reset your password.
            </p>
            <Button
              variant="ghost"
              className="mt-4 text-muted-foreground"
              onClick={() => setSent(false)}
            >
              Use a different email
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
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="fp-email">Email</FieldLabel>
                  <Input
                    id="fp-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@acme.com"
                    value={email}
                    disabled={submitting}
                    aria-invalid={!!error}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <FieldError>{error}</FieldError>}
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && (
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                    )}
                    {submitting ? "Sending…" : "Send reset link"}
                  </Button>
                  <FieldDescription className="text-center">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                    >
                      <ArrowLeft className="size-3" />
                      Back to sign in
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
