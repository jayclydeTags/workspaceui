"use client"

import { useState } from "react"
import { Check, Copy, Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static demo codes and a client-side download. Wire generation and
// regeneration to your backend when integrated; keep the "saved them" gate so a
// user can't leave without acknowledging.
const INITIAL_CODES = [
  "4X9K-7QP2",
  "B3MN-2WLD",
  "8HJ5-QR41",
  "K2P9-3TVX",
  "9WZ7-6MC0",
  "R5N8-1YQD",
  "T6B4-8KLP",
  "M1V3-5XHJ",
]

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const pick = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `${pick(4)}-${pick(4)}`
}

export function RecoveryCodes() {
  const [codes, setCodes] = useState(INITIAL_CODES)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  function copyAll() {
    navigator.clipboard?.writeText(codes.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function download() {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "acme-recovery-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  function regenerate() {
    setCodes(Array.from({ length: 8 }, randomCode))
    setSaved(false)
  }

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Save your recovery codes</CardTitle>
            <CardDescription>
              Store these somewhere safe. Each code works once if you lose access to
              your authenticator.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="grid grid-cols-2 gap-2 rounded-md border bg-muted/50 p-3 font-mono text-sm">
              {codes.map((code) => (
                <li key={code} className="text-center tracking-wider">
                  {code}
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyAll}>
                {copied ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={download}>
                <Download data-icon="inline-start" />
                Download
              </Button>
              <Button variant="outline" onClick={regenerate} aria-label="Regenerate codes">
                <RefreshCw />
              </Button>
            </div>

            <Field orientation="horizontal">
              <Checkbox
                id="rc-saved"
                checked={saved}
                onCheckedChange={(v) => setSaved(v === true)}
              />
              <FieldLabel htmlFor="rc-saved" className="font-normal">
                I&apos;ve saved my recovery codes
              </FieldLabel>
            </Field>

            <Button className="w-full" disabled={!saved}>
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
