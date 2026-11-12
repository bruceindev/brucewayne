"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { projects } from "@/lib/projects"
import { getWhatsAppUrl } from "@/config/site"
import { H2, Kicker, Reveal, Serif } from "./ui"

export default function Work() {
  return (
    <section id="trabalho" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Kicker>Trabalho selecionado</Kicker>
            <H2 className="mt-4 max-w-3xl">
              Bons sistemas são construídos <Serif>bloco por bloco.</Serif>
            </H2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-paper/60 px-4 py-2.5 text-sm text-ink/75 transition-colors hover:bg-paper hover:text-ink"
          >
            Todos os projetos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-max snap-x snap-mandatory gap-3 px-5 md:gap-4 xl:pl-[max(20px,calc((100vw-1400px)/2+20px))]">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="snap-start">
              <Link href={`/projects/${p.slug}`} className="group block w-[80vw] max-w-[440px] sm:w-[420px]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#e7e0d4]">
                  <Image
                    src={encodeURI(p.image)}
                    alt={`${p.title} — ${p.subtitle}`}
                    fill
                    sizes="(max-width: 640px) 80vw, 420px"
                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] text-ink/70 backdrop-blur">
                    {String(i + 1).padStart(2, "0")} · {p.type}
                  </span>
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="px-1 pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[20px] font-medium tracking-[-0.03em] text-ink">{p.title}</h3>
                    <span className="shrink-0 font-mono text-[10.5px] text-ink/40">{p.timeline}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/55">{p.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.stack.slice(0, 4).map((s) => (
                      <span key={s} className="rounded-full bg-ink/[0.05] px-2 py-0.5 text-[11px] text-ink/60">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* card "seu projeto aqui" */}
          <Reveal delay={projects.length * 0.06} className="snap-start">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex aspect-[4/3] w-[80vw] max-w-[440px] flex-col justify-between rounded-[24px] bg-[#141312] p-6 text-white sm:w-[420px]"
            >
              <span className="font-mono text-[10.5px] text-white/40">{String(projects.length + 1).padStart(2, "0")} · em aberto</span>
              <div>
                <p className="text-[28px] font-medium leading-[1.05] tracking-[-0.04em]">
                  Seu projeto
                  <br />
                  <span className="font-serif italic">pode ser o próximo.</span>
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-ink transition-transform group-active:scale-95">
                  Chamar no WhatsApp <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
