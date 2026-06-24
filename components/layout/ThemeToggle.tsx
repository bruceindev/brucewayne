"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevenir flicker de hidratação (só renderiza após montado no cliente)
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  if (!mounted) {
    return <div className="w-8 h-8 rounded-none border border-border/40 bg-transparent opacity-0" />
  }

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-9 h-9 border border-border hover:border-primary/50 bg-card/25 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-none transition-colors duration-300 group"
      title={isDark ? "Mudar para Modo Claro (Luz)" : "Mudar para Modo Escuro (Vinil)"}
      aria-label="Alternar tema"
    >
      <div className="relative w-7 h-7 flex items-center justify-center overflow-hidden">
        {/* Turntable Platter / Vinyl Record */}
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          animate={{
            rotate: isDark ? 360 : 0,
          }}
          transition={{
            repeat: isDark ? Infinity : 0,
            duration: 3,
            ease: "linear",
          }}
          className="relative z-10"
        >
          {/* Vinyl base (black in dark mode, dark grey in light mode) */}
          <circle
            cx="12"
            cy="12"
            r="11"
            fill={isDark ? "#121212" : "#2e2e2e"}
            stroke={isDark ? "#2A2A2A" : "#666"}
            strokeWidth="0.5"
          />

          {/* Grooves */}
          <circle cx="12" cy="12" r="9" stroke={isDark ? "#1a1a1a" : "#3d3d3d"} strokeWidth="0.5" />
          <circle cx="12" cy="12" r="7" stroke={isDark ? "#1a1a1a" : "#3d3d3d"} strokeWidth="0.5" />
          <circle cx="12" cy="12" r="5" stroke={isDark ? "#1a1a1a" : "#3d3d3d"} strokeWidth="0.5" />

          {/* Center label (Gold in dark mode, Cream in light mode) */}
          <circle
            cx="12"
            cy="12"
            r="3"
            fill={isDark ? "#C9A84C" : "#F0E8D8"}
          />
          {/* Spindle hole */}
          <circle cx="12" cy="12" r="0.75" fill="#080808" />
        </motion.svg>

        {/* Tonearm (Style/Needle) */}
        <motion.svg
          width="12"
          height="16"
          viewBox="0 0 12 16"
          fill="none"
          className="absolute right-0.5 top-0.5 z-20 pointer-events-none"
          animate={{
            rotate: isDark ? 16 : -25,
            x: isDark ? -1.5 : 1,
            y: isDark ? 0.5 : -1,
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          style={{ originX: "9px", originY: "2px" }}
        >
          {/* Pivot point base */}
          <circle cx="9" cy="2" r="1.5" fill={isDark ? "#C9A84C" : "#666"} />
          
          {/* Tonearm pole */}
          <path
            d="M9 2L3 12L2 14"
            stroke={isDark ? "#C9A84C" : "#888"}
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          
          {/* Cartridge/Headshell */}
          <path
            d="M1 13.5L3 14.5L2.5 15.5L0.5 14.5Z"
            fill={isDark ? "#C93434" : "#666"}
          />
        </motion.svg>
      </div>
      
      {/* Editorial Indicator LED */}
      <span className={`absolute top-0.5 left-0.5 w-[3px] h-[3px] ${isDark ? "bg-[#C93434] pulse-red-dot" : "bg-transparent border border-border"} transition-colors`} />
    </button>
  )
}
