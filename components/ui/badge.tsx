import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "neon"
  dot?: boolean
}

export default function Badge({
  children,
  className,
  variant = "default",
  dot = false,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors pointer-events-none select-none",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "border border-white/8 text-muted-foreground": variant === "outline",
          "bg-neon-lime/10 border border-neon-lime/35 text-neon-lime neon-glow": variant === "neon"
        },
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-black": variant === "default" && !dot,
            "bg-muted-foreground": variant === "outline",
            "bg-neon-lime pulse-neon-dot": variant === "neon" || variant === "default"
          })}
        />
      )}
      {children}
    </span>
  )
}
