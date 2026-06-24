"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowRight, FolderGit2 } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/ui/animated-section"
import { projects } from "@/lib/projects"

export default function ProjectsClient() {
  const [filter, setFilter] = useState<string>("todos")

  const categories = [
    { id: "todos", label: "Todos" },
    { id: "plataforma", label: "Plataformas" },
    { id: "automação", label: "Automações" },
    { id: "infraestrutura", label: "Infra & Backend" }
  ]

  const filteredProjects = projects.filter((project) => {
    if (filter === "todos") return true
    if (filter === "plataforma") return project.type.toLowerCase().includes("plataforma")
    if (filter === "automação") return project.type.toLowerCase().includes("automação")
    if (filter === "infraestrutura") return project.type.toLowerCase().includes("infraestrutura") || project.type.toLowerCase().includes("backend")
    return true
  })

  return (
    <div className="relative min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="border-b border-border pb-10 mb-16 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Índice de Faixas / B-SIDE</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Engenharia Editorial</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light italic tracking-tight text-foreground leading-[0.95] pt-4">
            As faixas completas.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed pt-2">
            Cada projeto tem substância — problemas de engenharia do mundo real, decisões de arquitetura e resultados tangíveis documentados.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-border">
          {categories.map((cat) => {
            const isActive = filter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="relative px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="projectFilterBg"
                    className="absolute inset-0 bg-primary"
                    transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? "text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                  {cat.label}
                </span>
                {!isActive && <span className="absolute inset-0 border border-border hover:border-primary/40 transition-colors" />}
              </button>
            )
          })}
        </div>

        {/* Track-list style Projects */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-0">
            {filteredProjects.map((project, index) => (
              <AnimatedSection key={project.slug} delay={0.06 * index}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-7 border-b border-border hover:border-primary/45 transition-colors duration-300">
                    {/* Track Number */}
                    <span className="font-mono text-xs text-muted-foreground w-12 flex-shrink-0">
                      {String(index + 1).padStart(2, "0")} —
                    </span>

                    {/* Title + Info */}
                    <div className="flex-1 space-y-1.5">
                      <h3 className="font-display text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors duration-300 italic">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 md:flex-shrink-0">
                      <span className="font-mono text-xs text-muted-foreground">{project.type}</span>
                      <span className="font-mono text-xs text-muted-foreground">{project.timeline}</span>
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {project.stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[10px] font-mono border border-border text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 hidden md:block" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-border bg-card">
            <FolderGit2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-display italic text-foreground mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground text-sm">Selecione outra categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
