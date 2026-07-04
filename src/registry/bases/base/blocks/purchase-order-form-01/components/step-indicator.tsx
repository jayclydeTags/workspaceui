import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const STEPS = ["Details", "Line Items", "Review"] as const

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const isDone = i < currentStep
        const isActive = i === currentStep
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
                isDone && "border-primary bg-primary text-primary-foreground",
                isActive && "border-primary text-primary",
                !isDone && !isActive && "border-border text-muted-foreground"
              )}
            >
              {isDone ? <Check className="size-3" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                isActive ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-8 bg-border" aria-hidden="true" />}
          </div>
        )
      })}
    </div>
  )
}
