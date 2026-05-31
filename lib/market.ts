import { MarketProduct } from "@/types/market"

export const marketProducts: MarketProduct[] = [
  {
    id: "1",
    slug: "kanban-pro",
    title: "Kanban Pro",
    type: "SaaS",
    tagline: "Gestão de tarefas com IA integrada",
    description:
      "SaaS completo com autenticação, planos de assinatura via Stripe, integração com OpenAI (sugestões automáticas de prioridades e geração de subtarefas) e painel administrativo. Deploy-ready na Vercel.",
    screenshots: [
      { src: "/market/kanban-1.png", alt: "Dashboard Kanban", caption: "Dashboard principal com métricas de produtividade" },
      { src: "/market/kanban-2.png", alt: "Quadro Kanban", caption: "Visualização em colunas com arrastar e soltar" }
    ],
    stack: ["Next.js", "React", "Supabase", "Stripe", "OpenAI", "Tailwind CSS"],
    features: [
      "Autenticação completa (OAuth, Magic Link e E-mail/Senha)",
      "Assinaturas recorrentes com Stripe Customer Portal",
      "Sugestões de tarefas baseadas em IA (GPT-4)",
      "Painel de administração de usuários integrado",
      "Pronto para deploy na Vercel e Railway"
    ],
    price: 897,
    currency: "R$",
    buyUrl: "https://stripe.com",
    available: true
  },
  {
    id: "2",
    slug: "finflow",
    title: "FinFlow",
    type: "MVP",
    tagline: "Motor financeiro transacional pronto para uso",
    description:
      "Plataforma de gestão financeira pessoal ou empresarial com conciliação automática de extratos bancários (OFX/PDF), gráficos de fluxo de caixa em tempo real e notificações automáticas de vencimento.",
    screenshots: [
      { src: "/market/finflow-1.png", alt: "Painel Financeiro", caption: "Visão geral das receitas, despesas e saldo atual" },
      { src: "/market/finflow-2.png", alt: "Conciliação", caption: "Interface intuitiva para conciliar transações importadas" }
    ],
    stack: ["React", "Node.js", "Prisma", "PostgreSQL", "Tailwind CSS", "Recharts"],
    features: [
      "Fluxo transacional ACID (garantia de consistência de saldos)",
      "Gráficos interativos de receitas, despesas e saldo projetado",
      "Importação inteligente de arquivos de extrato (OFX e CSV)",
      "Relatórios prontos para exportação em PDF e Excel",
      "Alertas de contas a pagar via WhatsApp e E-mail"
    ],
    price: 1497,
    currency: "R$",
    buyUrl: "https://stripe.com",
    available: true
  },
  {
    id: "3",
    slug: "scrapermax",
    title: "ScraperMax",
    type: "Script",
    tagline: "Automação de scraping para tribunais judiciais",
    description:
      "Script robusto em Node.js com Puppeteer para consulta, monitoramento e extração de processos jurídicos em múltiplos tribunais (TJSP, TJRJ, TRF). Inclui suporte a rotação de proxies e quebra de CAPTCHAs simples.",
    screenshots: [
      { src: "/market/scraper-1.png", alt: "Interface CLI", caption: "Console de execução com logs de scraping em tempo real" },
      { src: "/market/scraper-2.png", alt: "Dados Estruturados", caption: "Visualização dos dados processuais extraídos e organizados" }
    ],
    stack: ["Node.js", "Puppeteer", "TypeScript", "PostgreSQL", "Prisma"],
    features: [
      "Scraping automatizado de andamentos processuais",
      "Sistema de filas robusto com BullMQ",
      "Estratégia nativa anti-bloqueio e rotação de proxies",
      "Exportação de dados estruturados em JSON ou banco de dados",
      "Integração rápida com webhooks externos"
    ],
    price: 349,
    currency: "R$",
    buyUrl: "https://stripe.com",
    available: true
  },
  {
    id: "4",
    slug: "venda-landing-page",
    title: "Venda+ Landing Page",
    type: "Landing Page",
    tagline: "Template de alta conversão para infoprodutos e SaaS",
    description:
      "Uma landing page otimizada com seções prontas para Hero, Benefícios, FAQ, Depoimentos, Planos e FAQ. Totalmente adaptada para SEO e com pontuação máxima no Google Lighthouse.",
    screenshots: [
      { src: "/market/landing-1.png", alt: "Hero Section", caption: "Seção de conversão principal com headline marcante" },
      { src: "/market/landing-2.png", alt: "Seção de Preços", caption: "Tabela de preços interativa e comparativa" }
    ],
    stack: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    features: [
      "Componentes com micro-interações incríveis",
      "Estrutura otimizada para alta conversão comercial",
      "Design moderno e limpo com suporte a Dark/Light Mode",
      "Configuração SEO avançada integrada",
      "Formulário de captura de leads integrado ao Resend"
    ],
    price: 199,
    currency: "R$",
    buyUrl: "https://stripe.com",
    available: false
  }
]
