"use client"

import { useState } from "react"
import { Loader2, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: no backend — a single demo credential drives the states and the SSO
// buttons are inert. Wire the OAuth handlers and the sign-in request when
// integrated; keep the state machine.
const DEMO_EMAIL = "demo@acme.com"
const DEMO_PASSWORD = "password"

// ponytail: lucide has no Google mark; inline the multicolor G so the button
// reads as Google without pulling a brand-icon dependency.
function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

// ponytail: lucide dropped its GitHub brand mark; inline it (currentColor) so the
// button matches theme.
function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-1.86c-3.06.67-3.71-1.48-3.71-1.48-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.19.7-1.46-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.15-5.03 5.42.4.34.75 1.01.75 2.04v3.03c0 .29.2.63.76.53A11 11 0 0 0 12 1Z" />
    </svg>
  )
}

type Status = "idle" | "submitting" | "error" | "success"

export function LoginSocial() {
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
    setStatus(email === DEMO_EMAIL && password === DEMO_PASSWORD ? "success" : "error")
  }

  if (status === "success") {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <h1 className="text-sm font-medium">Signed in</h1>
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
            <CardDescription>Continue with a provider or your email</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" disabled={submitting}>
                  <GoogleIcon data-icon="inline-start" />
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full" disabled={submitting}>
                  <GithubIcon data-icon="inline-start" />
                  Continue with GitHub
                </Button>
              </div>

              <FieldSeparator>or</FieldSeparator>

              <form onSubmit={onSubmit} noValidate>
                <FieldGroup>
                  {status === "error" && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                      <TriangleAlert className="size-4 shrink-0" />
                      Incorrect email or password.
                    </div>
                  )}

                  <Field data-invalid={!!fieldErrors.email}>
                    <FieldLabel htmlFor="ls-email">Email</FieldLabel>
                    <Input
                      id="ls-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@acme.com"
                      value={email}
                      disabled={submitting}
                      aria-invalid={!!fieldErrors.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
                  </Field>

                  <Field data-invalid={!!fieldErrors.password}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="ls-password">Password</FieldLabel>
                      <a
                        href="#"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <PasswordInput
                      id="ls-password"
                      autoComplete="current-password"
                      value={password}
                      disabled={submitting}
                      aria-invalid={!!fieldErrors.password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
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
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
