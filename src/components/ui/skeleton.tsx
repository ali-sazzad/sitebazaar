import { cn } from "@/lib/utils"

// Rendered as a block-level <span> so it is valid inside text elements like <p> too.
function Skeleton({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("block animate-pulse rounded-md bg-ink/10 motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
