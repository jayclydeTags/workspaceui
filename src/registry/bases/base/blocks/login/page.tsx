"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react"

import { Alert, AlertTitle } from "@/components/ui/alert"
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
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: no backend — a single demo credential stands in for the auth call so
// the block can show the success, error, and pending states. Wire to the real
// sign-in request when integrated; keep the state machine.
const DEMO_EMAIL = "demo@acme.com"
const DEMO_PASSWORD = "password"

type Status = "idle" | "submitting" | "error" | "success"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const submitting = status === "submitting"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: { email?: string; password?: string } = {}
    if (!email.trim()) next.email = "Enter your email."
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter a valid email."
    if (!password) next.password = "Enter your password."
    setFieldErrors(next)
    if (next.email || next.password) return

    setStatus("submitting")
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 700))
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setStatus("success")
    } else {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Signed in</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Welcome back — redirecting to your workspace.
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
          <CardHeader className="text-center">
            <CardTitle>Sign in to Acme</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                {status === "error" && (
                  <Alert variant="destructive">
                    <TriangleAlert />
                    <AlertTitle>Incorrect email or password.</AlertTitle>
                  </Alert>
                )}

                <Field data-invalid={!!fieldErrors.email}>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@acme.com"
                    value={email}
                    disabled={submitting}
                    aria-invalid={!!fieldErrors.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {fieldErrors.email && (
                    <FieldError>{fieldErrors.email}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!fieldErrors.password}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <PasswordInput
                    id="login-password"
                    autoComplete="current-password"
                    value={password}
                    disabled={submitting}
                    aria-invalid={!!fieldErrors.password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {fieldErrors.password && (
                    <FieldError>{fieldErrors.password}</FieldError>
                  )}
                </Field>

                <Field orientation="horizontal">
                  <Checkbox id="login-remember" disabled={submitting} />
                  <FieldLabel htmlFor="login-remember" className="font-normal">
                    Remember me for 30 days
                  </FieldLabel>
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && (
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                    )}
                    {submitting ? "Signing in…" : "Sign in"}
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Sign up
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
