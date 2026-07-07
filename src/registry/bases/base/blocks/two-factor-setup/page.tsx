"use client"

import { useRef, useState } from "react"
import { Check, Copy, Loader2, ShieldCheck, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: fixed demo secret and matching code so the enroll + verify flow works
// without a backend. Wire the secret/QR from your TOTP provisioning and verify
// against the server when integrated.
const SECRET = "JBSW Y3DP EHPK 3PXP"
const DEMO_CODE = "123456"

// ponytail: a decorative QR-ish grid stands in for the real provisioning QR so we
// don't pull a QR library. Render the actual otpauth:// QR here when integrated.
function QrPlaceholder() {
  const cells = Array.from({ length: 49 }, (_, i) => (i * 7 + 3) % 5 < 2)
  return (
    <div
      aria-hidden="true"
      className="grid size-32 grid-cols-7 gap-0.5 rounded-md border bg-background p-2"
    >
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-foreground" : "bg-transparent"} />
      ))}
    </div>
  )
}

type Status = "idle" | "verifying" | "error" | "success"

export function TwoFactorSetup() {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [copied, setCopied] = useState(false)
  const submitted = useRef(false)

  async function verify(value: string) {
    if (submitted.current) return
    submitted.current = true
    setStatus("verifying")
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 600))
    if (value === DEMO_CODE) {
      setStatus("success")
    } else {
      setStatus("error")
      setCode("")
      submitted.current = false
    }
  }

  function onChange(value: string) {
    if (status === "error") setStatus("idle")
    setCode(value)
    if (value.length === 6) verify(value)
  }

  function copySecret() {
    navigator.clipboard?.writeText(SECRET.replace(/\s/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (status === "success") {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Two-factor enabled</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Your authenticator app is now set up. We&apos;ll ask for a code at
              each sign-in.
            </p>
            <Button className="mt-4 w-full max-w-xs">View recovery codes</Button>
          </div>
        </div>
      </Page>
    )
  }

  const verifying = status === "verifying"

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Set up two-factor auth</CardTitle>
            <CardDescription>
              Scan the QR code with your authenticator app, then enter the code it
              shows
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <QrPlaceholder />

            <div className="w-full">
              <p className="mb-1 text-center text-xs text-muted-foreground">
                Or enter this key manually
              </p>
              <button
                type="button"
                onClick={copySecret}
                className="flex w-full items-center justify-center gap-2 rounded-md border bg-muted/50 px-3 py-2 font-mono text-sm tracking-wider hover:bg-muted"
              >
                {SECRET}
                {copied ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5 text-muted-foreground" />
                )}
                <span className="sr-only">Copy setup key</span>
              </button>
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">Enter the 6-digit code</p>
              <InputOTP
                maxLength={6}
                value={code}
                disabled={verifying}
                onChange={onChange}
                aria-invalid={status === "error"}
                aria-label="Authenticator code"
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} aria-invalid={status === "error"} />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <div className="h-5 text-sm" aria-live="polite">
                {verifying && (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Verifying…
                  </span>
                )}
                {status === "error" && (
                  <span className="flex items-center gap-2 text-destructive" role="alert">
                    <TriangleAlert className="size-4" />
                    That code didn&apos;t match. Try again.
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
