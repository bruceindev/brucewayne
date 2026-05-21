"use client"

import React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import { siteConfig } from "@/config/site"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  links: Array<{ name: string; path: string }>
  isActive: (path: string) => boolean
}

export default function MobileMenu({
  isOpen,
  onClose,
  links,
  isActive
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-x-0 top-[73px] z-40 h-[calc(100vh-73px)] w-full bg-background/96 backdrop-blur-xl border-t border-white/5 p-6 flex flex-col justify-between md:hidden"
        >
          {/* Menu Links */}
          <div className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={onClose}
                className={`text-xl font-display font-medium tracking-wide py-2.5 border-b border-white/3 transition-colors ${
                  isActive(link.path)
                    ? "text-neon-lime border-neon-lime/20"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Footer of Mobile Drawer */}
          <div className="flex flex-col gap-5 pb-8">
            <div className="w-full h-px bg-white/5" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status Atual</span>
                <Badge variant={siteConfig.hero.available ? "neon" : "outline"} dot>
                  {siteConfig.hero.available ? siteConfig.hero.availabilityLabel : "Indisponível no momento"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Tempo de Resposta</span>
                <span className="text-xs font-semibold text-white">⚡ {siteConfig.contact.responseTime}</span>
              </div>
              <Link href="/contact" onClick={onClose} className="w-full mt-2">
                <Button className="w-full bg-neon-lime text-black font-semibold hover:bg-neon-lime/90 py-5 text-sm">
                  {siteConfig.hero.ctaPrimary}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
