"use client"

import React, { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"

export default function VinylRecord() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isHovering = useRef(false)
  const rotation = useMotionValue(0)
  const rafId = useRef<number>(0)
  const baseSpeed = useRef(0.15)

  // Scroll-linked transforms
  const { scrollYProgress } = useScroll()
  const tiltX = useTransform(scrollYProgress, [0, 0.25], [0, 35])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.25], [1, 0.85])

  // Smooth springs
  const springTilt = useSpring(tiltX, { stiffness: 80, damping: 20 })
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 25 })
  const springScale = useSpring(scale, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const animate = () => {
      // Smooth speed transition on hover
      const targetSpeed = isHovering.current ? 0.6 : 0.15
      baseSpeed.current += (targetSpeed - baseSpeed.current) * 0.05
      rotation.set(rotation.get() + baseSpeed.current)
      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  }, [rotation])

  return (
    <motion.div
      ref={containerRef}
      className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] flex-shrink-0 select-none cursor-pointer"
      style={{
        perspective: 800,
        opacity: springOpacity,
        scale: springScale,
      }}
      onMouseEnter={() => { isHovering.current = true }}
      onMouseLeave={() => { isHovering.current = false }}
      onClick={() => {
        document.dispatchEvent(new CustomEvent("trigger-doom-egg"))
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          rotateX: springTilt,
          rotateZ: rotation,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Disco de vinil SVG */}
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="vinylGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="30%" stopColor="#0a0a0a" />
              <stop offset="60%" stopColor="#111111" />
              <stop offset="85%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
            <radialGradient id="labelGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#A88A38" />
            </radialGradient>
            {/* Subtle shine / specular reflection */}
            <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.06" />
              <stop offset="50%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Outer disc */}
          <circle cx="200" cy="200" r="195" fill="url(#vinylGrad)" stroke="#222" strokeWidth="1" />

          {/* Groove rings — subtle concentric circles */}
          {Array.from({ length: 25 }, (_, i) => (
            <circle
              key={i}
              cx="200"
              cy="200"
              r={75 + i * 4.8}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
          ))}

          {/* Specular shine */}
          <circle cx="200" cy="200" r="194" fill="url(#shine)" />

          {/* Center label */}
          <circle cx="200" cy="200" r="60" fill="url(#labelGrad)" />
          <circle cx="200" cy="200" r="58" fill="none" stroke="#080808" strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Label text */}
          <text
            x="200"
            y="193"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#080808"
            fontFamily="serif"
            fontWeight="700"
            fontSize="20"
            letterSpacing="-0.5"
          >
            BRUCE.
          </text>
          <text
            x="200"
            y="213"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#080808"
            fontFamily="sans-serif"
            fontWeight="400"
            fontSize="7"
            letterSpacing="2"
            opacity="0.6"
          >
            THE B-SIDE
          </text>

          {/* Center hole */}
          <circle cx="200" cy="200" r="6" fill="#080808" />
          <circle cx="200" cy="200" r="4" fill="#111111" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
