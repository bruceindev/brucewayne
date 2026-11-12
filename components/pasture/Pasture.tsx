"use client"

import React, { useEffect, useRef, useState } from "react"
import { Copy, Trash2, MousePointerClick } from "lucide-react"
import type { PastureEngine, SheepMode, SelectedInfo, LogLine } from "./engine"

const MODES: { id: SheepMode; label: string }[] = [
  { id: "idle", label: "Parada" },
  { id: "graze", label: "Pastar" },
  { id: "walk", label: "Andar" },
  { id: "jump", label: "Pular" },
]

export default function Pasture({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasHost = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<PastureEngine | null>(null)

  const [selected, setSelected] = useState<SelectedInfo | null>(null)
  const [stats, setStats] = useState({ total: 9, healthy: 9 })
  const [logs, setLogs] = useState<LogLine[]>([])
  const [hint, setHint] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let disposed = false
    let io: IntersectionObserver | null = null
    ;(async () => {
      const { PastureEngine } = await import("./engine")
      if (disposed || !canvasHost.current || !boxRef.current || !labelRef.current || !toolbarRef.current) return
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let engine: PastureEngine
      try {
        engine = new PastureEngine(
          canvasHost.current,
          { box: boxRef.current, label: labelRef.current, toolbar: toolbarRef.current },
          {
            onSelect: setSelected,
            onStats: setStats,
            onLog: (l) => setLogs((prev) => [...prev.slice(-3), l]),
            onVinyl: () => document.dispatchEvent(new CustomEvent("trigger-doom-egg")),
            onHint: () => setHint(false),
          },
          { reducedMotion: reduced }
        )
      } catch {
        return // sem WebGL: o fallback em CSS continua visível
      }
      engineRef.current = engine
      engine.start()
      setReady(true)
      io = new IntersectionObserver(([e]) => engine.setVisible(e.isIntersecting), { rootMargin: "100px" })
      if (wrapRef.current) io.observe(wrapRef.current)
    })()
    return () => {
      disposed = true
      io?.disconnect()
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setScroll(scrollProgress)
  }, [scrollProgress])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") engineRef.current?.deselect()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div ref={wrapRef} className="relative h-full w-full select-none">
      {/* fallback / fundo enquanto o 3D carrega */}
      <div
        aria-hidden
        className={`absolute inset-[8%_6%] rounded-[40%] bg-[radial-gradient(ellipse_at_center,#9ccf55_0%,#86c23e_45%,transparent_70%)] blur-2xl transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-60"}`}
      />
      <div
        ref={canvasHost}
        className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        aria-label="Pasto 3D interativo: cada ovelha é um microsserviço. Clique numa ovelha para comandá-la."
        role="img"
      />

      {/* caixa de seleção estilo Figma */}
      <div ref={boxRef} className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150" style={{ willChange: "transform" }}>
        <div className="absolute inset-0 border-[1.5px] border-[#3b82f6]" />
        {["-left-[4px] -top-[4px]", "-right-[4px] -top-[4px]", "-left-[4px] -bottom-[4px]", "-right-[4px] -bottom-[4px]"].map((p) => (
          <span key={p} className={`absolute ${p} h-[7px] w-[7px] border-[1.5px] border-[#3b82f6] bg-white`} />
        ))}
        <div
          ref={labelRef}
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-[#3b82f6] px-1.5 py-[2px] font-mono text-[10px] leading-tight text-white shadow-sm"
        />
      </div>

      {/* toolbar flutuante */}
      <div
        ref={toolbarRef}
        className="absolute left-0 top-0 z-10 flex items-center gap-0.5 rounded-xl border border-black/5 bg-white/95 p-1 opacity-0 shadow-[0_8px_30px_rgba(40,30,10,0.14)] backdrop-blur transition-opacity duration-150"
        style={{ willChange: "transform", pointerEvents: "none" }}
        onPointerEnter={() => {
          if (engineRef.current) engineRef.current.toolbarHover = true
        }}
        onPointerLeave={() => {
          if (engineRef.current) engineRef.current.toolbarHover = false
        }}
        role="toolbar"
        aria-label={selected ? `Comandos para ${selected.name}` : "Comandos"}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => engineRef.current?.setMode(m.id)}
            className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              selected?.mode === m.id ? "bg-black/[0.07] text-ink" : "text-ink/55 hover:bg-black/[0.04] hover:text-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-black/10" />
        <button
          onClick={() => engineRef.current?.duplicate()}
          title="Escalar horizontalmente (duplicar)"
          aria-label="Escalar horizontalmente (duplicar)"
          className="rounded-lg p-1.5 text-ink/55 transition-colors hover:bg-black/[0.04] hover:text-ink"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => engineRef.current?.remove()}
          title="Derrubar o pod (ele volta sozinho)"
          aria-label="Derrubar o pod"
          className="rounded-lg p-1.5 text-ink/55 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* HUD: status do cluster */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[5] w-[min(300px,calc(100%-24px))] rounded-2xl border border-black/5 bg-white/80 p-3 font-mono text-[10.5px] leading-relaxed text-ink/70 shadow-[0_6px_24px_rgba(40,30,10,0.08)] backdrop-blur md:bottom-5 md:left-5">
        <div className="flex items-center justify-between text-ink">
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${stats.healthy === stats.total ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`} />
            cluster/pasto
          </span>
          <span>
            {stats.healthy}/{stats.total} saudáveis
          </span>
        </div>
        <div className="mt-1.5 space-y-0.5 sm:min-h-[3.2em]">
          {logs.length === 0 ? (
            <div className="text-ink/45">$ aguardando você derrubar alguém…</div>
          ) : (
            logs.map((l, i) => (
              <div
                key={l.id}
                className={`truncate ${i < logs.length - 1 ? "hidden sm:block" : ""} ${l.tone === "ok" ? "text-emerald-700" : l.tone === "warn" ? "text-amber-700" : "text-ink/60"}`}
              >
                {l.text}
              </div>
            ))
          )}
        </div>
      </div>

      {/* dica */}
      <div
        className={`pointer-events-none absolute right-3 top-3 z-[5] flex items-center gap-2 rounded-full border border-black/5 bg-white/85 px-3 py-1.5 text-[12px] text-ink/70 shadow-sm backdrop-blur transition-all duration-500 md:right-5 md:top-5 ${
          hint && ready ? "opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <MousePointerClick className="h-3.5 w-3.5" />
        Clique numa ovelha. Cada uma é um microsserviço.
      </div>
    </div>
  )
}
