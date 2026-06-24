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
    <footer className="w-full border-t border-border bg-background py-12 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Logo & Value Prop */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-[-0.04em] text-foreground transition-colors hover:text-primary italic"
            >
              BRUCE<span className="text-primary not-italic">.</span>
            </Link>
            <p className="max-w-xs text-muted-foreground leading-relaxed text-sm">
              Sistemas de alta performance construídos com gosto, estética e cultura analógica. Código que dura.
            </p>
            <div className="flex items-center gap-2.5 text-xs font-mono">
              {siteConfig.hero.available ? (
                <>
                  <span className="h-[6px] w-[6px] rounded-full bg-destructive pulse-red-dot" />
                  <span className="text-foreground">{siteConfig.hero.availabilityLabel}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Indisponível no momento</span>
              )}
              <span className="text-muted-foreground">• {siteConfig.contact.responseTime}</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.12em]">Navegação</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-foreground transition-colors">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.12em]">Canais</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded border border-border bg-card/30 text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              <p>Seg — Sex, 09:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full h-px bg-border" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-muted-foreground font-mono">
          <p>
            © {currentYear} BRUCE. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span>Se você quer algo que dure, fala comigo.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
