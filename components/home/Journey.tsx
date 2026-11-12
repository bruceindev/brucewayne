"use client"

import React, { useEffect, useRef, useState } from "react"
import { experiences } from "@/lib/content"
import { H2, Kicker, Reveal, Serif } from "./ui"

export default function Journey() {
  const [active, setActive] = useState(experiences[0].id)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.id!)
        })
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    Object.values(refs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const go = (id: string) => refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" })

  return (
    <section id="trajetoria" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5">
        <Reveal>
          <Kicker>Trajetória</Kicker>
          <H2 className="mt-4 max-w-3xl">
            Onde eu aprendi a <Serif>não quebrar coisas.</Serif>
          </H2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          {/* lista grande, estilo "Remix / Describe / Code" */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-32 space-y-1">
              {experiences.map((e) => (
                <button
                  key={e.id}
                  onClick={() => go(e.id)}
                  className={`block text-left font-medium tracking-[-0.04em] transition-colors duration-500 ${
                    active === e.id ? "text-ink" : "text-ink/[0.18] hover:text-ink/40"
                  }`}
                  style={{ fontSize: "clamp(30px, 3.4vw, 50px)", lineHeight: 1.08 }}
                >
                  {e.short}
                </button>
              ))}
              <p className="pt-6 font-mono text-[11px] text-ink/40">role a página → a lista acompanha</p>
            </div>
          </div>

          {/* cards */}
          <div className="min-w-0 space-y-3 md:col-span-7">
            {experiences.map((e) => (
              <article
                key={e.id}
                data-id={e.id}
                ref={(el) => {
                  refs.current[e.id] = el
                }}
                className={`rounded-[28px] bg-paper p-6 transition-all duration-500 md:p-8 ${
                  active === e.id ? "opacity-100 shadow-[0_20px_60px_-30px_rgba(40,30,10,0.35)]" : "md:opacity-55"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink/45">
                  <span>{e.period}</span>
                  <span>{e.company}</span>
                </div>
                <h3 className="mt-4 text-[24px] font-medium leading-tight tracking-[-0.03em] text-ink md:text-[28px]">{e.role}</h3>
                <p className="mt-1 font-serif text-[19px] italic text-ink/60">{e.kicker}</p>
                <ul className="mt-5 space-y-2.5">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[14.5px] leading-relaxed text-ink/70">
                      <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1">
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-full bg-ink/[0.05] px-2 py-0.5 text-[11px] text-ink/60">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
