"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Screenshot } from "@/types/market"

interface ScreenshotSliderProps {
  screenshots: Screenshot[]
}

export default function ScreenshotSlider({ screenshots }: ScreenshotSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  if (!screenshots || screenshots.length === 0) return null

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + screenshots.length) % screenshots.length)
  }

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Animation variants for sliding effect
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const activeScreenshot = screenshots[currentIndex]

  return (
    <div className="group/slider relative w-full h-full flex flex-col justify-between bg-black/40 overflow-hidden">
      {/* Slider Container */}
      <div className="relative w-full flex-grow overflow-hidden aspect-video">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={activeScreenshot.src}
              alt={activeScreenshot.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-neon-lime hover:text-black hover:border-neon-lime"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-neon-lime hover:text-black hover:border-neon-lime"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
          <p className="text-xs font-medium text-white/90 drop-shadow-sm select-none">
            {activeScreenshot.caption}
          </p>
        </div>
      </div>

      {/* Dots Indicator */}
      {screenshots.length > 1 && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/5 z-10">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => handleDotClick(idx, e)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-neon-lime w-3"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
