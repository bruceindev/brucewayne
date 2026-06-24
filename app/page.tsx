"use client"

import React, { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import AnimatedSection from "@/components/ui/animated-section"
import VinylRecord from "@/components/ui/VinylRecord"
import { projects } from "@/lib/projects"
import { siteConfig } from "@/config/site"

// ── Kinetic Typography Component ──
function KineticTitle() {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const skewX = useRef(0)
  const translateX = useRef(0)
  const targetSkew = useRef(0)
  const targetTranslate = useRef(0)
  const rafId = useRef<number>(0)
  const [style, setStyle] = useState({ transform: "skewX(0deg) translateX(0px)" })

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const offset = (e.clientX - centerX) / rect.width // -0.5 to 0.5

    targetSkew.current = offset * 3 // ±1.5°
    targetTranslate.current = offset * 16 // ±8px

    cancelAnimationFrame(rafId.current)
    const animate = () => {
      skewX.current = lerp(skewX.current, targetSkew.current, 0.08)
      translateX.current = lerp(translateX.current, targetTranslate.current, 0.08)
      setStyle({
        transform: `skewX(${skewX.current}deg) translateX(${translateX.current}px)`,
      })

      if (
        Math.abs(skewX.current - targetSkew.current) > 0.01 ||
        Math.abs(translateX.current - targetTranslate.current) > 0.01
      ) {
        rafId.current = requestAnimationFrame(animate)
      }
    }
    rafId.current = requestAnimationFrame(animate)
  }, [])

  const handleMouseLeave = useCallback(() => {
    targetSkew.current = 0
    targetTranslate.current = 0
    cancelAnimationFrame(rafId.current)
    const animate = () => {
      skewX.current = lerp(skewX.current, 0, 0.06)
      translateX.current = lerp(translateX.current, 0, 0.06)
      setStyle({
        transform: `skewX(${skewX.current}deg) translateX(${translateX.current}px)`,
      })
      if (Math.abs(skewX.current) > 0.01 || Math.abs(translateX.current) > 0.01) {
        rafId.current = requestAnimationFrame(animate)
      }
    }
    rafId.current = requestAnimationFrame(animate)
  }, [])

  return (
    <h1
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="font-display italic font-light tracking-[-0.04em] text-foreground select-none"
      style={{
        fontSize: "clamp(80px, 12vw, 160px)",
        lineHeight: 0.9,
        ...style,
        willChange: "transform",
      }}
    >
      BRUCE<span className="text-primary not-italic">.</span>
    </h1>
  )
}

