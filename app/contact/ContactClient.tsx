"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowRight, CheckCircle2, Mail, MessageSquare, Loader2, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
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
  nome: z.string().min(2, { message: "Por favor, digite seu nome." }),
  email: z.string().email({ message: "E-mail inválido." }),
  whatsapp: z.string().optional(),
  orcamento: z.string().min(1, { message: "Selecione uma opção." }),
  detalhes: z.string().min(10, { message: "Descreva seu projeto com pelo menos 10 caracteres." })
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactClient() {
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
      whatsapp: "",
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp || null,
          orcamento: data.orcamento,
          detalhes: data.detalhes
        })
      })

      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message || "Erro desconhecido.")
      }
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente."
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-card border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all duration-300 font-sans"

  return (
    <div className="relative min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <AnimatedSection className="space-y-4 mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Contato</span>
          <h1 className="font-display text-4xl md:text-6xl font-light italic tracking-tight text-foreground leading-[1.05]">
            O que você quer construir?
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed">
            Uma proposta. Seus dados básicos. Sem burocracia.
          </p>
        </AnimatedSection>

        {/* Direct Channels — WhatsApp first */}
        <AnimatedSection delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 border border-border bg-card hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">WhatsApp</p>
              <p className="text-sm font-medium text-foreground">Resposta mais rápida</p>
            </div>
          </a>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="group flex items-center gap-4 p-5 border border-border bg-card hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">E-mail</p>
              <p className="text-sm font-medium text-foreground">{siteConfig.contact.email}</p>
            </div>
          </a>
        </AnimatedSection>

        {/* Form — Essential fields only */}
        <AnimatedSection delay={0.2}>
          <div className="border border-border bg-card p-8 md:p-10 space-y-8">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-display italic text-foreground">Recebi sua proposta. Te respondo em até {siteConfig.metrics.responseTime}.</h3>
                </div>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="ghost"
                  className="border border-border text-muted-foreground hover:border-primary hover:text-foreground rounded text-sm"
                >
                  Enviar outra mensagem
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.12em]">
                    Seu nome *
                  </label>
                  <input
                    {...register("nome")}
                    type="text"
                    placeholder="Qual é seu nome?"
                    className={inputClass}
                  />
                  {errors.nome && (
                    <p className="text-[10px] text-destructive font-mono">{errors.nome.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.12em]">
                      Seu e-mail *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="seu@email.com"
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-destructive font-mono">{errors.email.message}</p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.12em]">
                      Seu WhatsApp / Telefone (Opcional)
                    </label>
                    <input
                      {...register("whatsapp")}
                      type="text"
                      placeholder="(11) 99999-9999"
                      className={inputClass}
                    />
                    {errors.whatsapp && (
                      <p className="text-[10px] text-destructive font-mono">{errors.whatsapp.message}</p>
                    )}
                  </div>
                </div>

                {/* Project type / Budget */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.12em]">
                    Tipo de projeto *
                  </label>
                  <div className="relative">
                    <select
                      {...register("orcamento")}
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="" className="bg-card text-muted-foreground">
                        Selecione o tipo de projeto
                      </option>
                      {projectOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  {errors.orcamento && (
                    <p className="text-[10px] text-destructive font-mono">{errors.orcamento.message}</p>
                  )}
                </div>

                {/* What do you want to build? */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.12em]">
                    O que você quer construir? *
                  </label>
                  <textarea
                    {...register("detalhes")}
                    rows={5}
                    placeholder="Descreva brevemente o problema, produto ou escopo do sistema..."
                    className={`${inputClass} resize-none`}
                  />
                  {errors.detalhes && (
                    <p className="text-[10px] text-destructive font-mono">{errors.detalhes.message}</p>
                  )}
                </div>

                {/* Error message */}
                {errorMsg && (
                  <p className="text-xs text-destructive bg-destructive/10 p-3 border border-destructive/20 font-mono">
                    {errorMsg}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-semibold py-6 text-sm hover:bg-[#080808] hover:text-primary hover:border-primary border border-transparent hover:border-primary transition-all duration-300 rounded"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando proposta...
                    </>
                  ) : (
                    <>
                      Enviar proposta
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center font-mono text-[10px] text-muted-foreground">
                  Tempo de resposta de até {siteConfig.metrics.responseTime}.
                </p>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
