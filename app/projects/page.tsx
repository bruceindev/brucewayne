"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowRight, Filter, FolderGit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import AnimatedSection from "@/components/ui/animated-section"
import GridPattern from "@/components/ui/grid-pattern"
import { projects } from "@/lib/projects"

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>("todos")

  const categories = [
    { id: "todos", label: "Todos os Projetos" },
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
      <GridPattern type="dot" />
      <div className="absolute top-0 right-0 h-[250px] w-[250px] rounded-full bg-neon-lime/3 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Badge variant="outline">Estudos de Caso</Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Soluções completas sob medida.
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Casos detalhados que mostram o problema de negócios do cliente, as decisões de engenharia e o resultado real obtido após a entrega.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mr-2 font-mono uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5 text-neon-lime" />
            Filtrar:
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === cat.id
                  ? "bg-neon-lime text-black border-neon-lime font-bold shadow-[0_0_10px_rgba(191,255,0,0.25)]"
                  : "border-white/5 bg-secondary/15 text-muted-foreground hover:text-white hover:border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <AnimatedSection key={project.slug} delay={0.1 * index}>
                <Card glow className="overflow-hidden group h-full flex flex-col justify-between border-white/5 hover:border-neon-lime/20 transition-all duration-300">
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-neon-lime uppercase tracking-wider">
                        {project.type}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white group-hover:text-neon-lime transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Prazo de Entrega: {project.timeline}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-muted-foreground border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <Link href={`/projects/${project.slug}`}>
                      <Button className="w-full bg-secondary text-white hover:bg-neon-lime hover:text-black font-medium transition-all group/btn">
                        Ver estudo de caso
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-xl bg-secondary/5">
            <FolderGit2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground text-sm">Selecione outra categoria de filtros.</p>
          </div>
        )}
      </div>
    </div>
  )
}
