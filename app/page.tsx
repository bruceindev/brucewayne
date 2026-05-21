"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Bot,
  DollarSign,
  Layers,
  Terminal,
  TrendingUp,
  Clock,
  BookOpen,
  HelpCircle,
  Plus,
  Minus,
  ShieldCheck,
  FolderGit2,
  Zap,
  LayoutDashboard
} from "lucide-react"

const getServiceIcon = (title: string) => {
  if (title.toLowerCase().includes("landing")) return <Layers className="h-6 w-6 text-neon-lime" />
  if (title.toLowerCase().includes("mvp")) return <Zap className="h-6 w-6 text-neon-lime" />
  if (title.toLowerCase().includes("sistema") || title.toLowerCase().includes("interno")) return <LayoutDashboard className="h-6 w-6 text-neon-lime" />
  return <Bot className="h-6 w-6 text-neon-lime" />
}

const getServiceDescription = (title: string) => {
  if (title.toLowerCase().includes("landing")) {
    return "Páginas otimizadas para conversão, integradas com analytics e prontas para campanhas de tráfego pago."
  }
  if (title.toLowerCase().includes("mvp")) {
    return "Produto mínimo viável funcional para validar sua ideia com usuários reais e investidores rapidamente."
  }
  if (title.toLowerCase().includes("sistema") || title.toLowerCase().includes("interno")) {
    return "Automação de processos, painéis gerenciais, dashboards interativos e integração com APIs de terceiros."
  }
  return "Implementação personalizada de IA generativa, agentes conversacionais e automação cognitiva no seu produto."
}
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedSection from "@/components/ui/animated-section"
import GridPattern from "@/components/ui/grid-pattern"
import { projects } from "@/lib/projects"
import { siteConfig } from "@/config/site"

