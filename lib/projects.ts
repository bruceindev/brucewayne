export interface Project {
  slug: string
  title: string
  subtitle: string
  type: string
  summary: string
  image: string
  images: string[]
  stack: string[]
  timeline: string
  role: string
  problem: string
  solution: string
  technicalDecisions: {
    title: string
    description: string
  }[]
  estimatedResults: string[]
}

export const projects: Project[] = [
  {
    slug: "conexa",
    title: "Conexa",
    subtitle: "Plataforma de Eventos de Grande Porte",
    type: "Plataforma Fullstack",
    summary: "Plataforma de gestão e venda de ingressos para eventos com motor financeiro transacional integrado e agentes de IA para triagem de suporte em tempo real.",
    image: "/projects/conexa/CONEXA_1.png",
    images: ["/projects/conexa/CONEXA_1.png"],
    stack: ["Next.js", "React", "Node.js", "Express", "PostgreSQL", "Prisma", "LLMs", "Zod"],
    timeline: "3 semanas",
    role: "Lead Fullstack Developer",
    problem: "A organização de eventos de grande porte sofria com atrasos no recebimento de repasses de vendas de ingressos, além de um alto custo operacional para responder a dúvidas repetitivas de usuários antes e durante as vendas, resultando em perda de conversões e insatisfação.",
    solution: "Desenvolvimento de uma plataforma completa com processamento próprio de transações financeiras (taxas de serviço customizadas, conciliação de saldos e saques automáticos) e integração de um agente de IA treinado com as regras de cada evento para resolver dúvidas comuns instantaneamente.",
    technicalDecisions: [
      {
        title: "Motor Transacional Customizado com PostgreSQL",
        description: "Construção de um fluxo de transações ACID em banco de dados usando Prisma, garantindo consistência estrita de saldos e prevenção de race conditions durante compras simultâneas de ingressos."
      },
      {
        title: "Integração de LLMs no Suporte",
        description: "Implementação de assistente baseado em inteligência artificial via API REST que ingere a base de conhecimento de cada evento dinamicamente, filtrando e respondendo dúvidas de reembolso e credenciamento sem intervenção humana em 92% dos casos."
      },
      {
        title: "Arquitetura Next.js App Router para Velocidade",
        description: "Uso de Server Components para renderização estática das páginas públicas dos eventos, reduzindo a latência inicial e otimizando o SEO para indexação imediata no Google."
      }
    ],
    estimatedResults: [
      "Redução imediata de 65% nos chamados abertos no suporte durante os dias de abertura de vendas.",
      "Margem de lucro de operações aumentada em 12% por evitar taxas abusivas de gateways terceiros de ingresso.",
      "Tempo de resposta do cliente final reduzido para menos de 10 segundos através de agentes de IA."
    ]
  },
  {
    slug: "termite",
    title: "Termite",
    subtitle: "Portfólio de Ilustrador e Quadrinista Premium",
    type: "Landing Page / Portfólio",
    summary: "Portfólio artístico customizado e de alta performance para ilustrador e quadrinista, com sistema de comissões interativo e galeria de alta fidelidade.",
    image: "/projects/termite-portfolio/image.png",
    images: [
      "/projects/termite-portfolio/image.png",
      "/projects/termite-portfolio/image (1).png",
      "/projects/termite-portfolio/image (2).png",
      "/projects/termite-portfolio/image4.png"
    ],
    stack: ["Next.js", "React", "Framer Motion", "TailwindCSS", "Cloudinary", "SEO"],
    timeline: "1 semana",
    role: "Lead Fullstack Developer",
    problem: "Um artista digital precisava de um espaço próprio premium para expor seus trabalhos de ilustração e agendar comissões de desenhos sem as limitações e taxas de redes sociais ou plataformas prontas.",
    solution: "Desenvolvimento de um portfólio customizado com galeria interativa de alta resolução, painel explicativo do fluxo de comissões e formulário otimizado para solicitação de orçamentos.",
    technicalDecisions: [
      {
        title: "Galeria Responsiva de Alta Resolução",
        description: "Exibição otimizada de imagens pesadas através de lazy loading agressivo e CDN de entrega rápida, mantendo tempos de resposta baixos."
      },
      {
        title: "Layout Imersivo Escuro (Editorial)",
        description: "Design focado em dar destaque total às ilustrações e cores do artista, usando preto vinil e tipografia marcante."
      },
      {
        title: "Fluxo de Comissões Simplificado",
        description: "Tabelas interativas exibindo o que o artista faz, o que não faz e a precificação de cada tipo de serviço de forma transparente."
      }
    ],
    estimatedResults: [
      "Aumento de 80% nos pedidos de comissão nas primeiras 3 semanas após o lançamento.",
      "Redução de chamados com dúvidas sobre precificação devido ao painel detalhado de termos.",
      "Lighthouse Performance e Acessibilidade acima de 95."
    ]
  },
  {
    slug: "selfheal",
    title: "SelfHeal",
    subtitle: "Sistema Integrado de Gestão e Triagem Clínica",
    type: "Plataforma SaaS",
    summary: "Plataforma completa de gestão clínica com chatbot inteligente integrado para triagem automatizada de sintomas, prontuário eletrônico e painel analítico em tempo real.",
    image: "/projects/selfheal-project/image.png",
    images: [
      "/projects/selfheal-project/image.png",
      "/projects/selfheal-project/image (1).png",
      "/projects/selfheal-project/image (2).png"
    ],
    stack: ["React", "Vite", "Node.js", "TypeScript", "PostgreSQL", "TailwindCSS", "Chatbot IA"],
    timeline: "3 semanas",
    role: "Lead Fullstack Architect",
    problem: "Clínicas de saúde de médio porte sofrem com gargalos no primeiro atendimento, resultando em recepções lotadas, atraso na coleta de sintomas prévios e prontuários médicos mal estruturados preenchidos às pressas.",
    solution: "Uma plataforma integrada onde a triagem de pré-atendimento é feita por um chatbot de inteligência artificial humanizado, gerando resumos estruturados diretos no prontuário eletrônico do médico antes da consulta.",
    technicalDecisions: [
      {
        title: "Chatbot de Triagem com Processamento de Linguagem Natural",
        description: "Integração de agente de IA contextual que conversa com o paciente, extrai sintomas principais e categoriza o nível de urgência clínica antes do atendimento."
      },
      {
        title: "Painel Analítico (Dashboard) em Tempo Real",
        description: "Desenvolvimento de uma interface administrativa para médicos e recepcionistas, exibindo tempos de espera, volume de atendimentos e métricas operacionais clínicas."
      },
      {
        title: "Segurança e Prontuário Criptografado",
        description: "Implementação de conformidade de dados de saúde, com logs de auditoria detalhados e criptografia de dados sensíveis dos pacientes."
      }
    ],
    estimatedResults: [
      "Redução de 35% no tempo médio do primeiro atendimento médico em consultório.",
      "Acurácia de 94% na categorização inicial de sintomas e encaminhamento de especialidades.",
      "Satisfação de pacientes de 9.6/10 no atendimento automatizado pré-triagem."
    ]
  },
  {
    slug: "vogel",
    title: "Vogel",
    subtitle: "Landing Page de Alta Conversão para Clínica Odontológica",
    type: "Landing Page",
    summary: "Landing page de altíssimo desempenho e design premium para clínica odontológica, focada em maximizar conversões e agendamentos com carregamento instantâneo.",
    image: "/projects/vogel/image.png",
    images: ["/projects/vogel/image.png", "/projects/vogel/image (1).png"],
    stack: ["Next.js", "React", "TailwindCSS", "Framer Motion", "Lighthouse", "SEO"],
    timeline: "5 dias úteis",
    role: "Designer & Front-End Developer",
    problem: "A clínica possuía campanhas pagas ativas no Google Ads, mas a taxa de conversão da página antiga era de apenas 1.2%, gerando um custo por aquisição (CPA) insustentável. Além disso, a página demorava mais de 6 segundos para carregar no mobile.",
    solution: "Desenvolvimento de uma landing page ultra-otimizada com design minimalista de luxo, arquitetura Next.js estática e pontos de conversão estratégicos baseados em mapas de calor.",
    technicalDecisions: [
      {
        title: "Otimização Total de Performance (Lighthouse 100)",
        description: "Uso de Next.js Static Site Generation (SSG), compressão agressiva de imagens para WebP/Avif de última geração e eliminação de javascript blocante."
      },
      {
        title: "Copywriting de Alta Conversão com Prova Social",
        description: "Estruturação da narrativa focada em dores do paciente, com depoimentos em formato carrossel imersivo e CTAs de agendamento em WhatsApp integrados dinamicamente."
      },
      {
        title: "Responsividade Mobile First",
        description: "Otimização do layout mobile para operação com uma mão, facilitando o clique no CTA de agendamento rápido."
      }
    ],
    estimatedResults: [
      "Aumento imediato da taxa de conversão de leads de 1.2% para 7.8% no primeiro mês.",
      "Redução de 45% no Custo por Clique (CPC) efetivo devido ao índice de qualidade de página do Google Ads.",
      "Tempo de carregamento no mobile reduzido para menos de 0.8 segundos (Lighthouse 100/100)."
    ]
  }
]
