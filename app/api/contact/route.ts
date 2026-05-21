import { NextResponse } from "next/server"
import * as z from "zod"
import { Resend } from "resend"
import { siteConfig } from "@/config/site"

const contactSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  empresa: z.string().optional().nullable(),
  orcamento: z.string().min(1),
  detalhes: z.string().min(10)
})

export async function POST(request: Request) {
  try {
    // Check if API Key is configured on the server
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          message: "A chave de API do Resend não está configurada no servidor." 
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Dados de formulário inválidos.", 
          errors: result.error.format() 
        },
        { status: 400 }
      )
    }

    const { nome, email, empresa, orcamento, detalhes } = result.data

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: siteConfig.contact.email,
      subject: `💼 Nova Proposta - ${nome}`,
      html: `
        <h2>Nova oportunidade recebida do portfólio</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${empresa || "Não informada"}</p>
        <p><strong>Orçamento:</strong> ${orcamento}</p>
        <p><strong>Detalhes:</strong></p>
        <p>${detalhes}</p>
      `
    })

    if (error) {
      console.error("[Resend Error]:", error)
      return NextResponse.json(
        { 
          success: false, 
          message: `Erro ao enviar e-mail: ${error.message || "Falha na API do Resend"}` 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Proposta de escopo recebida com sucesso. Retornaremos em até 2 horas!",
      id: data?.id
    })

  } catch (error) {
    console.error("[API Contact Error]:", error)
    const errMsg = error instanceof Error ? error.message : "Erro desconhecido no servidor"
    return NextResponse.json(
      { success: false, message: `Erro interno ao processar contato: ${errMsg}` },
      { status: 500 }
    )
  }
}
