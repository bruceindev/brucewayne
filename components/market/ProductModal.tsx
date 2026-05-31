"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import ScreenshotSlider from "./ScreenshotSlider"
import { MarketProduct } from "@/types/market"

interface ProductModalProps {
  product: MarketProduct | null
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  // Listen for Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [product])

  if (!product) return null

  const { title, type, tagline, description, screenshots, stack, features, price, currency, buyUrl, available } = product

  const getTypeBadgeStyles = (productType: typeof type) => {
    switch (productType) {
      case "SaaS":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "MVP":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Script":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Landing Page":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      default:
        return "bg-white/10 text-white border-white/20"
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.35 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-black/60 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all z-20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Scrollable Container */}
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {/* 1. Screenshots Slider (Larger) */}
            <div className="w-full h-64 md:h-80 relative border-b border-white/5 bg-black/20">
              <ScreenshotSlider screenshots={screenshots} />
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeBadgeStyles(
                      type
                    )}`}
                  >
                    {type}
                  </span>
                  {!available && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase font-bold tracking-wider">
                      Em breve
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {title}
                </h2>
                <p className="font-sans text-white/60 text-sm md:text-base leading-relaxed">
                  {tagline}
                </p>
              </div>

              {/* 3. Descrição Completa */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Sobre o produto
                </h4>
                <p className="font-sans text-sm text-white/80 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* 4. O que está incluído (Features) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  O que está incluído
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-neon-lime/10 text-neon-lime mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Stack badges */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Stack Tecnológica
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-3 py-1 rounded bg-white/5 border border-white/10 text-white/70 text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Bloco de compra (Footer do modal) */}
          <div className="flex items-center justify-between p-6 md:px-8 md:py-5 border-t border-white/5 bg-[#0d0e10]/95 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                Preço final
              </span>
              <span className="font-display text-2xl md:text-3xl font-black text-neon-lime">
                {available ? `${currency} ${price}` : "Sob consulta"}
              </span>
            </div>

            {available ? (
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-neon-lime text-black hover:bg-neon-lime/90 hover:shadow-[0_0_20px_rgba(191,255,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Comprar agora →
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
              >
                Em breve
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
