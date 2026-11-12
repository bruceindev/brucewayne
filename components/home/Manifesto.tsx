"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Hourglass, Zap, Bot, BarChart3 } from "lucide-react"
import { stack, type Tone } from "@/lib/content"
import { Glossy, Kicker } from "./ui"

type Token = string | { tone: Tone; icon: React.ReactNode; label: string }

const icon = "h-[55%] w-[55%] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
const text: Token[] = [
  "Eu pego",
  { tone: "orange", icon: <Hourglass className={icon} strokeWidth={2.4} />, label: "trabalho manual" },
  "trabalho manual e repetitivo e transformo em",
  { tone: "blue", icon: <Zap className={icon} strokeWidth={2.4} />, label: "automações" },
  "automações que rodam sozinhas,",
  { tone: "lime", icon: <Bot className={icon} strokeWidth={2.4} />, label: "IA" },
  "agentes de IA que respondem por você e",
  { tone: "pink", icon: <BarChart3 className={icon} strokeWidth={2.4} />, label: "dados" },
  "dados que viram decisão. Da ideia ao produto que fatura — sem acordar ninguém de madrugada.",
]

function Piece({ p, range, children }: { p: MotionValue<number>; range: [number, number]; children: React.ReactNode }) {
  const opacity = useTransform(p, range, [0.12, 1])
  const blur = useTransform(p, range, [8, 0])
  const filter = useTransform(blur, (b) => `blur(${b}px)`)
  return <motion.span style={{ opacity, filter }}>{children}</motion.span>
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] })

  // achata em palavras + chips
  const pieces: (string | Exclude<Token, string>)[] = []
  text.forEach((t) => (typeof t === "string" ? t.split(" ").forEach((w) => pieces.push(w)) : pieces.push(t)))
  const n = pieces.length

  return (
    <section className="relative py-20 md:py-28">
      {/* stack que já rodou em produção */}
      <div className="mx-auto max-w-[1400px] px-5">
        <Kicker className="text-center">Stack que já rodou em produção</Kicker>
        <div className="marquee mt-6 overflow-hidden">
          <div className="marquee-track flex w-max gap-12 pr-12">
            {[...stack, ...stack].map((s, i) => (
              <span key={i} className="whitespace-nowrap text-[19px] font-semibold tracking-[-0.03em] text-ink/35">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div ref={ref} className="mx-auto mt-24 max-w-[980px] px-5 md:mt-36">
        <p
          className="text-balance text-center font-medium tracking-[-0.035em] text-ink"
          style={{ fontSize: "clamp(28px, 4.3vw, 58px)", lineHeight: 1.12 }}
        >
          {pieces.map((piece, i) => {
            const range: [number, number] = [i / n, Math.min(1, (i + 2.5) / n)]
            return (
              <React.Fragment key={i}>
                <Piece p={scrollYProgress} range={range}>
                  {typeof piece === "string" ? (
                    piece
                  ) : (
                    <Glossy
                      tone={piece.tone}
                      className="mx-[0.06em] h-[0.92em] w-[0.92em] align-[-0.12em]"
                      style={{ borderRadius: "30%" }}
                    >
                      <span className="sr-only">{piece.label}</span>
                      {piece.icon}
                    </Glossy>
                  )}
                </Piece>{" "}
              </React.Fragment>
            )
          })}
        </p>
      </div>
    </section>
  )
}
