"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobileMenu from "./MobileMenu"
import { siteConfig } from "@/config/site"
import ThemeToggle from "./ThemeToggle"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Projetos", path: "/projects" },
    { name: "Contato", path: "/contact" }
  ]

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur-md py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col justify-start">
              <Link
                href="/"
                className="font-display text-2xl font-bold tracking-[-0.04em] text-foreground transition-colors hover:text-primary italic leading-none"
              >
                BRUCE<span className="text-primary not-italic">.</span>
              </Link>
              <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest leading-none mt-1">
                Ryan Jesus
              </span>
            </div>

            {/* Availability indicator */}
            {siteConfig.hero.available && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="h-[6px] w-[6px] rounded-full bg-destructive pulse-red-dot" />
                <span>Disponível agora</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`group relative text-sm font-medium transition-colors hover:text-foreground ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
                {/* Animated underline */}
                <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                  isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}

            {/* Download CV */}
            <a
              href="/Ryan_Jesus_Curriculo.pdf"
              download="Ryan_Jesus_Curriculo.pdf"
              className="group relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              title="Baixar Currículo (PDF)"
            >
              <span>Currículo</span>
              <span className="text-[10px] text-primary">↓</span>
              <span className="absolute -bottom-1 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            </a>
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="hidden md:inline-flex">
              <Link href="/contact">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 rounded"
                >
                  {siteConfig.hero.ctaPrimary}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded text-muted-foreground hover:text-foreground hover:bg-card md:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
        isActive={isActive}
      />
    </>
  )
}
