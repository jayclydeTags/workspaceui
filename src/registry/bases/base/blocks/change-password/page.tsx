"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

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

// ponytail: no backend — a demo current-password stands in for the re-auth check
// so the wrong-current-password error is reachable. Wire the change request when
// integrated; keep the current-password gate (never change a password without it).
const DEMO_CURRENT = "password"

type Errors = { current?: string; next?: string; confirm?: string }

export function ChangePassword() {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const strength = scorePassword(next)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {}
    if (!current) nextErrors.current = "Enter your current password."
    if (!next) nextErrors.next = "Enter a new password."
    else if (strength < 1) nextErrors.next = "Use at least 8 characters."
    else if (next === current) nextErrors.next = "Choose a password you haven't used."
    if (confirm !== next) nextErrors.confirm = "Passwords don't match."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 700))
    setSubmitting(false)
    if (current !== DEMO_CURRENT) {
      setErrors({ current: "That current password is incorrect." })
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Password changed</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Your password was updated. Other sessions have been signed out.
            </p>
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Enter your current password, then choose a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                <Field data-invalid={!!errors.current}>
                  <FieldLabel htmlFor="cp-current">Current password</FieldLabel>
                  <PasswordInput
                    id="cp-current"
                    autoComplete="current-password"
                    value={current}
                    disabled={submitting}
                    aria-invalid={!!errors.current}
                    onChange={(e) => setCurrent(e.target.value)}
                  />
                  {errors.current && <FieldError>{errors.current}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.next}>
                  <FieldLabel htmlFor="cp-next">New password</FieldLabel>
                  <PasswordInput
                    id="cp-next"
                    autoComplete="new-password"
                    showStrength
                    showChecklist
                    value={next}
                    disabled={submitting}
                    aria-invalid={!!errors.next}
                    onChange={(e) => setNext(e.target.value)}
                  />
                  {errors.next && <FieldError>{errors.next}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.confirm}>
                  <FieldLabel htmlFor="cp-confirm">Confirm new password</FieldLabel>
                  <PasswordInput
                    id="cp-confirm"
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
                  <FieldDescription>
                    Changing your password signs out other devices.
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
