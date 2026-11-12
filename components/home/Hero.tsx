"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import Pasture from "@/components/pasture/Pasture"
import { siteConfig, getWhatsAppUrl } from "@/config/site"
import { ease, Serif } from "./ui"

const line = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: (i: number) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease } }),
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const [progress, setProgress] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(Math.round(v * 100) / 100))

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 md:pt-36">
      <div className="relative z-10 mx-auto max-w-6xl px-5 text-center">
        <motion.div variants={line} initial="hidden" animate="show" custom={0} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-paper/70 px-3 py-1 text-[12.5px] text-ink/65 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Product Engineer na Conexa · {siteConfig.location}
          </span>
        </motion.div>

        <h1 className="font-medium tracking-[-0.05em] text-ink" style={{ fontSize: "clamp(42px, 7vw, 104px)", lineHeight: 0.94 }}>
          <motion.span variants={line} initial="hidden" animate="show" custom={1} className="block">
            Sistemas que não quebram
          </motion.span>
          <motion.span variants={line} initial="hidden" animate="show" custom={2} className="block">
            às <Serif>2h da manhã.</Serif>
          </motion.span>
        </h1>

        <motion.p
          variants={line}
          initial="hidden"
          animate="show"
          custom={3}
          className="mx-auto mt-6 max-w-xl text-balance text-[15px] leading-relaxed text-ink/60 md:text-[17px]"
        >
          {siteConfig.hero.subheadline}
        </motion.p>

        <motion.div variants={line} initial="hidden" animate="show" custom={4} className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper shadow-[0_8px_20px_-8px_rgba(22,21,19,0.6)] transition-transform active:scale-95"
          >
            {siteConfig.hero.ctaPrimary}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#trabalho"
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-paper/60 px-4 py-2.5 text-sm text-ink/75 transition-colors hover:bg-paper hover:text-ink"
          >
            {siteConfig.hero.ctaSecondary}
            <ArrowDown className="h-4 w-4" />
          </a>
        </motion.div>
      </div>

      {/* o pasto */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
        className="relative mx-auto mt-6 h-[600px] sm:h-[clamp(420px,80vh,880px)] max-w-[1600px]"
      >
        <Pasture scrollProgress={progress} />
      </motion.div>

      <p className="mx-auto -mt-2 max-w-md px-5 text-center font-mono text-[11px] leading-relaxed text-ink/45">
        Nove microsserviços pastando em produção. Derrube um. Eu espero.
      </p>
    </section>
  )
}
