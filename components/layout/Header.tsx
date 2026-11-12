"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { siteConfig, getWhatsAppUrl } from "@/config/site"

const navLinks = [
  { name: "Trabalho", href: "/#trabalho" },
  { name: "Habilidades", href: "/#habilidades" },
  { name: "Trajetória", href: "/#trajetoria" },
  { name: "Metas", href: "/#metas" },
  { name: "Projetos", href: "/projects" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const pill = `flex items-center rounded-2xl border border-black/[0.06] bg-paper/80 backdrop-blur-xl transition-shadow duration-300 ${
    scrolled ? "shadow-[0_8px_30px_rgba(40,30,10,0.08)]" : "shadow-none"
  }`

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-3">
        {/* esquerda: logo + links */}
        <div className={`${pill} pointer-events-auto gap-1 py-1.5 pl-4 pr-1.5`}>
          <Link href="/" className="mr-3 flex items-baseline gap-1.5" aria-label="Início">
            <span className="font-serif text-[22px] italic leading-none tracking-tight text-ink">Bruce</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40 sm:inline">Ryan Jesus</span>
          </Link>
          <nav className="hidden items-center lg:flex" aria-label="Principal">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-2.5 py-1.5 text-[13px] text-ink/60 transition-colors hover:bg-black/[0.04] hover:text-ink"
              >
                {l.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-1.5 text-ink/70 hover:bg-black/[0.04] lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* direita: status + CV + CTA */}
        <div className={`${pill} pointer-events-auto gap-1 p-1.5`}>
          {siteConfig.hero.available && (
            <span className="hidden items-center gap-1.5 px-2 text-[12px] text-ink/55 xl:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Agenda aberta pra novos projetos
            </span>
          )}
          <a
            href="/Ryan_Jesus_Curriculo.pdf"
            download="Ryan_Jesus_Curriculo.pdf"
            className="hidden rounded-lg px-2.5 py-1.5 text-[13px] text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-ink sm:block"
          >
            Currículo
          </a>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 rounded-xl bg-ink px-3 py-1.5 text-[13px] font-medium text-paper transition-transform active:scale-95"
          >
            {siteConfig.hero.ctaPrimary}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto mx-auto mt-2 max-w-[1400px] origin-top rounded-2xl border border-black/[0.06] bg-paper/95 p-2 shadow-[0_12px_40px_rgba(40,30,10,0.12)] backdrop-blur-xl lg:hidden"
            aria-label="Menu móvel"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-[17px] tracking-tight text-ink hover:bg-black/[0.04]"
              >
                {l.name}
              </Link>
            ))}
            <a
              href="/Ryan_Jesus_Curriculo.pdf"
              download="Ryan_Jesus_Curriculo.pdf"
              className="block rounded-xl px-3 py-3 text-[17px] tracking-tight text-ink hover:bg-black/[0.04]"
            >
              Baixar currículo (PDF)
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-[17px] tracking-tight text-ink hover:bg-black/[0.04]"
            >
              Contato
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
