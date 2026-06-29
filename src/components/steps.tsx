import { cn } from "@/lib/utils"

export function Steps({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "steps ml-4 border-l border-border pl-8 [counter-reset:step]",
        className
      )}
      {...props}
    />
  )
}

export function Step({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "step relative mt-8 font-semibold text-base first:mt-0",
        className
      )}
      {...props}
    />
  )
}
