"use client"

import React, { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Position state for lerp
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    const frameId = requestAnimationFrame(() => {
      setIsTouchDevice(hasTouch)
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Detect interactive elements for hover state
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, label")
      setIsHovering(!!interactive)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleMouseOver)

    // Animation loop with lerp
    const animate = () => {
      const ease = 0.15
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * ease
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * ease

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`
      }
      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleMouseOver)
      cancelAnimationFrame(rafId.current)
    }
  }, [isVisible, isTouchDevice])

  if (isTouchDevice) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "width 0.25s cubic-bezier(0.25,0.46,0.45,0.94), height 0.25s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.2s, background-color 0.25s",
        width: isHovering ? 32 : 12,
        height: isHovering ? 32 : 12,
        borderRadius: "50%",
        border: "1px solid #C9A84C",
        backgroundColor: isHovering ? "rgba(201, 168, 76, 0.2)" : "transparent",
      }}
    />
  )
}
