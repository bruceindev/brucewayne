"use client"

import React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-[73px] z-40 h-[calc(100vh-73px)] w-full bg-background/98 backdrop-blur-xl border-t border-border p-6 flex flex-col justify-between md:hidden"
        >
          {/* Menu Links — large editorial style */}
          <div className="flex flex-col gap-2 pt-4">
            {links.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.path}
                  onClick={onClose}
                  className={`block font-display text-3xl italic font-light tracking-tight py-3 border-b border-border transition-colors ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Footer of Mobile Drawer */}
          <div className="flex flex-col gap-5 pb-8">
            <div className="w-full h-px bg-border" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Status</span>
                {siteConfig.hero.available && (
                  <div className="flex items-center gap-2 text-xs font-mono text-foreground">
                    <span className="h-[6px] w-[6px] rounded-full bg-destructive pulse-red-dot" />
                    <span>Disponível agora</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Resposta</span>
                <span className="text-xs font-mono font-medium text-foreground">{siteConfig.contact.responseTime}</span>
              </div>
              <Link href="/contact" onClick={onClose} className="w-full mt-2">
                <Button className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 py-5 text-sm rounded">
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
