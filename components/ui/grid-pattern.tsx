import React from "react"

interface GridPatternProps {
  type?: "grid" | "dot"
  className?: string
}

export default function GridPattern({
  type = "grid",
  className = ""
}: GridPatternProps) {
  return (
    <div className={`absolute inset-0 -z-10 pointer-events-none select-none ${className}`}>
      {/* Background patterns defined in globals.css */}
      <div
        className={`absolute inset-0 ${
          type === "grid" ? "bg-grid-pattern" : "bg-dot-pattern"
        }`}
      />
      {/* Vignette/Fade overlay so grid smoothly transitions into content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-lime/5 via-transparent to-transparent" />
    </div>
  )
}
