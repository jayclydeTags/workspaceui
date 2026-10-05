"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  icon: boolean
  variant: "default" | "destructive" | "info"
}

function Preview({ title, description, icon, variant }: Args) {
  return (
    <Alert variant={variant} className="max-w-md">
      {icon && (
        <HugeiconsIcon
          icon={variant === "default" ? InformationCircleIcon : Alert02Icon}
          strokeWidth={2}
        />
      )}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
}

export default defineStory<Args>({
  args: {
    title: "Heads up!",
    description: "You can add components to your app using the CLI.",
    icon: true,
    variant: "default",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    icon: { type: "boolean" },
    variant: {
      type: "select",
      group: "style",
      options: ["default", "destructive", "info"],
    },
  },
  preview: Preview,
})
