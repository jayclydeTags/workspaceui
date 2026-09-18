"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  Copy01Icon,
  EyeIcon,
  EyeOffIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

const MASK_CHAR = "•"
// Caps the dot run so long tokens don't blow out the field width.
const MAX_MASK = 24

/**
 * Masks a secret for display, keeping a type prefix like `sk_live_` and the
 * last `visibleChars` characters so keys stay distinguishable.
 */
export function maskSecret(value: string, visibleChars = 4) {
  const prefix = /^[A-Za-z]+(?:_[A-Za-z]+)*_/.exec(value)?.[0] ?? ""
  const body = value.slice(prefix.length)
  const tailLength = Math.min(
    Math.max(visibleChars, 0),
    Math.floor(body.length / 2)
  )
  const tail = tailLength > 0 ? body.slice(-tailLength) : ""
  const hidden = Math.min(body.length - tail.length, MAX_MASK)
  return prefix + MASK_CHAR.repeat(hidden) + tail
}

export interface SecretFieldProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "type" | "readOnly" | "onChange"
> {
  /** The full secret. Only ever written to the clipboard or shown when revealed. */
  value: string
  /** Show the reveal toggle. Set `false` for write-once secrets that must stay masked. */
  revealable?: boolean
  /** Trailing characters left visible while masked. */
  visibleChars?: number
  /** Called after the secret is written to the clipboard. */
  onCopied?: (value: string) => void
}

export function SecretField({
  value,
  revealable = true,
  visibleChars = 4,
  onCopied,
  className,
  disabled,
  ...props
}: SecretFieldProps) {
  const [revealed, setRevealed] = React.useState(false)
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">(
    "idle"
  )
  const resetTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(resetTimer.current), [])

  async function copy() {
    clearTimeout(resetTimer.current)
    try {
      await navigator.clipboard.writeText(value)
      setCopyState("copied")
      onCopied?.(value)
    } catch {
      setCopyState("error")
    }
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2000)
  }

  const shown = revealed ? value : maskSecret(value, visibleChars)

  return (
    <InputGroup data-slot="secret-field" data-disabled={disabled}>
      <InputGroupInput
        readOnly
        spellCheck={false}
        autoComplete="off"
        value={shown}
        disabled={disabled}
        className={cn("font-mono text-sm", className)}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {revealable && (
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label={revealed ? "Hide secret" : "Show secret"}
            aria-pressed={revealed}
            disabled={disabled}
            onClick={() => setRevealed((r) => !r)}
          >
            <HugeiconsIcon
              icon={revealed ? EyeOffIcon : EyeIcon}
              strokeWidth={2}
            />
          </InputGroupButton>
        )}
        <InputGroupButton
          type="button"
          size="icon-xs"
          aria-label="Copy secret"
          disabled={disabled}
          onClick={copy}
        >
          <HugeiconsIcon
            icon={
              copyState === "copied"
                ? Tick02Icon
                : copyState === "error"
                  ? AlertCircleIcon
                  : Copy01Icon
            }
            strokeWidth={2}
            className={cn(copyState === "error" && "text-destructive")}
          />
        </InputGroupButton>
      </InputGroupAddon>
      <span role="status" className="sr-only">
        {copyState === "copied"
          ? "Copied to clipboard"
          : copyState === "error"
            ? "Couldn't copy to clipboard"
            : ""}
      </span>
    </InputGroup>
  )
}
