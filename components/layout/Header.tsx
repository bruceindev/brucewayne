"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import MobileMenu from "./MobileMenu"
import { siteConfig } from "@/config/site"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add background shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Projetos", path: "/projects" },
    { name: "Contato", path: "/contact" }
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/5 bg-background/80 backdrop-blur-md py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo & Status Badge */}
          <div className="flex items-center gap-4">
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
            <div className="hidden sm:inline-flex">
              <Badge variant={siteConfig.hero.available ? "neon" : "outline"} dot>
                {siteConfig.hero.available ? siteConfig.hero.availabilityLabel : "Indisponível no momento"}
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive(link.path)
                    ? "text-neon-lime font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:inline-flex">
              <Link href="/contact">
                <Button
                  size="sm"
                  className="bg-neon-lime text-black font-semibold hover:bg-neon-lime/90 hover:shadow-[0_0_15px_rgba(191,255,0,0.4)] transition-all duration-350"
                >
                  {siteConfig.hero.ctaPrimary}
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 md:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
        isActive={isActive}
      />
    </>
  )
}