// ── Page ──
export default function Page() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index)

  const faqs = [
    {
      question: "Como funciona a entrega com prazo e escopo fixos?",
      answer: "Antes do desenvolvimento, mapeamos as funcionalidades essenciais. O preço e o prazo são garantidos em contrato — sem surpresas ou cobranças extras por retrabalho."
    },
    {
      question: "Qual o prazo típico para um MVP?",
      answer: `MVPs funcionais saem em ${siteConfig.services.mvp.delivery}. Landing pages de alta conversão em ${siteConfig.services.landingPage.delivery}. Sistemas internos robustos entre ${siteConfig.services.system.delivery}.`
    },
    {
      question: `Como funciona o suporte de ${siteConfig.metrics.supportDays}?`,
      answer: `Após o deploy, ofereço ${siteConfig.metrics.supportDays} de suporte sem custo — correção de bugs, ajustes de layout, configuração operacional e treinamento básico da equipe.`
    },
    {
      question: "O código e a infra são meus?",
      answer: "100%. Todo o código-fonte vai para o seu GitHub. Contas de hospedagem são criadas no nome do cliente, garantindo autonomia total."
    },
  ]

  // Section fade-in animation
  const sectionEntry = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }

  return (
    <div className="relative min-h-screen">
      {/* ═══════════════ ACT I — INTRO ═══════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-12 pb-24 md:pt-0 md:pb-0">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
            {/* Left — Copy */}
            <div className="flex-1 space-y-8 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">01 — Intro</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <KineticTitle />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md"
              >
                {siteConfig.hero.subheadline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-start gap-4 pt-2"
              >
                <Link href="/contact">
                  <Button className="bg-primary text-primary-foreground font-semibold hover:bg-[#080808] hover:text-primary hover:border-primary border border-transparent hover:border-primary transition-all duration-300 px-8 py-5 rounded text-sm">
                    {siteConfig.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="ghost" className="border border-border text-muted-foreground hover:border-primary hover:text-foreground px-8 py-5 rounded text-sm transition-all duration-300">
                    {siteConfig.hero.ctaSecondary}
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right — Vinyl Record */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0"
            >
              <VinylRecord />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ACT II — ABOUT (Liner Notes) ═══════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div {...sectionEntry} className="max-w-[680px] space-y-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">02 — About</span>

            <h2 className="font-display text-3xl md:text-5xl font-light italic tracking-tight text-foreground leading-[1.1]">
              Não sou apaixonado por tecnologia.
            </h2>

            <div className="space-y-5 text-muted-foreground text-sm md:text-base leading-relaxed">
              <p>
                Sou facinado por construir coisas que funcionam às 2h da manhã sem precisar de mim. Sistemas que sobrevivem à realidade — picos de tráfego, dados inconsistentes, prazos impossíveis. Isso é o que me move.
              </p>
              <p>
                Venho de São Paulo. Cresci na favela, mas nunca me limitei. MF DOOM, Pharrell Williams e outras obras chegaram nos meus ouvidos. Isso moldou como eu penso sobre software: cada decisão técnica é um arranjo. Cada feature é uma faixa. O sistema inteiro precisa soar bem junto.
              </p>
              <p>
                Construo sistemas financeiros transacionais, agentes de IA que substituem call centers, scrapers que monitoram tribunais e backends que aguentam conexões simultâneas. Não faço sites bonitos — faço sistemas que geram resultado.
              </p>
              <p className="text-foreground font-medium">
                Tecnologias que uso porque funcionam, não porque estão em alta.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "AWS", "Docker", "LLMs"].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-border text-muted-foreground hover:border-primary hover:text-foreground transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ ACT III — WORK (Track Listing) ═══════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div {...sectionEntry} className="space-y-4 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">03 — Work</span>
            <h2 className="font-display text-3xl md:text-5xl font-light italic tracking-tight text-foreground leading-[1.1]">
              As faixas.
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg">
              Casos reais com problemas reais. Cada projeto tem substância — não é showcase técnico, é evidência.
            </p>
          </motion.div>

          {/* Track list */}
          <div className="space-y-0">
            {projects.map((project, index) => (
              <AnimatedSection key={project.slug} delay={0.08 * index}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-b border-border hover:border-primary/40 transition-colors duration-300">
                    {/* Track number */}
                    <span className="font-mono text-xs text-muted-foreground w-12 flex-shrink-0">
                      {String(index + 1).padStart(2, "0")} —
                    </span>

                    {/* Title + Subtitle */}
                    <div className="flex-1 space-y-1">
                      <h3 className="font-display text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors duration-300 italic">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <span className="font-mono text-xs text-muted-foreground">{project.type}</span>
                      <span className="font-mono text-xs text-muted-foreground">{project.timeline}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}

            {/* Secret track (Easter Egg MF DOOM) */}
            <AnimatedSection delay={0.08 * projects.length}>
              <div 
                onClick={() => document.dispatchEvent(new CustomEvent("trigger-doom-egg"))}
                className="group block cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-b border-border hover:border-primary/45 transition-colors duration-300">
                  {/* Track number */}
                  <span className="font-mono text-xs text-muted-foreground w-12 flex-shrink-0">
                    {String(projects.length + 1).padStart(2, "0")} —
                  </span>

                  {/* Title + Subtitle */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-display text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors duration-300 italic">
                      B-SIDE: Metal Fingers
                    </h3>
                    <p className="text-sm text-muted-foreground">Tributo ao vilão mascarado e colecionáveis analógicos</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 md:flex-shrink-0">
                    <span className="font-mono text-xs text-muted-foreground">Homenagem</span>
                    <span className="font-mono text-xs text-muted-foreground">ALL CAPS</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 hidden md:block" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.3} className="pt-8">
            <Link href="/projects">
              <Button variant="ghost" className="border border-border text-muted-foreground hover:border-primary hover:text-foreground px-6 py-4 rounded text-sm transition-all duration-300">
                Ver todos os projetos
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ ACT IV — SERVICES ═══════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div {...sectionEntry} className="space-y-4 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">04 — Services</span>
            <h2 className="font-display text-3xl md:text-5xl font-light italic tracking-tight text-foreground leading-[1.1]">
              Produção disponível.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {Object.values(siteConfig.services).map((service, index) => (
              <AnimatedSection key={service.title} delay={0.1 * index}>
                <div className="group bg-background p-8 md:p-10 space-y-4 hover:bg-card transition-colors duration-300 relative">
                  {/* Gold left bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-transparent group-hover:bg-primary transition-colors duration-300" />

                  <h3 className="font-display text-lg md:text-xl font-medium text-foreground italic">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
                    <span>Prazo: <span className="text-foreground">{service.delivery}</span></span>
                    <span>
                      Investimento:{" "}
                      <span className="text-primary font-medium">
                        {service.startingPrice === "Sob consulta" ? "Sob consulta" : `a partir de ${service.startingPrice}`}
                      </span>
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="pt-12 text-center">
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground font-semibold hover:bg-[#080808] hover:text-primary hover:border-primary border border-transparent hover:border-primary transition-all duration-300 px-8 py-5 rounded text-sm">
                Falar sobre seu projeto <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div {...sectionEntry} className="space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">05 — FAQ</span>
              <h2 className="font-display text-3xl md:text-4xl font-light italic tracking-tight text-foreground leading-[1.1]">
                Perguntas frequentes.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Dúvidas sobre processo, contrato e suporte.
              </p>
            </motion.div>

            <div className="lg:col-span-2 space-y-0">
              {faqs.map((faq, index) => (
                <AnimatedSection key={index} delay={0.08 * index}>
                  <div className="border-b border-border">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between py-6 text-left font-sans font-medium text-foreground hover:text-primary transition-colors text-sm md:text-base"
                    >
                      <span>{faq.question}</span>
                      {activeFaq === index ? (
                        <Minus className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>

                    {activeFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="pb-6 text-sm text-muted-foreground leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ACT V — CONTACT CTA ═══════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-6 text-center max-w-2xl space-y-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">06 — Contact</span>
          <h2 className="font-display text-4xl md:text-6xl font-light italic tracking-tight text-foreground leading-[1.05]">
            O que você quer construir?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Se você quer algo que dure, fala comigo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground font-semibold hover:bg-[#080808] hover:text-primary hover:border-primary border border-transparent hover:border-primary transition-all duration-300 px-8 py-5 rounded text-sm">
                {siteConfig.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Tempo médio de resposta: {siteConfig.metrics.responseTime}.
          </p>
        </div>
      </section>
    </div>
  )
}
