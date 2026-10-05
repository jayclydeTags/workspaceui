"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { defineStory } from "@/components/studio/studio"

interface Args {
  length: number
  separator: boolean
  disabled: boolean
}

function Preview({ length, separator, disabled }: Args) {
  const count = Math.min(Math.max(length, 2), 8)
  const half = Math.ceil(count / 2)
  const slots = Array.from({ length: count }, (_, i) => i)
  return (
    // maxLength is fixed at mount, so a new length remounts the field.
    <InputOTP
      key={count}
      maxLength={count}
      disabled={disabled}
      aria-label="One-time code"
    >
      {separator ? (
        <>
          <InputOTPGroup>
            {slots.slice(0, half).map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {slots.slice(half).map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </>
      ) : (
        <InputOTPGroup>
          {slots.map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      )}
    </InputOTP>
  )
}

export default defineStory<Args>({
  args: { length: 6, separator: true, disabled: false },
  controls: {
    length: {
      type: "number",
      min: 2,
      max: 8,
      description: "Number of digits.",
    },
    separator: {
      type: "boolean",
      group: "style",
      description: "Split into two groups.",
    },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
