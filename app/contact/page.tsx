"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowRight, CheckCircle2, Clock, Mail, MessageSquare, ShieldCheck, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import GridPattern from "@/components/ui/grid-pattern"
import AnimatedSection from "@/components/ui/animated-section"
import { siteConfig, getWhatsAppUrl } from "@/config/site"

const projectOptions = [
  ...Object.values(siteConfig.services).map((s) => ({
    label: `${s.title} — ${s.startingPrice === 'Sob consulta' ? 'Sob consulta' : `a partir de ${s.startingPrice}`}`,
    value: s.title,
  })),
  { label: "Outro / Não sei ainda", value: "Outro" }
]

const contactSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve conter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  empresa: z.string().optional(),
  orcamento: z.string().min(1, { message: "Selecione uma opção de projeto ou orçamento." }),
  detalhes: z.string().min(10, { message: "Descreva seu projeto com pelo menos 10 caracteres." })
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nome: "",
      email: "",
      empresa: "",
      orcamento: "",
      detalhes: ""
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    setErrorMsg("")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || "Erro desconhecido ao enviar formulário.")
      }

      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível enviar sua mensagem no momento. Tente novamente."
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen py-20">
      <GridPattern type="grid" />
      <div className="absolute top-[30%] right-[10%] h-[350px] w-[350px] rounded-full bg-neon-lime/4 blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Information Sidebar */}
          <AnimatedSection delay={0.1} className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <Badge variant={siteConfig.hero.available ? "neon" : "outline"} dot>
                {siteConfig.hero.available ? siteConfig.hero.availabilityLabel : "Indisponível no momento"}
              </Badge>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                Vamos tirar seu projeto do papel.
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Preencha o formulário detalhando sua necessidade comercial ou entre em contato diretamente pelos canais rápidos. {siteConfig.contact.responseTime}.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                Canais Diretos
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-secondary/15 hover:border-white/10 hover:bg-secondary/25 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-lime/10 border border-neon-lime/20 text-neon-lime">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail Comercial</p>
                    <p className="text-sm font-semibold text-white font-mono group-hover:text-neon-lime transition-colors">
                      {siteConfig.contact.email}
                    </p>
                  </div>
                </a>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-secondary/15 hover:border-white/10 hover:bg-secondary/25 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-lime/10 border border-neon-lime/20 text-neon-lime">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp Instantâneo</p>
                    <p className="text-sm font-semibold text-white font-mono group-hover:text-neon-lime transition-colors">
                      +{siteConfig.contact.whatsapp}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Guarantees */}
            <div className="border border-white/5 bg-secondary/5 p-6 rounded-xl space-y-4">
              <h4 className="font-semibold text-white text-sm">Garantias inclusas no modelo de Escopo Fixo:</h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-neon-lime" />
                  <span>Escopo e Prazo definidos em contrato</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neon-lime" />
                  <span>{siteConfig.metrics.supportDays} de suporte operacional sem custos adicionais</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-neon-lime" />
                  <span>Documentação de código e arquitetura inclusa</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>

          {/* Form Card */}
          <AnimatedSection delay={0.2} className="lg:col-span-7">
            <Card glow className="border-white/5 bg-[#09090a]/50 p-2">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Mapear seu Projeto</CardTitle>
                <CardDescription>
                  Informe os detalhes básicos para alinharmos o cronograma.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {success ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neon-lime/10 border border-neon-lime/30 text-neon-lime">
                      <CheckCircle2 className="h-8 w-8 pulse-neon-dot" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Mensagem Enviada!</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Obrigado pelo contato. Analisarei as informações técnicas enviadas e responderei em até 2 horas.
                      </p>
                    </div>
                    <Button
                      onClick={() => setSuccess(false)}
                      variant="outline"
                      className="border-white/10 hover:bg-white/5 text-white"
                    >
                      Enviar outra mensagem
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Seu nome *
                      </label>
                      <input
                        {...register("nome")}
                        type="text"
                        placeholder="Ex: João da Silva"
                        className="w-full bg-secondary/20 border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-neon-lime/40 focus:bg-secondary/30 transition-all"
                      />
                      {errors.nome && (
                        <p className="text-[10px] text-destructive">{errors.nome.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        E-mail para contato *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Ex: joao@empresa.com"
                        className="w-full bg-secondary/20 border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-neon-lime/40 focus:bg-secondary/30 transition-all"
                      />
                      {errors.email && (
                        <p className="text-[10px] text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Empresa ou Produto <span className="text-[9px] text-muted-foreground/60">(Opcional)</span>
                      </label>
                      <input
                        {...register("empresa")}
                        type="text"
                        placeholder="Ex: Minha Startup B2B"
                        className="w-full bg-secondary/20 border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-neon-lime/40 focus:bg-secondary/30 transition-all"
                      />
                    </div>

                    {/* Budget Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Tipo de Projeto / Orçamento Estimado *
                      </label>
                      <div className="relative">
                        <select
                          {...register("orcamento")}
                          className="w-full bg-secondary/20 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-lime/40 focus:bg-secondary/30 transition-all appearance-none cursor-pointer pr-10"
                        >
                          <option value="" className="bg-[#121214] text-muted-foreground">
                            Selecione o tipo de projeto/orçamento
                          </option>
                          {projectOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#121214] text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                      {errors.orcamento && (
                        <p className="text-[10px] text-destructive">{errors.orcamento.message}</p>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Detalhes do seu projeto *
                      </label>
                      <textarea
                        {...register("detalhes")}
                        rows={4}
                        placeholder="Descreva o escopo, prazos desejados ou problemas de negócios que precisam ser solucionados..."
                        className="w-full bg-secondary/20 border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-neon-lime/40 focus:bg-secondary/30 transition-all resize-none"
                      />
                      {errors.detalhes && (
                        <p className="text-[10px] text-destructive">{errors.detalhes.message}</p>
                      )}
                    </div>

                    {/* Error message */}
                    {errorMsg && (
                      <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                        {errorMsg}
                      </p>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-neon-lime text-black font-bold py-6 text-sm hover:bg-neon-lime/90 hover:shadow-[0_0_15px_rgba(191,255,0,0.35)] transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando dados...
                        </>
                      ) : (
                        <>
                          Enviar proposta de escopo
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
