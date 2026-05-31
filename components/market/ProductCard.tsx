"use client"

import React from "react"
import ScreenshotSlider from "./ScreenshotSlider"
import { MarketProduct } from "@/types/market"

interface ProductCardProps {
  product: MarketProduct
  onViewDetails: (product: MarketProduct) => void
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { title, type, tagline, screenshots, stack, price, currency, available } = product

  // Helper for badge colors based on category
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
    <div className="flex flex-col rounded-xl border border-white/5 bg-[#0a0a0b]/80 backdrop-blur-sm overflow-hidden hover:border-neon-lime/40 hover:shadow-[0_0_20px_rgba(191,255,0,0.05)] transition-all duration-300">
      {/* 1. Screenshots Slider */}
      <div className="w-full aspect-video">
        <ScreenshotSlider screenshots={screenshots} />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-grow p-5 justify-between gap-4">
        <div className="space-y-3">
          {/* 2. Badge de Tipo */}
          <div className="flex items-center justify-between">
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

          {/* 3. Título + Tagline */}
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-white tracking-tight leading-snug">
              {title}
            </h3>
            <p className="font-sans text-sm text-white/60 leading-relaxed line-clamp-2">
              {tagline}
            </p>
          </div>

          {/* 4. Stack badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[10px] font-medium"
              >
                {tech}
              </span>
            ))}
            {stack.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/3 border border-white/5 text-white/40 text-[10px] font-medium">
                +{stack.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* 5. Footer (Preço + Botão) */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-white/40">
              Valor
            </span>
            <span className="font-display text-xl font-extrabold text-neon-lime">
              {available ? `${currency} ${price}` : "Sob consulta"}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(product)}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-white/10 bg-transparent text-white hover:bg-neon-lime hover:text-black hover:border-neon-lime hover:shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all duration-300"
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  )
}
