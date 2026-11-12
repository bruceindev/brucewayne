"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Check } from "lucide-react"
import { goals, type GoalStatus } from "@/lib/content"
import { getWhatsAppUrl } from "@/config/site"
import { ease, H2, Kicker, Reveal, Serif } from "./ui"

const statusLabel: Record<GoalStatus, string> = { done: "feito", doing: "fazendo", next: "próximo" }

function Dot({ s }: { s: GoalStatus }) {
  if (s === "done")
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grass text-white">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    )
  if (s === "doing")
    return (
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-amber-500">
        <span className="h-2.5 w-2.5 rounded-full bg-[conic-gradient(#f59e0b_0_50%,transparent_50%_100%)]" />
      </span>
    )
  return <span className="h-5 w-5 shrink-0 rounded-full border-[1.5px] border-dashed border-ink/25" />
}

export default function Goals() {
  const done = goals.filter((g) => g.status === "done").length
  const doing = goals.filter((g) => g.status === "doing").length
  const pct = Math.round(((done + doing * 0.5) / goals.length) * 100)

  return (
    <section id="metas" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:grid-cols-12 md:gap-12">
        <Reveal className="min-w-0 md:col-span-5">
          <Kicker>Metas</Kicker>
          <H2 className="mt-4">
            Metas públicas <Serif>cobram mais.</Serif>
          </H2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
            Meta escondida não cobra ninguém. Essas são as minhas pros próximos meses — se você pode ajudar com alguma delas, a gente já tem assunto.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-transform active:scale-95"
          >
            Me ajuda com uma dessas
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <Reveal className="min-w-0 md:col-span-7" delay={0.08}>
          <div className="rounded-[28px] bg-paper p-2 shadow-[0_20px_60px_-35px_rgba(40,30,10,0.4)]">
            <div className="flex items-center justify-between rounded-[22px] bg-cream/70 px-5 py-4">
              <div>
                <p className="font-mono text-[10.5px] text-ink/45">roadmap / bruce</p>
                <p className="mt-0.5 text-[17px] font-medium tracking-[-0.02em] text-ink">v2026 → v2027</p>
              </div>
              <div className="w-[42%] max-w-[220px]">
                <div className="flex justify-between font-mono text-[10.5px] text-ink/45">
                  <span>progresso</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/[0.07]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2, ease }}
                    className="h-full rounded-full bg-grass"
                  />
                </div>
              </div>
            </div>

            <ul className="divide-y divide-black/[0.05] px-3 py-1">
              {goals.map((g, i) => (
                <motion.li
                  key={g.title}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease }}
                  className="flex items-center gap-4 px-2 py-3.5"
                >
                  <Dot s={g.status} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[15px] leading-tight tracking-[-0.01em] ${g.status === "done" ? "text-ink/50 line-through decoration-ink/25" : "text-ink"}`}>
                      {g.title}
                    </p>
                    <p className="mt-0.5 truncate text-[12.5px] text-ink/45">{g.note}</p>
                  </div>
                  <span
                    className={`hidden rounded-full px-2 py-0.5 font-mono text-[10px] sm:inline ${
                      g.status === "done"
                        ? "bg-grass/10 text-grass"
                        : g.status === "doing"
                          ? "bg-amber-500/10 text-amber-700"
                          : "bg-ink/[0.05] text-ink/45"
                    }`}
                  >
                    {statusLabel[g.status]}
                  </span>
                  <span className="w-12 shrink-0 text-right font-mono text-[11px] text-ink/40">{g.when}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
