import { HugeiconsIcon } from "@hugeicons/react"
import {
  InformationCircleIcon,
  Alert01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

type CalloutVariant = "default" | "warning" | "destructive"

const icons: Record<CalloutVariant, React.ReactNode> = {
  default: (
    <HugeiconsIcon
      icon={InformationCircleIcon}
      strokeWidth={2}
      className="mt-0.5 size-4 shrink-0"
    />
  ),
  warning: (
    <HugeiconsIcon
      icon={Alert01Icon}
      strokeWidth={2}
      className="mt-0.5 size-4 shrink-0"
    />
  ),
  destructive: (
    <HugeiconsIcon
      icon={AlertCircleIcon}
      strokeWidth={2}
      className="mt-0.5 size-4 shrink-0"
    />
  ),
}

const styles: Record<CalloutVariant, string> = {
  default: "bg-muted/50 border-border text-foreground",
  warning:
    "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
  destructive: "bg-destructive/10 border-destructive/30 text-destructive",
}

interface CalloutProps {
  variant?: CalloutVariant
  className?: string
  children: React.ReactNode
}

export function Callout({
  variant = "default",
  className,
  children,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        styles[variant],
        className
      )}
    >
      {icons[variant]}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
