import React from "react"
import Link from "next/link"
import { siteConfig, getWhatsAppUrl } from "@/config/site"

const cols = [
  {
    title: "Navegar",
    links: [
      { label: "Trabalho", href: "/#trabalho" },
      { label: "Habilidades", href: "/#habilidades" },
      { label: "Trajetória", href: "/#trajetoria" },
      { label: "Metas", href: "/#metas" },
      { label: "Todos os projetos", href: "/projects" },
    ],
  },
  {
    title: "Conversar",
    links: [
      { label: "WhatsApp", href: getWhatsAppUrl(), ext: true },
      { label: "E-mail", href: `mailto:${siteConfig.contact.email}`, ext: true },
      { label: "Formulário", href: "/contact" },
    ],
  },
  {
    title: "Redes",
    links: [
      { label: "GitHub", href: siteConfig.social.github, ext: true },
      { label: "LinkedIn", href: siteConfig.social.linkedin, ext: true },
    ],
  },
  {
    title: "Recursos",
    links: [{ label: "Currículo (PDF)", href: "/Ryan_Jesus_Curriculo.pdf", ext: true }],
  },
]

export default function Footer() {
  return (
    <footer className="relative z-10 mt-12 overflow-hidden px-3 pb-3 md:px-6 md:pb-6">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-paper px-6 pt-12 md:px-12 md:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6">
          <div className="col-span-2 space-y-3">
            <p className="font-serif text-3xl italic leading-none text-ink">Bruce</p>
            <p className="max-w-xs text-sm leading-relaxed text-ink/55">
              Ryan Jesus — automação, IA e dados, em {siteConfig.location}. Criador do MONK.
            </p>
            <p className="font-mono text-[10.5px] text-ink/40">
              psst: digite <kbd className="rounded border border-black/10 bg-cream px-1">d o o m</kbd> em qualquer página.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">{c.title}</p>
              <ul className="space-y-1.5">
                {c.links.map((l) =>
                  "ext" in l && l.ext ? (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-ink/75 transition-colors hover:text-ink">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-ink/75 transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-black/[0.06] py-5 font-mono text-[10.5px] text-ink/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Ryan Jesus. Feito à mão, com café e MF DOOM no fone.</span>
        </div>

        {/* wordmark gigante, cortado na base */}
        <div aria-hidden className="pointer-events-none select-none pb-[0.08em] pt-[0.04em] text-center font-serif italic leading-[0.95] text-ink" style={{ fontSize: "clamp(120px, 27vw, 420px)" }}>
          bruce.
        </div>
      </div>
    </footer>
  )
}
