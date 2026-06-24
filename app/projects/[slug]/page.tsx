import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/lib/projects"
import ProjectGallery from "@/components/ui/ProjectGallery"
import { siteConfig } from "@/config/site"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${project.subtitle} — Case study`,
      description: project.summary,
      url: `${siteConfig.seo.url}/projects/${slug}`,
      images: [
        {
          url: project.image,
          alt: project.title,
        }
      ],
    }
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="relative min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
            Voltar para projetos
          </Link>
        </div>

        {/* Case Header */}
        <div className="border-b border-border pb-10 mb-12 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-primary/30 text-primary">
              {project.type}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-light italic tracking-tight text-foreground leading-[1.05]">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {project.subtitle}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-[0.12em] text-muted-foreground">Prazo</p>
              <p className="text-sm font-medium text-foreground">{project.timeline}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-[0.12em] text-muted-foreground">Papel</p>
              <p className="text-sm font-medium text-foreground">{project.role}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-[0.12em] text-muted-foreground">Stack Principal</p>
              <p className="text-sm font-medium text-foreground leading-tight">
                {project.stack.slice(0, 4).join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <ProjectGallery images={project.images} title={project.title} />

        {/* Case Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Problem */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl md:text-3xl font-light italic text-foreground tracking-tight border-l-2 border-primary pl-4">
                O Problema de Negócio
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                {project.problem}
              </p>
            </section>

            {/* Solution */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl md:text-3xl font-light italic text-foreground tracking-tight border-l-2 border-primary pl-4">
                A Solução Desenvolvida
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                {project.solution}
              </p>
            </section>

            {/* Technical Decisions */}
            <section className="space-y-6">
              <h2 className="font-display text-2xl md:text-3xl font-light italic text-foreground tracking-tight border-l-2 border-primary pl-4">
                Decisões Técnicas & Arquitetura
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Opções de design de software e infraestrutura selecionadas:
              </p>
              <div className="space-y-4">
                {project.technicalDecisions.map((decision) => (
                  <div key={decision.title} className="border border-border bg-card p-6 space-y-2">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-primary" />
                      {decision.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {decision.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Impact */}
            <div className="border border-primary/20 bg-card p-6 space-y-6">
              <h3 className="font-display text-lg font-medium italic text-foreground tracking-tight">
                Resultados Estimados
              </h3>
              <ul className="space-y-4">
                {project.estimatedResults.map((result, idx) => (
                  <li key={idx} className="flex gap-3 text-xs leading-relaxed text-muted-foreground font-mono">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 border border-primary/30 text-primary mt-0.5 rounded-none">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span className="font-sans text-muted-foreground">{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div className="border border-border bg-card p-6 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Stack Completa
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="border border-border bg-card p-6 space-y-4 text-center">
              <h4 className="font-display text-lg font-medium italic text-foreground">Precisa de algo parecido?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Posso replicar estruturas semelhantes e adequar ao seu negócio em poucas semanas.
              </p>
              <Link href="/contact" className="block w-full">
                <Button className="w-full bg-primary text-primary-foreground font-semibold hover:bg-[#080808] hover:text-primary hover:border-primary border border-transparent hover:border-primary transition-all duration-300 py-5 text-xs rounded-none">
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
