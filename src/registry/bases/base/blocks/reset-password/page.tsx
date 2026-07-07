"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, LinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  PasswordInput,
  scorePassword,
} from "@/registry/bases/base/workspaceui/password-input"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: the demo renders the valid-token form. Flip TOKEN_VALID (or replace
// it with the result of your reset-token check) to show the expired-link state
// when integrated.
const TOKEN_VALID = true

type Errors = { password?: string; confirm?: string }

export function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const strength = scorePassword(password)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!password) next.password = "Enter a new password."
    else if (strength < 1) next.password = "Use at least 8 characters."
    if (confirm !== password) next.confirm = "Passwords don't match."
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 700))
    setSubmitting(false)
    setDone(true)
  }

  if (!TOKEN_VALID) {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
              <LinkIcon className="size-5 text-destructive" />
            </div>
            <h1 className="mt-4 text-sm font-medium" role="alert">
              Reset link expired
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              This password-reset link is no longer valid. Request a new one to
              continue.
            </p>
            <Button className="mt-4 w-full max-w-xs">Request a new link</Button>
          </div>
        </div>
      </Page>
    )
  }

  if (done) {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Password updated</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Your password has been changed. You can now sign in with it.
            </p>
            <Button className="mt-4 w-full max-w-xs">Continue to sign in</Button>
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
            <CardTitle>Set a new password</CardTitle>
            <CardDescription>
              Choose a strong password you haven&apos;t used before
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="rp-password">New password</FieldLabel>
                  <PasswordInput
                    id="rp-password"
                    autoComplete="new-password"
                    showStrength
                    showChecklist
                    value={password}
                    disabled={submitting}
                    aria-invalid={!!errors.password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <FieldError>{errors.password}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.confirm}>
                  <FieldLabel htmlFor="rp-confirm">Confirm password</FieldLabel>
                  <PasswordInput
                    id="rp-confirm"
                    autoComplete="new-password"
                    value={confirm}
                    disabled={submitting}
                    aria-invalid={!!errors.confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  {errors.confirm && <FieldError>{errors.confirm}</FieldError>}
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && (
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                    )}
                    {submitting ? "Updating…" : "Update password"}
                  </Button>
                  <FieldDescription className="text-center">
                    Passwords are encrypted and never shared.
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
