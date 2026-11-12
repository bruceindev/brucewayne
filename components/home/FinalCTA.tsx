"use client"

import React, { useEffect, useState } from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { siteConfig, getWhatsAppUrl } from "@/config/site"
import { Reveal } from "./ui"

function spNow() {
  const parts = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date())
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  const m = parts.find((p) => p.type === "minute")?.value ?? "00"
  const mood =
    h < 6 ? "dormindo (os sistemas não)" : h < 12 ? "café na mão, código na tela" : h < 18 ? "provavelmente num deploy" : "codando com vinil tocando"
  return { time: `${String(h).padStart(2, "0")}:${m}`, mood }
}

export default function FinalCTA() {
  const [clock, setClock] = useState<{ time: string; mood: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const tick = () => setClock(spNow())
    const first = setTimeout(tick, 0) // relógio só no cliente (evita mismatch de hidratação)
    const id = setInterval(tick, 20_000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${siteConfig.contact.email}`
    }
  }

  return (
    <section className="px-3 py-10 md:px-6">
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] bg-[#141312] px-6 py-16 text-center text-white md:py-28">
          {/* brilho verde de pasto */}
          <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-[#5E9E2A] opacity-25 blur-[100px]" />

          <p className="font-mono text-[11px] text-white/45">
            {clock ? (
              <>
                São Paulo · {clock.time} — {clock.mood}
              </>
            ) : (
              "São Paulo"
            )}
          </p>
          <h2 className="mx-auto mt-6 max-w-4xl text-balance font-medium tracking-[-0.05em]" style={{ fontSize: "clamp(40px, 6.6vw, 96px)", lineHeight: 0.95 }}>
            Seu próximo sistema começa com um <span className="font-serif font-normal italic">“oi”.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
            {siteConfig.contact.responseTime}. Sem formulário infinito, sem call de vendas. Você fala do problema, eu falo como resolveria.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-sm font-medium text-ink transition-transform active:scale-95"
            >
              Mandar um oi no WhatsApp
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-5 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "E-mail copiado" : "Copiar e-mail"}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
