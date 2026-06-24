"use client"

import React, { useState } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from "lucide-react"

interface ProjectGalleryProps {
  images: string[]
  title: string
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) return null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setIsZoomed(false)
  }

  // Swipe gesture handlers
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      handlePrev()
    } else if (info.offset.x < -swipeThreshold) {
      handleNext()
    }
  }

  return (
    <div className="space-y-4 my-10 select-none">
      {/* Gallery Header info */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
        <span>Galeria Visual — Telas Reais</span>
        <span>
          {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* Main Slider Container */}
      <div className="relative aspect-[16/9] w-full border border-border bg-card overflow-hidden rounded-[8px] group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt={`${title} — Tela ${currentIndex + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Lightbox / Zoom Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center border border-border bg-background/80 text-foreground backdrop-blur-md opacity-0 group-hover:opacity-100 hover:border-primary transition-all duration-300 rounded-none cursor-pointer"
          title="Zoom da imagem"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Navigation Arrows — Hidden when only 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center border border-border bg-background/80 text-muted-foreground hover:text-foreground backdrop-blur-md opacity-0 group-hover:opacity-100 hover:border-primary transition-all duration-300 rounded-none cursor-pointer"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center border border-border bg-background/80 text-muted-foreground hover:text-foreground backdrop-blur-md opacity-0 group-hover:opacity-100 hover:border-primary transition-all duration-300 rounded-none cursor-pointer"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Slide Indicators / Dots */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 transition-all duration-300 rounded-none cursor-pointer ${
                idx === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/30"
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox / Zoom Dialog Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setLightboxOpen(false)
                setIsZoomed(false)
              }}
              className="fixed inset-0 bg-black/95 backdrop-blur-sm cursor-zoom-out"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl max-h-[90vh] z-10 flex flex-col items-center justify-center"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setLightboxOpen(false)
                  setIsZoomed(false)
                }}
                className="absolute -top-12 right-0 flex items-center justify-center w-8 h-8 border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-all rounded-none z-20 cursor-pointer"
                aria-label="Fechar zoom"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Lightbox Image Frame */}
              <div 
                className={`overflow-auto custom-scrollbar max-w-full max-h-[80vh] border border-border bg-[#080808] ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[currentIndex]}
                  alt={`${title} Zoom`}
                  className={`transition-all duration-300 ${
                    isZoomed ? "max-w-none w-[180%] h-auto" : "max-w-full max-h-[75vh] object-contain"
                  }`}
                  style={{ userSelect: "none" }}
                />
              </div>

              {/* Caption */}
              <div className="mt-3 text-center text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span>{title} — Resolução Real</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ZoomIn className="h-3 w-3" /> Clique na imagem para {isZoomed ? "reduzir" : "ampliar"}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
