import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, ShieldCheck, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import GridPattern from "@/components/ui/grid-pattern"
import { projects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Pre-generate routes for static build
export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug
  }))
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="relative min-h-screen py-20">
      <GridPattern type="grid" />
      <div className="absolute top-[10%] left-[5%] h-[300px] w-[300px] rounded-full bg-neon-lime/3 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-neon-lime" />
            Voltar para projetos
          </Link>
        </div>

        {/* Case Header */}
        <div className="border-b border-white/5 pb-10 mb-12 space-y-6">
          <div className="space-y-3">
            <Badge variant="neon">{project.type}</Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {project.subtitle}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-neon-lime">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Prazo</p>
                <p className="text-sm font-semibold text-white">{project.timeline}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-neon-lime">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Papel</p>
                <p className="text-sm font-semibold text-white">{project.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-neon-lime">
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Stack Principal</p>
                <p className="text-sm font-semibold text-white leading-tight">
                  {project.stack.slice(0, 3).join(", ")}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Case Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Case Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Problem Section */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight sm:text-3xl border-l-2 border-neon-lime pl-4">
                O Problema de Negócio
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.problem}
              </p>
            </section>

            {/* Solution Section */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight sm:text-3xl border-l-2 border-neon-lime pl-4">
                A Solução Desenvolvida
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.solution}
              </p>
            </section>

            {/* Technical Decisions Section */}
            <section className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight sm:text-3xl border-l-2 border-neon-lime pl-4">
                Decisões Técnicas & Arquitetura
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Opções de design de software e infraestrutura selecionadas para garantir velocidade de entrega, escalabilidade e menor custo operacional recorrente:
              </p>
              <div className="space-y-4">
                {project.technicalDecisions.map((decision) => (
                  <Card key={decision.title} className="border-white/5 bg-secondary/10">
                    <CardContent className="p-6 space-y-2">
                      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-neon-lime" />
                        {decision.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {decision.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Outcomes */}
          <div className="space-y-8">
            {/* Impact Card */}
            <Card glow className="border-neon-lime/10 bg-secondary/15">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-display text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-neon-lime" />
                  Resultados Estimados
                </h3>
                <ul className="space-y-4">
                  {project.estimatedResults.map((result, idx) => (
                    <li key={idx} className="flex gap-3 text-xs leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-neon-lime flex-shrink-0 mt-0.5" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Stack Details Card */}
            <Card className="border-white/5 bg-secondary/5">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Especificações da Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded text-xs font-mono bg-white/5 text-muted-foreground border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="border border-white/5 bg-[#09090a]/50 p-6 rounded-xl space-y-4 text-center">
              <h4 className="font-display text-lg font-bold text-white">Precisa de algo parecido?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Posso replicar estruturas semelhantes de {project.type.toLowerCase()} e adequar ao seu negócio em poucas semanas.
              </p>
              <Link href="/contact" className="block w-full">
                <Button className="w-full bg-neon-lime text-black font-semibold hover:bg-neon-lime/90 py-5 text-xs">
                  Iniciar conversa <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
