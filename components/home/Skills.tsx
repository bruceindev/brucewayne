"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { skills } from "@/lib/content"
import { ease, Glossy, H2, Kicker, Reveal, Serif } from "./ui"

export default function Skills() {
  const [active, setActive] = useState(skills[0].id)
  const skill = skills.find((s) => s.id === active)!

  return (
    <section id="habilidades" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 md:grid-cols-12 md:gap-12">
        {/* texto + detalhe */}
        <div className="min-w-0 md:col-span-5">
          <Reveal>
            <Kicker>Habilidades</Kicker>
            <H2 className="mt-4">
              Seis coisas que eu faço <Serif>melhor que a média.</Serif>
            </H2>
          </Reveal>

          <div className="relative mt-8 min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease }}
                className="space-y-4"
              >
                <h3 className="text-[24px] font-medium tracking-[-0.03em] text-ink md:text-[28px]">{skill.title}</h3>
                <p className="max-w-md text-[15px] leading-relaxed text-ink/60">{skill.pitch}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map((t) => (
                    <span key={t} className="rounded-full border border-black/[0.08] bg-paper px-2.5 py-1 text-[12px] text-ink/70">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-[11px] text-ink/45">usado em → {skill.usedIn}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* bandeja escura com tiles */}
        <Reveal className="min-w-0 md:col-span-7" delay={0.1}>
          <div className="rounded-[30px] bg-[#141312] p-3 shadow-[0_30px_80px_-30px_rgba(22,21,19,0.55)] md:p-4">
            <div className="flex items-center justify-between px-2 pb-3 pt-1 font-mono text-[10.5px] text-white/40">
              <span>bruce / superpoderes</span>
              <span>{skills.length} blocos</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3" role="tablist" aria-label="Habilidades">
              {skills.map((s, i) => {
                const on = s.id === active
                return (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(s.id)}
                    onMouseEnter={() => setActive(s.id)}
                    className={`group relative flex flex-col items-center gap-3 rounded-[22px] px-3 pb-4 pt-6 transition-colors duration-300 md:pt-8 ${
                      on ? "bg-white/[0.09] ring-1 ring-white/15" : "bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <motion.span
                      animate={on ? { scale: 1.06, rotate: i % 2 ? 3 : -3 } : { scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="block"
                    >
                      <Glossy tone={s.tone} className="h-[78px] w-[78px] md:h-[96px] md:w-[96px]">
                        <span className="text-[26px] font-bold tracking-[-0.04em] [text-shadow:0_2px_6px_rgba(0,0,0,0.35)] md:text-[32px]">
                          {s.glyph}
                        </span>
                      </Glossy>
                    </motion.span>
                    <span className={`text-center text-[12px] leading-tight transition-colors ${on ? "text-white" : "text-white/45"}`}>
                      {s.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
