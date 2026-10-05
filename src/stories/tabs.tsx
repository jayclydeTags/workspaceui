"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defineStory } from "@/components/studio/studio"

interface Args {
  variant: "default" | "line"
  orientation: "horizontal" | "vertical"
}

function Preview({ variant, orientation }: Args) {
  return (
    <Tabs defaultValue="account" orientation={orientation} className="w-80">
      <TabsList variant={variant}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          Make changes to your account here.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">
          Change your password here.
        </p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-sm text-muted-foreground">
          Manage your plan and invoices.
        </p>
      </TabsContent>
    </Tabs>
  )
}

export default defineStory<Args>({
  args: { variant: "default", orientation: "horizontal" },
  controls: {
    variant: { type: "select", group: "style", options: ["default", "line"] },
    orientation: {
      type: "select",
      group: "style",
      options: ["horizontal", "vertical"],
    },
  },
  preview: Preview,
})
