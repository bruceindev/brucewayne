import React from "react"
import { Metadata } from "next"
import ContactClient from "./ContactClient"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale diretamente com Bruce para orçamentos e viabilidade técnica de MVPs, Landing Pages de alta conversão, Integrações de IA e Sistemas sob medida.",
  openGraph: {
    title: `Contato | ${siteConfig.name}`,
    description: "Inicie o projeto do seu sistema sob medida, MVP ou Landing Page de alto desempenho com Bruce.",
    url: `${siteConfig.seo.url}/contact`,
  }
}

export default function ContactPage() {
  return <ContactClient />
}
