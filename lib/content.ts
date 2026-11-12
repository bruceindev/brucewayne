/* ─────────────────────────────────────────────────────────
   Conteúdo da home. Tudo que é fato veio do currículo
   (public/Ryan_Jesus_Curriculo.pdf). Itens marcados com
   "EDITAR" são sugestões minhas — confirme ou troque.
   ───────────────────────────────────────────────────────── */

export type Tone = "blue" | "pink" | "lime" | "orange" | "violet" | "gold"

export const toneBg: Record<Tone, string> = {
  blue: "radial-gradient(circle at 30% 25%, #9cc6ff 0%, #3b82f6 45%, #1e3a8a 100%)",
  pink: "radial-gradient(circle at 30% 25%, #ffc2df 0%, #ec4899 50%, #831843 100%)",
  lime: "radial-gradient(circle at 30% 25%, #eaffb0 0%, #84cc16 50%, #2f5d0a 100%)",
  orange: "radial-gradient(circle at 30% 25%, #ffd7a8 0%, #f97316 50%, #7c2d12 100%)",
  violet: "radial-gradient(circle at 30% 25%, #ddd0ff 0%, #8b5cf6 50%, #3b1a7a 100%)",
  gold: "radial-gradient(circle at 30% 25%, #fff0b8 0%, #d9a93f 50%, #6b4a10 100%)",
}

export const stack = [
  "TypeScript",
  "Node.js",
  "Express",
  "Next.js",
  "React",
  "PostgreSQL",
  "Prisma",
  "Redis",
  "WhatsApp API",
  "Mercado Pago · Pix",
  "LLMs",
  "MCP Servers",
  "node-cron",
  "AWS SQS",
  "AWS Lambda",
  "Docker",
  "Java · Spring Boot",
]

export interface Skill {
  id: string
  glyph: string
  label: string
  tone: Tone
  title: string
  pitch: string
  tags: string[]
  usedIn: string
}

export const skills: Skill[] = [
  {
    id: "ai",
    glyph: "AI",
    label: "Agentes de IA",
    tone: "lime",
    title: "Agentes de IA que trabalham de verdade",
    pitch: "LLMs plugados no produto: atendimento no WhatsApp, triagem de suporte, classificação e resumo de documentos. Menos fila, menos trabalho repetitivo.",
    tags: ["LLMs", "Agentes", "Prompt Engineering", "MCP Servers", "Claude Code"],
    usedIn: "MONK · Conexa · GR5",
  },
  {
    id: "automation",
    glyph: "24/7",
    label: "Automação",
    tone: "orange",
    title: "Automação que não esquece ninguém",
    pitch: "Réguas de WhatsApp, robôs e agendadores que fazem o trabalho repetitivo sozinhos — e avisam quando algo dá errado. Na GR5, derrubei 70% dos erros dos robôs em duas semanas.",
    tags: ["WhatsApp API", "node-cron", "Filas", "Robôs", "APIs de tribunais"],
    usedIn: "MONK · GR5",
  },
  {
    id: "data",
    glyph: "SQL",
    label: "Dados",
    tone: "blue",
    title: "Dados que viram decisão",
    pitch: "PostgreSQL bem modelado, dashboards em tempo real e métricas que o dono entende: faturamento, ocupação, faltas, retorno de clientes.",
    tags: ["PostgreSQL", "Prisma", "Redis", "Dashboards", "WebSockets"],
    usedIn: "MONK · Conexa",
  },
  {
    id: "product",
    glyph: "R$",
    label: "Produto & SaaS",
    tone: "gold",
    title: "Do zero ao SaaS que cobra",
    pitch: "Planos, teste grátis, assinatura recorrente e Pix com webhooks validados. Transformo ideia em produto que fatura, não só em código.",
    tags: ["Mercado Pago", "Pix", "Assinaturas", "Webhooks", "Planos"],
    usedIn: "MONK · Conexa",
  },
  {
    id: "arch",
    glyph: "{ }",
    label: "Arquitetura",
    tone: "violet",
    title: "Arquitetura que aguenta o tranco",
    pitch: "Hexagonal, DDD, CQRS e mensageria com Outbox/Inbox. O domínio fica no centro; se um serviço cair no meio, nenhuma mensagem some no caminho.",
    tags: ["Hexagonal", "DDD", "CQRS", "AWS SQS", "Outbox / Inbox"],
    usedIn: "Conexa · MONK · Projeto TUM",
  },
  {
    id: "front",
    glyph: "Aa",
    label: "Front-end",
    tone: "pink",
    title: "Front-end que vende",
    pitch: "Next.js e React com copy de conversão. Bonito é o mínimo: a página tem que carregar rápido e transformar visita em contato.",
    tags: ["Next.js", "React", "Tailwind", "Framer Motion", "Three.js"],
    usedIn: "MONK · Vogel · Termite",
  },
]

export interface Experience {
  id: string
  company: string
  short: string
  role: string
  period: string
  kicker: string
  bullets: string[]
  tags: string[]
}

