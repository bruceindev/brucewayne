import React from "react"
import { Metadata } from "next"
import ProjectsClient from "./ProjectsClient"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Projetos & Cases",
  description: "Explore os projetos full-stack de alta performance desenvolvidos sob medida, incluindo motores transacionais ACID, integrações de IA e design editorial premium.",
  openGraph: {
    title: `Projetos & Cases | ${siteConfig.name}`,
    description: "Explore os projetos full-stack de alta performance desenvolvidos sob medida por Bruce.",
    url: `${siteConfig.seo.url}/projects`,
  }
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
