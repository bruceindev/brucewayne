"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Page content reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>

        {/* Curtain enter — slides down to reveal */}
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#080808]"
          initial={{ scaleY: 1, originY: 0 }}
          animate={{ scaleY: 0, originY: 0 }}
          exit={{ scaleY: 1, originY: 1 }}
          transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] }}
        />

        {/* Curtain exit — slides up to cover */}
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#080808]"
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: 0, originY: 1 }}
          exit={{ scaleY: 1, originY: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
