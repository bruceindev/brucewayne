import React from "react"
import Link from "next/link"
import { Github, Linkedin, Mail, MessageSquare } from "lucide-react"
import { siteConfig, getWhatsAppUrl } from "@/config/site"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "GitHub",
      href: siteConfig.social.github,
      icon: <Github className="h-4 w-4" />
    },
    {
      name: "LinkedIn",
      href: siteConfig.social.linkedin,
      icon: <Linkedin className="h-4 w-4" />
    },
    {
      name: "WhatsApp",
      href: getWhatsAppUrl(),
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      name: "E-mail",
      href: `mailto:${siteConfig.contact.email}`,
      icon: <Mail className="h-4 w-4" />
    }
  ]

  return (
    <footer className="w-full border-t border-white/5 bg-[#080809] py-12 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Logo & Value Prop */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-tight text-white transition-colors hover:text-neon-lime"
            >
              {siteConfig.name
                .split(" ")
                .map((n) => n[0].toLowerCase())
                .join("")}
              <span className="text-neon-lime">.</span>dev
            </Link>
            <p className="max-w-xs text-muted-foreground leading-relaxed">
              Sistemas fullstack de alta qualidade com IA integrada. Entregas rápidas em semanas, escopo fixo e sem surpresas.
            </p>
            <div className={`flex items-center gap-2.5 text-xs font-mono ${siteConfig.hero.available ? "text-neon-lime" : "text-muted-foreground"}`}>
              <span className={`h-2 w-2 rounded-full ${siteConfig.hero.available ? "bg-neon-lime pulse-neon-dot" : "bg-muted-foreground"}`} />
              <span>
                {siteConfig.hero.available ? siteConfig.hero.availabilityLabel : "Indisponível no momento"} • SLA de Resposta: {siteConfig.contact.responseTime}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white tracking-wide uppercase text-xs">Navegação</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-white transition-colors">
                  Market
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white tracking-wide uppercase text-xs">Canais</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-secondary/10 text-muted-foreground transition-all hover:border-white/15 hover:bg-secondary/30 hover:text-white"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Atendimento comercial:</p>
              <p className="text-white font-mono mt-0.5">Seg — Sex, 09:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full h-px bg-white/5" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-muted-foreground">
          <p>
            © {currentYear}{" "}
            {siteConfig.name
              .split(" ")
              .map((n) => n[0].toLowerCase())
              .join("")}
            .dev. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span>Escopo Fixo. Prazo Fixo. Suporte Incluso.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
