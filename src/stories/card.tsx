"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  action: boolean
  footer: boolean
  size: "default" | "sm"
}

function Preview({ title, description, action, footer, size }: Args) {
  return (
    <Card size={size} className="w-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && (
          <CardAction>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Card content goes here.</p>
      </CardContent>
      {footer && (
        <CardFooter>
          <Button size="sm">Save</Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default defineStory<Args>({
  args: {
    title: "Project settings",
    description: "Manage how this project behaves.",
    action: true,
    footer: true,
    size: "default",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    action: { type: "boolean", description: "A CardAction in the header." },
    footer: { type: "boolean", description: "A CardFooter." },
    size: { type: "select", group: "style", options: ["default", "sm"] },
  },
  preview: Preview,
})