export default function Page() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const metrics = [
    { value: siteConfig.services.mvp.delivery, label: "MVPs Funcionais", detail: "Entregues de ponta a ponta" },
    { value: siteConfig.services.landingPage.delivery, label: "Landing Pages", detail: "De alta conversão" },
    { value: siteConfig.services.system.delivery, label: "Sistemas Internos", detail: "Automações & Dashboards" },
    { value: siteConfig.metrics.supportDays, label: "Suporte Grátis", detail: "Pós-entrega sem custo extra" }
  ]

  const workflowSteps = [
    {
      step: "01",
      title: "Alinhamento e Escopo Fixo",
      description: "Definição clara e exata do projeto nas primeiras 48h. Escopo fixo e prazo fixo. Sem surpresas ou taxas adicionais no meio do caminho."
    },
    {
      step: "02",
      title: "Desenvolvimento e Feedbacks Semanais",
      description: "Construção ágil focada em entrega de valor. Você recebe versões funcionais do produto toda semana para testar e validar o rumo do projeto."
    },
    {
      step: "03",
      title: "Entrega, Documentação e Deploy",
      description: "Deploy do sistema configurado em ambientes produtivos (Vercel, AWS ou Railway). Entrega de documentação completa em português inclusa."
    },
    {
      step: "04",
      title: `${siteConfig.metrics.supportDays} de Suporte Grátis`,
      description: "Suporte pós-entrega completo e sem custos adicionais para garantir que sua equipe utilize o sistema sem atritos."
    }
  ]

  const faqs = [
    {
      question: "Como funciona a entrega com prazo e escopo fixos?",
      answer: "Antes do início do desenvolvimento, nós mapeamos exatamente as funcionalidades essenciais para o seu objetivo comercial. Criamos uma especificação técnica simplificada. O preço cobrado e o prazo de entrega estabelecidos são garantidos em contrato: você sabe exatamente quanto vai gastar e quando vai receber, sem surpresas de cobranças extras por retrabalho comum no mercado."
    },
    {
      question: "Qual o prazo típico para o desenvolvimento de um MVP?",
      answer: `A maioria dos MVPs funcionais é concluída em ${siteConfig.services.mvp.delivery}. Landing pages de alta conversão costumam ser entregues em até ${siteConfig.services.landingPage.delivery}, e sistemas internos mais robustos (como CRUDs complexos e dashboards financeiros) levam de ${siteConfig.services.system.delivery}.`
    },
    {
      question: `Como funciona o suporte de ${siteConfig.metrics.supportDays} pós-entrega?`,
      answer: `Após o deploy em produção, eu forneço ${siteConfig.metrics.supportDays} de suporte sem custo adicional. Isso cobre correção de eventuais bugs, ajustes finos de layout, auxílio na configuração operacional e treinamento básico da equipe para utilizar o sistema.`
    },
    {
      question: "O código do projeto e a infraestrutura serão meus?",
      answer: "Sim, 100% de todo o código-fonte desenvolvido é transferido para o seu repositório do GitHub. Também configuro as contas de hospedagem (Vercel, AWS ou Railway) no nome do cliente ou da empresa, garantindo total autonomia jurídica e técnica sobre a propriedade intelectual."
    },
    {
      question: "Qual a velocidade média de resposta do suporte?",
      answer: `Como desenvolvedor freelancer sênior focado em atendimento ágil, respondo a chamados e dúvidas técnicas em até ${siteConfig.metrics.responseTime} dentro do horário comercial (Seg a Sex das 09h às 18h).`
    }
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background Hero Pattern */}
      <div className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36">
        <GridPattern type="grid" />
        
        {/* Glowing Neon ambient details */}
        <div className="absolute top-[20%] left-[10%] h-[300px] w-[300px] rounded-full bg-neon-lime/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] h-[300px] w-[300px] rounded-full bg-neon-lime/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Status Badge */}
            <AnimatedSection delay={0.1} className="flex justify-center">
              <Badge variant={siteConfig.hero.available ? "neon" : "outline"} dot>
                {siteConfig.hero.available ? siteConfig.hero.availabilityLabel : "Indisponível no momento"}
              </Badge>
            </AnimatedSection>

            {/* Headline */}
            <AnimatedSection delay={0.2}>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1] md:leading-[1.05]">
                {siteConfig.hero.headline.includes("IA integrada") ? (
                  <>
                    {siteConfig.hero.headline.split("IA integrada")[0]}
                    <span className="text-neon-lime neon-glow">IA integrada</span>
                    {siteConfig.hero.headline.split("IA integrada")[1]}
                  </>
                ) : (
                  siteConfig.hero.headline
                )}
              </h1>
            </AnimatedSection>

            {/* Subheadline */}
            <AnimatedSection delay={0.3} className="max-w-2xl mx-auto">
              <p className="text-base text-muted-foreground sm:text-xl leading-relaxed">
                {siteConfig.hero.subheadline}
              </p>
            </AnimatedSection>

            {/* CTAs */}
            <AnimatedSection delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-neon-lime text-black font-semibold hover:bg-neon-lime/90 hover:shadow-[0_0_20px_rgba(191,255,0,0.5)] transition-all duration-350 px-8 py-6 rounded-lg text-base">
                  {siteConfig.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/projects" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 hover:border-white/20 hover:bg-white/5 px-8 py-6 rounded-lg text-base text-white">
                  {siteConfig.hero.ctaSecondary}
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="border-t border-b border-white/5 bg-[#09090a]/80 backdrop-blur-sm py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            {metrics.map((metric, index) => (
              <AnimatedSection
                key={metric.label}
                delay={0.1 * index}
                className="flex flex-col items-center text-center space-y-2"
              >
                <span className="font-display text-3xl font-extrabold text-neon-lime md:text-5xl neon-glow">
                  {metric.value}
                </span>
                <span className="font-semibold text-white text-sm md:text-base">
                  {metric.label}
                </span>
                <span className="text-xs text-muted-foreground max-w-[150px]">
                  {metric.detail}
                </span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16 space-y-4">
            <Badge variant="outline">Serviços & Especialidades</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Modelos de entrega focados em resultado.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Soluções completas com prazos milimétricos e orçamento fixo, adaptadas à realidade comercial do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(siteConfig.services).map((service, index) => (
              <AnimatedSection key={service.title} delay={0.1 * index}>
                <Card glow className="h-full flex flex-col justify-between border-white/5 hover:border-neon-lime/20 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neon-lime/10 border border-neon-lime/20 text-neon-lime">
                      {getServiceIcon(service.title)}
                    </div>
                    <CardTitle className="text-xl font-bold text-white font-display leading-tight">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed h-[60px] overflow-hidden">
                      {getServiceDescription(service.title)}
                    </p>
                    <div className="flex flex-col gap-2 font-mono text-xs text-muted-foreground border-t border-white/5 pt-4">
                      <div className="flex justify-between items-center gap-2">
                        <span>Prazo de entrega:</span>
                        <span className="text-white font-semibold whitespace-nowrap">{service.delivery}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span>Investimento:</span>
                        <span className="text-neon-lime font-semibold text-sm whitespace-nowrap">
                          {service.startingPrice === "Sob consulta" ? "Sob consulta" : `A partir de ${service.startingPrice}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section id="projects" className="py-24 border-t border-white/5 bg-[#070708]/60 relative">
        <GridPattern type="dot" />
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl space-y-4">
              <Badge variant="outline">Casos de Sucesso</Badge>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Projetos reais, resultados medidos.
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Alguns dos sistemas complexos desenvolvidos sob medida sob o modelo de escopo fixo e alta velocidade.
              </p>
            </div>
            <div>
              <Link href="/projects">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                  Ver portfólio completo <FolderGit2 className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Projects Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <AnimatedSection key={project.slug} delay={0.15 * index}>
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
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-muted-foreground border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 4 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-muted-foreground border border-white/5">
                          +{project.stack.length - 4}
                        </span>
                      )}
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
        </div>
      </section>

      {/* Workflow Process Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-20 space-y-4">
            <Badge variant="outline">Metodologia</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Escopo Fixo. Sem surpresas ou taxas ocultas.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Um processo refinado projetado especificamente para quem precisa de código de alta performance, documentação rica e prazos milimétricos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line for large screens */}
            <div className="absolute top-8 left-[10%] right-[10%] h-[1px] bg-white/5 hidden md:block z-0" />
            
            {workflowSteps.map((step, index) => (
              <AnimatedSection
                key={step.step}
                delay={0.1 * index}
                className="relative z-10 space-y-4 bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-white/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon-lime/10 border border-neon-lime/20 text-neon-lime font-display font-bold text-xl neon-glow">
                  {step.step}
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-white/5 bg-[#09090a]/40 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <Badge variant="outline">FAQ</Badge>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Perguntas Frequentes
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Tire suas dúvidas operacionais rápidas sobre como trabalho, contratos de escopo fixo, pagamentos e suporte.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                <HelpCircle className="h-4 w-4 text-neon-lime" />
                <span>Mais dúvidas? Respondo em até 2h.</span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-white/5 bg-secondary/15 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left font-display font-medium text-white hover:text-neon-lime transition-colors"
                  >
                    <span>{faq.question}</span>
                    {activeFaq === index ? (
                      <Minus className="h-4 w-4 text-neon-lime flex-shrink-0" />
                    ) : (
                      <Plus className="h-4 w-4 text-neon-lime flex-shrink-0" />
                    )}
                  </button>
                  
                  {activeFaq === index && (
                    <div className="px-6 pb-6 text-xs text-muted-foreground leading-relaxed border-t border-white/3 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neon-lime/5 via-transparent to-transparent">
        <div className="container mx-auto px-6 text-center max-w-3xl space-y-8 relative z-10">
          <Badge variant="neon" dot>
            Contato Imediato
          </Badge>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Vamos tirar a sua ideia do papel esta semana?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
            Evite retrabalhos e custos imprevisíveis. Agende uma conversa rápida de 15 minutos para mapear o escopo do seu projeto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-neon-lime text-black font-semibold hover:bg-neon-lime/90 hover:shadow-[0_0_20px_rgba(191,255,0,0.4)] transition-all px-8 py-6 rounded-lg text-base">
                {siteConfig.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 hover:border-white/20 px-8 py-6 rounded-lg text-base text-white">
                Ver estudos de caso
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-neon-lime" /> Garantia de Entrega
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-neon-lime" /> SLA de resposta de {siteConfig.metrics.responseTime}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-neon-lime" /> Documentação inclusa
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
