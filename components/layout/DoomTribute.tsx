"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, HelpCircle, Play, Pause, SkipForward, SkipBack, Music } from "lucide-react"

const quotes = [
  "ALL CAPS WHEN YOU SPELL THE MAN NAME.",
  "Living on borrowed time the clock ticks faster...",
  "Only in America could you find a way to earn a healthy buck and still keep your attitude.",
  "The rest is empty space, search it for a trace.",
  "Do not talk about my wars, comment about my battle scars.",
  "He wears a mask to cover the raw flesh, a raw deal, name steel..."
]

const playlist = [
  {
    title: "Eye (feat. Stacy Epps)",
    src: "/musics/Eye (feat. Stacy Epps).MP3",
    length: "1:57"
  },
  {
    title: "Kon Queso",
    src: "/musics/MF DOOM - Kon Queso (Official Audio).MP3",
    length: "4:00"
  },
  {
    title: "Lavender Buds",
    src: "/musics/MF DOOM - Lavender Buds (Official Audio).MP3",
    length: "2:59"
  },
  {
    title: "Think I Am (Remix)",
    src: "/musics/Think I Am (feat. MF Doom) [Melodiesinfonie Remix].MP3",
    length: "2:59"
  }
]

export default function DoomTribute() {
  const [isOpen, setIsOpen] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Playlist and audio state
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioError, setAudioError] = useState(false)
  const [showWidget, setShowWidget] = useState(false)

  const durationLimit = 45 // Limit play to 45 seconds

  // Listen to keydown "doom" and CustomEvent
  useEffect(() => {
    let keys: string[] = []
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close
      if (e.key === "Escape") {
        setIsOpen(false)
        return
      }

      keys.push(e.key.toLowerCase())
      keys = keys.slice(-4)
      if (keys.join("") === "doom") {
        setIsOpen(true)
        keys = []
      }
    }

    const handleCustomTrigger = () => {
      setIsOpen(true)
    }

    window.addEventListener("keydown", handleKeyDown)
    document.addEventListener("trigger-doom-egg", handleCustomTrigger)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("trigger-doom-egg", handleCustomTrigger)
    }
  }, [])

  // Rotate quotes every 4.5 seconds
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [isOpen])



  // Sync isPlaying state to Ref to avoid dependency cycle in track change effect
  const isPlayingRef = useRef(isPlaying)
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // Reload and play when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      setCurrentTime(0)
      setAudioError(false)
      if (isPlayingRef.current) {
        audioRef.current.play().catch((e) => {
          console.error("Autoplay failed on track index change", e)
          setAudioError(true)
        })
      }
    }
  }, [currentTrackIndex])

  // Track mouse coordinates for parallax mask reflections
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5 // -0.5 to 0.5
    setMousePos({ x, y })
  }

  // Handle Play/Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          setShowWidget(true)
          setAudioError(false)
        })
        .catch((err) => {
          console.error("Audio playback error:", err)
          setAudioError(true)
        })
    }
  }

  // Skip handlers
  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
    setIsPlaying(true)
    setShowWidget(true)
  }

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
    setIsPlaying(true)
    setShowWidget(true)
  }

  // Sync audio progress and handle 45s threshold
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime
      setCurrentTime(cur)
      
      // Auto skip to next track after 45 seconds
      if (cur >= durationLimit) {
        handleNextTrack()
      }
    }
  }

  const handleTrackSelect = (idx: number) => {
    setCurrentTrackIndex(idx)
    setIsPlaying(true)
    setShowWidget(true)
  }

  const currentTrack = playlist[currentTrackIndex]

  // Time format helper
  const formatTime = (time: number) => {
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <>
      {/* HTML5 Audio Node */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onError={() => setAudioError(true)}
      />

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md cursor-zoom-out"
            />

        {/* Modal Box */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#0c0c0c] border border-border flex flex-col md:flex-row overflow-hidden rounded-[8px] z-10"
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-all rounded-none z-30 cursor-pointer"
            title="Fechar homenagem [ESC]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column — Large interactive SVG mask with mouse parallax */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border relative overflow-hidden bg-background-dot-pattern bg-dot-pattern">
            {/* Spinning background vinyl underlay */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute w-[360px] h-[360px] border border-border/10 rounded-full opacity-20 pointer-events-none flex items-center justify-center"
              style={{
                backgroundImage: "radial-gradient(circle, transparent 30%, rgba(201, 168, 76, 0.05) 50%, transparent 70%)"
              }}
            >
              <div className="w-[100px] h-[100px] border border-border/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/20 rounded-full" />
              </div>
            </motion.div>

            {/* Interactive Vector Parallax Mask */}
            <motion.div
              style={{
                x: mousePos.x * 20,
                y: mousePos.y * 20,
                rotateY: mousePos.x * 15,
                rotateX: -mousePos.y * 15,
                transformStyle: "preserve-3d",
              }}
              className="relative z-10 w-60 h-60 flex items-center justify-center cursor-pointer"
              title="A máscara do Vilão"
            >
              <svg
                viewBox="0 0 200 220"
                width="100%"
                height="100%"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_15px_30px_rgba(201,168,76,0.15)]"
              >
                <defs>
                  {/* Metal gradients */}
                  <linearGradient id="metalMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dcdcdc" />
                    <stop offset="30%" stopColor="#8c8c8c" />
                    <stop offset="50%" stopColor="#b8b8b8" />
                    <stop offset="70%" stopColor="#5a5a5a" />
                    <stop offset="100%" stopColor="#303030" />
                  </linearGradient>
                  
                  <linearGradient id="metalAccent" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C9A84C" />
                    <stop offset="50%" stopColor="#8E732E" />
                    <stop offset="100%" stopColor="#080808" />
                  </linearGradient>

                  <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#080808" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#080808" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Forehead plate with ridge */}
                <path
                  d="M40 30 C 50 15, 150 15, 160 30 C 170 60, 165 75, 155 80 C 140 85, 60 85, 45 80 C 35 75, 30 60, 40 30 Z"
                  fill="url(#metalMain)"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                />
                
                {/* Forehead ridge details */}
                <path d="M100 15 L100 80" stroke="#444" strokeWidth="3" opacity="0.4" />
                <circle cx="100" cy="25" r="2.5" fill="#C9A84C" />

                {/* Eye cutouts backdrop (dark slots) */}
                <path d="M48 90 Q 70 85 92 90 L 88 115 Q 68 110 48 90 Z" fill="#080808" stroke="#1a1a1a" />
                <path d="M152 90 Q 130 85 108 90 L 112 115 Q 132 110 152 90 Z" fill="#080808" stroke="#1a1a1a" />

                {/* Left Cheek plate */}
                <path
                  d="M32 75 C 32 75, 15 130, 25 170 C 35 200, 75 210, 85 205 C 85 205, 90 145, 92 120 C 80 115, 45 110, 32 75 Z"
                  fill="url(#metalMain)"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                />

                {/* Right Cheek plate */}
                <path
                  d="M168 75 C 168 75, 185 130, 175 170 C 165 200, 125 210, 115 205 C 115 205, 110 145, 108 120 C 120 115, 155 110, 168 75 Z"
                  fill="url(#metalMain)"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                />

                {/* Nose bridge and nose piece guard */}
                <path
                  d="M92 78 L 108 78 L 112 145 L 125 150 L 100 178 L 75 150 L 88 145 Z"
                  fill="url(#metalMain)"
                  stroke="#080808"
                  strokeWidth="2"
                />
                
                {/* Nose plate central ridge */}
                <path d="M100 78 L100 176" stroke="#fff" strokeWidth="1" opacity="0.3" />

                {/* Mouth Grille plate (placed under cheeks and nose) */}
                <path
                  d="M86 178 C 86 178, 88 212, 100 215 C 112 215, 114 178, 114 178 L 108 174 L 92 174 L 86 178 Z"
                  fill="url(#metalAccent)"
                  stroke="#080808"
                  strokeWidth="1.5"
                />
                
                {/* Grille slots */}
                <line x1="94" y1="184" x2="106" y2="184" stroke="#080808" strokeWidth="2.5" />
                <line x1="92" y1="192" x2="108" y2="192" stroke="#080808" strokeWidth="2.5" />
                <line x1="94" y1="200" x2="106" y2="200" stroke="#080808" strokeWidth="2.5" />
                <line x1="97" y1="208" x2="103" y2="208" stroke="#080808" strokeWidth="2.5" />

                {/* Rivets on cheek guards */}
                <circle cx="28" cy="115" r="2" fill="#555" stroke="#111" strokeWidth="0.5" />
                <circle cx="33" cy="155" r="2" fill="#555" stroke="#111" strokeWidth="0.5" />
                <circle cx="172" cy="115" r="2" fill="#555" stroke="#111" strokeWidth="0.5" />
                <circle cx="167" cy="155" r="2" fill="#555" stroke="#111" strokeWidth="0.5" />
              </svg>
            </motion.div>

            {/* Parallax specular gloss element */}
            <motion.div
              style={{
                x: mousePos.x * -10,
                y: mousePos.y * -10,
              }}
              className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-60"
            />
          </div>

          {/* Right Column — Comic layouts & Interactive Playlist Player */}
          <div className="flex-1 flex flex-col justify-between p-6 md:p-8 relative bg-card overflow-y-auto custom-scrollbar">
            {/* Vintage Comic Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">EDITION #01 / B-SIDE</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">TRIBUTO</span>
              </div>

              {/* Speech bubble */}
              <div className="relative bg-[#C9A84C] text-[#080808] p-3 rounded-none border border-black shadow-[3px_3px_0px_#000] mb-2">
                <h3 className="font-display text-lg font-bold tracking-tight uppercase leading-tight italic">
                  &ldquo;ALL CAPS WHEN YOU SPELL THE MAN NAME&rdquo;
                </h3>
              </div>

              <h2 className="font-display text-2xl md:text-3xl italic font-light text-foreground tracking-tight leading-[1.05]">
                Daniel Dumile <span className="text-primary not-italic font-sans font-medium text-sm tracking-widest">(MF DOOM)</span>
              </h2>
            </div>

            {/* Tape Deck Cassette Player with Playlists */}
            <div className="border border-border p-4 bg-background/60 space-y-4 rounded-none my-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-wider text-primary">TAPE DECK — MODEL D-45</span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                  {audioError ? (
                    <span className="text-[#C93434] font-bold">ERRO DE ÁUDIO</span>
                  ) : isPlaying ? (
                    "PLAYING — SNIPPET 45s"
                  ) : (
                    "PAUSED"
                  )}
                </span>
              </div>

              {/* Cassette Graphic */}
              <div className="h-16 border border-black/45 bg-zinc-950 flex items-center justify-between px-6 relative overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]">
                {/* Left Spindle */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-4 border-dashed border-zinc-700 bg-black flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 bg-zinc-800 rounded-full" />
                </motion.div>

                {/* Cassette Center info */}
                <div className="flex-1 mx-3 flex flex-col items-center justify-center h-10 border border-zinc-900 bg-zinc-900/60 p-1 relative">
                  <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest text-center truncate w-full">
                    DOOM RECORD
                  </span>
                  <span className="text-[8px] font-display italic text-primary text-center truncate w-full">
                    {currentTrack.title}
                  </span>
                </div>

                {/* Right Spindle */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-4 border-dashed border-zinc-700 bg-black flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 bg-zinc-800 rounded-full" />
                </motion.div>
              </div>

              {/* Snippet Progress Bar (Limit 45s) */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[8px] text-muted-foreground">
                  <span>Progress: {formatTime(currentTime)}</span>
                  <span>Limit: 0:45</span>
                </div>
                <div className="w-full h-1 bg-border rounded-none overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-100 ease-linear"
                    style={{ width: `${(Math.min(currentTime, 45) / 45) * 100}%` }}
                  />
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevTrack}
                  className="py-2.5 px-3 border border-border hover:border-primary bg-card hover:bg-primary/10 transition-all rounded-none cursor-pointer flex items-center justify-center"
                  title="Música anterior"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="flex-1 py-2 border border-border hover:border-primary bg-card hover:bg-primary hover:text-primary-foreground text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 rounded-none cursor-pointer font-bold"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 fill-current" />
                      PAUSAR
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      TOCAR TAPE
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="py-2.5 px-3 border border-border hover:border-primary bg-card hover:bg-primary/10 transition-all rounded-none cursor-pointer flex items-center justify-center"
                  title="Próxima música"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              {/* Track Selector List */}
              <div className="space-y-1">
                <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground block mb-1">
                  SELECIONE A FAIXA
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                  {playlist.map((track, idx) => {
                    const isSelected = idx === currentTrackIndex
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTrackSelect(idx)}
                        className={`w-full flex items-center justify-between p-1.5 border text-left text-[10px] font-mono transition-colors rounded-none cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground bg-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Music className={`h-3 w-3 flex-shrink-0 ${isSelected ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                          <span className="truncate">{track.title}</span>
                        </span>
                        <span>{track.length}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Central Animated quotes display */}
            <div className="h-20 flex flex-col justify-center border-y border-border py-2 bg-background/30 px-4 mb-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-primary mb-1">DOOM QUOTE</span>
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="font-display text-xs md:text-sm italic font-medium text-foreground tracking-tight leading-snug"
                >
                  &ldquo;{quotes[quoteIndex]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Vintage footer stamp */}
            <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-primary" /> Digite &ldquo;DOOM&rdquo; em qualquer tela
              </span>
              <span>1971 — 2020 🕊️</span>
            </div>
          </div>
        </motion.div>
      </div>
        )}
      </AnimatePresence>

      {/* Floating mini-player widget */}
      <AnimatePresence>
        {!isOpen && showWidget && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4 bg-[#0c0c0c]/95 border border-border px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_10px_rgba(201,168,76,0.1)] rounded-none group select-none max-w-sm md:max-w-md"
          >
            {/* Spinning Vinyl Icon */}
            <div 
              onClick={() => setIsOpen(true)}
              className="relative w-8 h-8 flex-shrink-0 cursor-pointer"
              title="Abrir Tape Deck"
            >
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-full h-full rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center relative overflow-hidden"
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-1 rounded-full border border-zinc-900/50" />
                {/* Center Label */}
                <div className="w-2.5 h-2.5 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-black rounded-full" />
                </div>
              </motion.div>
              {/* LED status indicator */}
              <span className={`absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
            </div>

            {/* Track Info */}
            <div 
              onClick={() => setIsOpen(true)}
              className="flex-1 min-w-[120px] cursor-pointer flex flex-col justify-center"
              title="Abrir Tape Deck"
            >
              <span className="font-mono text-[7px] uppercase tracking-wider text-primary">DOOM SNIPPET</span>
              <span className="font-display italic text-xs text-foreground truncate max-w-[150px] group-hover:text-primary transition-colors block">
                {currentTrack.title}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <button
                onClick={handlePrevTrack}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Música anterior"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={togglePlay}
                className="text-primary hover:text-foreground transition-colors p-1"
                title={isPlaying ? "Pausar" : "Tocar"}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Próxima música"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause()
                  }
                  setIsPlaying(false)
                  setShowWidget(false)
                }}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-1 border-l border-border/30 pl-2"
                title="Fechar e desligar som"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