export const experiences: Experience[] = [
  {
    id: "monk",
    short: "MONK",
    company: "MONK",
    role: "Fundador & engenheiro",
    period: "mai 2026 — hoje",
    kicker: "SaaS de gestão automatizada para clínicas e estúdios",
    bullets: [
      "Construí o produto inteiro: agenda, portal público de agendamento, CRM, fidelidade, pacotes e lista de espera.",
      "Régua de mensagens no WhatsApp (confirmação, lembrete D-1, pós-atendimento, reativação e cobrança) rodando por agendador.",
      "Pix e assinatura recorrente via Mercado Pago, com webhooks conferidos por assinatura e valor.",
      "Agente de IA que responde as clientes no WhatsApp do estúdio.",
      "600+ testes automatizados: cada promessa dos planos é provada por teste.",
    ],
    tags: ["Next.js", "Express", "Prisma", "PostgreSQL", "WhatsApp API", "Mercado Pago", "LLMs"],
  },
  {
    id: "conexa",
    short: "Conexa",
    company: "Conexa",
    role: "Product Engineer",
    period: "nov 2025 — hoje",
    kicker: "Plataforma de eventos com motor financeiro próprio",
    bullets: [
      "Plataforma full-stack de gestão de eventos com motor financeiro transacional: saques, conciliação e saldos, em Hexagonal Architecture + CQRS.",
      "Comunicação assíncrona com AWS SQS e Transactional Outbox/Inbox para garantir consistência em operações financeiras críticas.",
      "Agentes de IA com LLMs para triagem e automação do suporte técnico.",
      "Dashboards financeiros em tempo real com React e WebSockets.",
    ],
    tags: ["Hexagonal", "CQRS", "AWS SQS", "LLMs", "WebSockets"],
  },
  {
    id: "gr5",
    short: "GR5",
    company: "GR5 Inteligência em Processos",
    role: "Dev. de Automação (estágio)",
    period: "jun 2025 — out 2025",
    kicker: "Automação jurídica em ambiente de alta responsabilidade",
    bullets: [
      "Automatizei processos jurídicos críticos com integração de APIs de tribunais e grandes volumes de dados.",
      "Reduzi em 70% os erros operacionais em duas semanas, refatorando robôs e tratando dados de forma robusta.",
      "Defini com stakeholders regras de classificação e sumarização de documentos via IA.",
    ],
    tags: ["Automação", "APIs de tribunais", "IA", "Dados"],
  },
  {
    id: "tum",
    short: "Projeto TUM",
    company: "Projeto TUM",
    role: "Desenvolvedor Full Stack",
    period: "jun 2024 — fev 2025",
    kicker: "Backend com DDD do zero",
    bullets: [
      "Arquitetei o backend com Node.js e Prisma aplicando DDD: domínio, aplicação e infraestrutura separados.",
      "Autenticação JWT com refresh token rotation, upload via AWS S3 e tempo real com WebSockets.",
    ],
    tags: ["Node.js", "Prisma", "DDD", "JWT", "S3"],
  },
  {
    id: "senac",
    short: "SENAC",
    company: "Centro Universitário SENAC",
    role: "Análise e Desenvolvimento de Sistemas",
    period: "2024 — hoje",
    kicker: "Graduação + publicação acadêmica",
    bullets: [
      "Artigo publicado: “AWS Lambda e Serverless Architecture: Padrões de Design em Sistemas Distribuídos” (2026).",
      "AWS Academy Graduate — Cloud Foundations.",
      "Full Stack (Alura), Backend Java (Santander), SQL Foundations (Oracle).",
    ],
    tags: ["Serverless", "AWS", "Pesquisa"],
  },
]

export type GoalStatus = "done" | "doing" | "next"

export interface Goal {
  title: string
  note: string
  status: GoalStatus
  when: string
}

/* EDITAR: as metas "doing"/"next" são sugestões. Troque pelas suas reais. */
export const goals: Goal[] = [
  { title: "Lançar meu próprio SaaS", note: "MONK — gestão no piloto automático para estúdios", status: "done", when: "2026" },
  { title: "Publicar um artigo acadêmico", note: "AWS Lambda & Serverless — SENAC", status: "done", when: "2026" },
  { title: "Relançar o MONK", note: "Versão nova, mais estável e com IA no WhatsApp", status: "doing", when: "2026" },
  { title: "Concluir ADS no SENAC", note: "Graduação em andamento", status: "doing", when: "2026" },
  { title: "Inglês B1 → C1", note: "Hoje: EF SET B1. Meta: conversar sem legenda mental", status: "doing", when: "2027" },
  { title: "100 estúdios pagantes no MONK", note: "Crescer com clientes reais, não com investidor", status: "next", when: "2027" },
  { title: "AWS Solutions Architect – Associate", note: "Próximo passo depois do Cloud Foundations", status: "next", when: "2027" },
  { title: "Trabalhar com um time internacional", note: "Remoto, produto com escala global", status: "next", when: "2027" },
]

export const faqs = [
  {
    q: "Você é freelancer ou está procurando vaga?",
    a: "Os dois cabem. Hoje meu foco é o MONK, e pego projetos selecionados de automação e IA com escopo fechado. Se você é recrutador, meu currículo está a um clique no topo da página.",
  },
  {
    q: "Como funciona prazo e escopo fixos?",
    a: "Antes de codar, mapeamos o essencial juntos. Preço e prazo ficam no contrato: sem surpresa e sem cobrança extra por retrabalho meu.",
  },
  {
    q: "O código e a infra são meus?",
    a: "100%. O código vai pro seu GitHub e as contas de hospedagem ficam no seu nome. Você não fica refém de mim.",
  },
  {
    q: "E depois que entrega?",
    a: "30 dias de suporte sem custo: bugs, ajustes de layout, configuração e um treinamento básico do time.",
  },
]
