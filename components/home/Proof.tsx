"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen, Clock, LifeBuoy } from "lucide-react"
import { siteConfig } from "@/config/site"
import { ease, Glossy, H2, Kicker, Reveal, Serif } from "./ui"

function Card({ children, className = "", dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] p-6 md:p-7 ${
        dark ? "bg-[#141312] text-white" : "bg-paper text-ink"
      } ${className}`}
    >
      {children}
    </div>
  )
}

function Bars() {
  return (
    <div className="mt-8 space-y-3">
      {[
        { label: "antes", w: 100, c: "bg-ink/15" },
        { label: "2 semanas depois", w: 30, c: "bg-grass" },
      ].map((b, i) => (
        <div key={b.label} className="space-y-1">
          <div className="flex justify-between font-mono text-[10.5px] text-ink/45">
            <span>{b.label}</span>
            <span>{b.w}% dos erros</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-ink/[0.05]">
            <motion.div
              initial={{ width: "100%" }}
              whileInView={{ width: `${b.w}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.3 + i * 0.2, ease }}
              className={`h-full rounded-full ${b.c}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Pipeline() {
  const nodes = ["Agenda", "Régua", "IA", "WhatsApp", "Pix"]
  return (
    <div className="relative mt-8">
      <div className="absolute left-[6%] right-[6%] top-1/2 h-px -translate-y-1/2 bg-white/15" />
      {[0, 1, 2].map((k) => (
        <span
          key={k}
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sky shadow-[0_0_10px_#3B82F6]"
          style={{ animation: `pipe 3.2s linear ${k * 1.07}s infinite`, left: "6%" }}
        />
      ))}
      <div className="relative flex justify-between">
        {nodes.map((n) => (
          <span key={n} className="rounded-lg border border-white/10 bg-[#1d1c1a] px-2 py-1.5 font-mono text-[10px] text-white/75 md:px-2.5 md:text-[11px]">
            {n}
          </span>
        ))}
      </div>
      <style>{`@keyframes pipe { 0% { left: 6%; opacity: 0 } 8% { opacity: 1 } 92% { opacity: 1 } 100% { left: 94%; opacity: 0 } }`}</style>
    </div>
  )
}

export default function Proof() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5">
        <Reveal className="mb-10 text-center">
          <Kicker>Prova</Kicker>
          <H2 className="mx-auto mt-4 max-w-3xl">
            Números que eu <Serif>assino embaixo.</Serif>
          </H2>
        </Reveal>

        <div className="grid gap-3 md:grid-cols-6">
          <Reveal className="md:col-span-3">
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <p className="text-[22px] font-medium leading-tight tracking-[-0.03em] md:text-[26px]">
                  −70% de erros
                  <br />
                  em duas semanas.
                </p>
                <span className="font-mono text-[10.5px] text-ink/40">GR5</span>
              </div>
              <p className="mt-2 max-w-sm text-sm text-ink/55">Refatorei robôs jurídicos críticos e blindei o tratamento de dados.</p>
              <Bars />
            </Card>
          </Reveal>

          <Reveal className="md:col-span-3" delay={0.08}>
            <Card dark className="h-full">
              <div className="flex items-start justify-between">
                <p className="text-[22px] font-medium leading-tight tracking-[-0.03em] md:text-[26px]">
                  Um estúdio inteiro
                  <br />
                  no piloto automático.
                </p>
                <span className="font-mono text-[10.5px] text-white/40">MONK</span>
              </div>
              <p className="mt-2 max-w-sm text-sm text-white/55">
                A cliente agenda, paga o sinal por Pix e recebe tudo no WhatsApp — sem a dona digitar nada. 600+ testes seguram isso de pé.
              </p>
              <Pipeline />
            </Card>
          </Reveal>

          <Reveal className="md:col-span-2" delay={0.04}>
            <Card className="h-full">
              <BookOpen className="h-5 w-5 text-ink/50" />
              <p className="mt-6 text-[20px] font-medium leading-tight tracking-[-0.03em]">Publicado.</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                “AWS Lambda e Serverless Architecture: Padrões de Design em Sistemas Distribuídos” — Centro Universitário SENAC, 2026.
              </p>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-2" delay={0.08}>
            <Card className="flex h-full flex-col justify-between gap-6">
              <div className="flex gap-6">
                <div>
                  <Clock className="h-5 w-5 text-ink/50" />
                  <p className="mt-6 text-[40px] font-medium leading-none tracking-[-0.05em]">{siteConfig.metrics.responseTime}</p>
                  <p className="mt-1 text-sm text-ink/55">pra responder</p>
                </div>
                <div>
                  <LifeBuoy className="h-5 w-5 text-ink/50" />
                  <p className="mt-6 text-[40px] font-medium leading-none tracking-[-0.05em]">30d</p>
                  <p className="mt-1 text-sm text-ink/55">de suporte grátis</p>
                </div>
              </div>
              <p className="font-mono text-[10.5px] text-ink/40">código 100% seu, no seu GitHub</p>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-2" delay={0.12}>
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <Glossy tone="orange" className="h-12 w-12">
                  <span className="text-[13px] font-bold">AWS</span>
                </Glossy>
                <a
                  href="/Ryan_Jesus_Curriculo.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir currículo"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-ink/60 transition-colors hover:bg-ink hover:text-paper"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-6 text-[20px] font-medium leading-tight tracking-[-0.03em]">Certificado.</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                AWS Academy Graduate — Cloud Foundations. Mais Full Stack (Alura), Backend Java (Santander) e SQL (Oracle).
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
