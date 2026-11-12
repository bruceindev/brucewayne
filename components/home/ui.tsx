"use client"

import React from "react"
import { motion } from "framer-motion"
import { toneBg, type Tone } from "@/lib/content"

export const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

export function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/40 ${className}`}>{children}</p>
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 18,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Glossy({
  tone,
  children,
  className = "",
  style,
}: {
  tone: Tone
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={`glossy inline-flex items-center justify-center overflow-hidden text-white ${className}`}
      style={{ background: toneBg[tone], ...style }}
    >
      {children}
    </span>
  )
}

export function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`text-balance font-medium tracking-[-0.04em] text-ink ${className}`}
      style={{ fontSize: "clamp(34px, 5vw, 68px)", lineHeight: 1 }}
    >
      {children}
    </h2>
  )
}

export function Serif({ children }: { children: React.ReactNode }) {
  return <span className="font-serif font-normal italic tracking-[-0.02em]">{children}</span>
}
