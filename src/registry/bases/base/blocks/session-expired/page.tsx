"use client"

import { useState } from "react"
import { Clock, Loader2, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: no backend — a demo password stands in for the re-auth check. Wire it
// to the real re-authentication request and pass the signed-in email in when
// integrated; keep the state machine.
const EMAIL = "alex@acme.com"
const DEMO_PASSWORD = "password"

type Status = "idle" | "submitting" | "error" | "success"

export function SessionExpired() {
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [fieldError, setFieldError] = useState<string>()

  const submitting = status === "submitting"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password) {
      setFieldError("Enter your password.")
      return
    }
    setFieldError(undefined)
    setStatus("submitting")
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 700))
    setStatus(password === DEMO_PASSWORD ? "success" : "error")
  }

  if (status === "success") {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <h1 className="text-sm font-medium">Welcome back</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              You&apos;re signed back in — returning to where you left off.
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
          <CardHeader className="items-center text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted">
              <Clock className="size-5" />
            </div>
            <CardTitle className="mt-2">Session expired</CardTitle>
            <CardDescription>
              You were signed out after a period of inactivity. Enter your password
              to continue as{" "}
              <span className="font-medium text-foreground">{EMAIL}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                {status === "error" && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    <TriangleAlert className="size-4 shrink-0" />
                    Incorrect password.
                  </div>
                )}

                <Field data-invalid={!!fieldError}>
                  <FieldLabel htmlFor="se-password">Password</FieldLabel>
                  <PasswordInput
                    id="se-password"
                    autoComplete="current-password"
                    autoFocus
                    value={password}
                    disabled={submitting}
                    aria-invalid={!!fieldError}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {fieldError && <FieldError>{fieldError}</FieldError>}
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && (
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                    )}
                    {submitting ? "Signing in…" : "Continue"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground"
                  >
                    Sign in as a different user
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
