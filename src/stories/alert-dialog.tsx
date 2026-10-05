"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  confirm: string
  size: "default" | "sm"
}

function Preview({ title, description, confirm, size }: Args) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Delete account
      </AlertDialogTrigger>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>{confirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default defineStory<Args>({
  args: {
    title: "Are you absolutely sure?",
    description:
      "This action cannot be undone. This will permanently delete your account.",
    confirm: "Continue",
    size: "default",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    confirm: { type: "text", label: "Confirm label" },
    size: { type: "select", group: "style", options: ["default", "sm"] },
  },
  preview: Preview,
})
