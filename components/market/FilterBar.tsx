"use client"

import React from "react"
import { motion } from "framer-motion"
import { ProductType } from "@/types/market"

type FilterOption = ProductType | "Todos"

interface FilterBarProps {
  activeFilter: FilterOption
  onChange: (filter: FilterOption) => void
}

export default function FilterBar({ activeFilter, onChange }: FilterBarProps) {
  const options: FilterOption[] = ["Todos", "SaaS", "MVP", "Script", "Landing Page"]

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 py-6 select-none">
      {options.map((option) => {
        const isActive = activeFilter === option

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className="relative px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime/50"
          >
            {/* Background pill animation using layoutId */}
            {isActive && (
              <motion.span
                layoutId="activeFilterBg"
                className="absolute inset-0 bg-neon-lime rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            
            {/* Label text */}
            <span
              className={`relative z-10 block transition-colors duration-200 ${
                isActive
                  ? "text-black font-semibold"
                  : "text-white/60 hover:text-white/90"
              }`}
            >
              {option}
            </span>

            {/* Inactive outline border */}
            {!isActive && (
              <span className="absolute inset-0 border border-white/10 rounded-full hover:border-white/25 transition-colors" />
            )}
          </button>
        )
      })}
    </div>
  )
}
