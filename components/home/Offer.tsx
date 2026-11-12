"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Github, Plus } from "lucide-react"
import { siteConfig, getWhatsAppUrl } from "@/config/site"
import { faqs } from "@/lib/content"
import { ease, H2, Kicker, Reveal, Serif } from "./ui"

const services = [
  { key: "landingPage", blurb: "Página rápida, copy que vende e CTA no lugar certo.", tone: "bg-[#ffe3ef]" },
  { key: "mvp", blurb: "Do rabisco ao produto rodando, com o essencial bem feito.", tone: "bg-[#e3efff]" },
  { key: "system", blurb: "Painel, automação ou motor interno que tira o time da planilha.", tone: "bg-[#eaf7d5]" },
  { key: "aiIntegration", blurb: "Agentes e LLMs plugados no seu produto, com dados reais.", tone: "bg-[#efe6ff]" },
] as const

export default function Offer() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5">
        <Reveal className="text-center">
          <Kicker>Pra quem quer contratar</Kicker>
          <H2 className="mx-auto mt-4 max-w-3xl">
            Preço na mesa, <Serif>prazo no contrato.</Serif>
          </H2>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const svc = siteConfig.services[s.key]
            return (
              <Reveal key={s.key} delay={i * 0.06}>
                <Link href="/contact" className="group flex h-full flex-col justify-between gap-10 rounded-[28px] bg-paper p-6 transition-transform duration-500 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[20px] font-medium leading-tight tracking-[-0.03em] text-ink">{svc.title}</p>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${s.tone} text-ink transition-transform group-hover:rotate-45`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-ink/55">{s.blurb}</p>
                    <div className="mt-5 flex items-end justify-between border-t border-black/[0.06] pt-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">a partir de</p>
                        <p className="text-[22px] font-medium tracking-[-0.03em] text-ink">{svc.startingPrice}</p>
                      </div>
                      <p className="font-mono text-[11px] text-ink/45">{svc.delivery}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>

        {/* projetos sem cobrar */}
        <Reveal className="mt-3">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-[#141312] p-6 text-white md:flex-row md:items-center md:p-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/40">Sem cobrar nada</p>
              <p className="mt-3 text-[24px] font-medium leading-tight tracking-[-0.03em] md:text-[30px]">
                Projeto bom nem sempre tem <span className="font-serif font-normal italic">orçamento.</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                Topo open-source, iniciativas de comunidade e projetos inovadores em servidores do Discord. Se a ideia é boa e ajuda gente, me chama.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-ink transition-transform active:scale-95"
              >
                Bora construir junto
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </div>
        </Reveal>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-3xl">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-black/[0.07]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-[17px] tracking-[-0.02em] text-ink md:text-[19px]">{f.q}</span>
                <Plus className={`h-4 w-4 shrink-0 text-ink/50 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-ink/60">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
