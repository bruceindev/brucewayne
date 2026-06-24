import { NextResponse } from "next/server"
import * as z from "zod"
import { Resend } from "resend"
import { siteConfig } from "@/config/site"

const contactSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional().nullable(),
  orcamento: z.string().min(1),
  detalhes: z.string().min(10)
})

export async function POST(request: Request) {
  try {
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

    const { nome, email, whatsapp, orcamento, detalhes } = result.data

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Format clean whatsapp link if provided
    const cleanPhone = whatsapp ? whatsapp.replace(/\D/g, "") : ""
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : ""
    
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: siteConfig.contact.email,
      subject: `💼 Nova Oportunidade: ${nome} — ${orcamento}`,
      html: `
        <div style="font-family: monospace, Courier, sans-serif; background-color: #0c0c0c; color: #f0e8d8; padding: 40px; border: 1px solid #C9A84C; max-width: 600px; margin: 0 auto; box-sizing: border-box;">
          <h2 style="font-family: Georgia, serif; font-style: italic; font-weight: 300; font-size: 22px; border-bottom: 1px solid #2A2A2A; padding-bottom: 20px; color: #C9A84C; margin-top: 0; letter-spacing: -0.5px;">
            BRUCE. — FICHA DE PROPOSTA
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 20px;">
            <tr style="border-bottom: 1px solid #1a1a1a;">
              <td style="color: #8c8c8c; padding: 8px 0; text-transform: uppercase; font-size: 10px; width: 120px; letter-spacing: 1px;">Cliente:</td>
              <td style="color: #ffffff; padding: 8px 0; font-weight: bold;">${nome}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1a1a1a;">
              <td style="color: #8c8c8c; padding: 8px 0; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">E-mail:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #C9A84C; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #1a1a1a;">
              <td style="color: #8c8c8c; padding: 8px 0; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">WhatsApp:</td>
              <td style="padding: 8px 0;">${whatsapp ? `<a href="${waLink}" style="color: #C9A84C; text-decoration: none; font-weight: bold;">${whatsapp} ↗</a>` : "<span style='color: #5a5a5a;'>Não fornecido</span>"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1a1a1a;">
              <td style="color: #8c8c8c; padding: 8px 0; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Escopo:</td>
              <td style="color: #ffffff; padding: 8px 0; font-weight: bold; text-transform: uppercase; color: #C9A84C;">${orcamento}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px;">
            <p style="color: #8c8c8c; text-transform: uppercase; font-size: 10px; margin: 0 0 10px 0; letter-spacing: 1px;">Briefing / Detalhes:</p>
            <div style="background-color: #080808; border: 1px solid #1a1a1a; padding: 20px; color: #dcdcdc; font-size: 13px; line-height: 1.6; white-space: pre-wrap; font-family: monospace;">${detalhes}</div>
          </div>
          
          <div style="margin-top: 40px; border-top: 1px solid #2A2A2A; padding-top: 25px; font-size: 9px; color: #5a5a5a; text-align: center; line-height: 1.5;">
            <p style="margin: 0; text-transform: uppercase; letter-spacing: 1px;">Enviado via Ryan Jesus Portfólio</p>
            <p style="margin: 5px 0 0 0;">Cultura Analógica • Código que não quebra às 2h da manhã</p>
          </div>
        </div>
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
      message: "Proposta de escopo recebida com sucesso. Retornaremos em breve!",
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
