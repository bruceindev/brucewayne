export interface Project {
  slug: string
  title: string
  subtitle: string
  type: string
  summary: string
  image: string
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
    image: "/projects/conexa.png",
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
    slug: "gr5",
    title: "GR5",
    subtitle: "Automação Jurídica e Processual de Alta Performance",
    type: "Automação de Processos",
    summary: "Sistema de automação com web scraping inteligente para monitoramento e extração de processos em tribunais judiciais, reduzindo erros operacionais e gargalos de consulta manual.",
    image: "/projects/gr5.png",
    stack: ["Node.js", "Express", "Puppeteer", "Web Scraping", "PostgreSQL", "Prisma", "IA"],
    timeline: "2 semanas",
    role: "Backend & Automation Engineer",
    problem: "Um escritório de advocacia de médio porte perdia prazos críticos de processos devido à consulta manual e repetitiva em dezenas de sites de tribunais diferentes. O processo manual gerava erros frequentes de digitação de números processuais e custava centenas de horas de trabalho administrativo.",
    solution: "Criação de um robô inteligente de web scraping integrado a um painel administrativo que consulta e notifica alterações de processos judiciais em tempo real, usando IA para ler e resumir movimentações jurídicas complexas.",
    technicalDecisions: [
      {
        title: "Web Scraping com Gerenciamento de Filas",
        description: "Criação de scrapers distribuídos em Node.js com Puppeteer e estratégias avançadas de rotação de proxies e tratamento de CAPTCHAs para evitar bloqueios de servidores governamentais."
      },
      {
        title: "Processamento Assíncrono com Filas de Tarefas",
        description: "Arquitetura de processamento em segundo plano robusta para escalabilidade de requisições, evitando gargalos de conexões concorrentes no banco de dados principal."
      },
      {
        title: "Integração e Triagem Inteligente",
        description: "IA integrada para ler diários oficiais digitalizados e classificar a gravidade de novas intimações judiciais automaticamente."
      }
    ],
    estimatedResults: [
      "Redução de 70% em erros operacionais de cadastros processuais nas duas primeiras semanas.",
      "Eliminação total de prazos judiciais perdidos por falhas humanas de acompanhamento.",
      "Mais de 120 horas de trabalho manual por mês economizadas para a equipe administrativa."
    ]
  },
  {
    slug: "tum",
    title: "TUM",
    subtitle: "Arquitetura de Backend Escalável e Mensageria",
    type: "Infraestrutura & Backend",
    summary: "API de alta performance com autenticação JWT robusta, armazenamento na nuvem AWS S3, mensageria via WebSockets para comunicação bidirecional e ORM Prisma.",
    image: "/projects/tum.png",
    stack: ["Node.js", "Express", "WebSockets", "Prisma", "PostgreSQL", "AWS S3", "JWT"],
    timeline: "3 semanas",
    role: "Backend Architect",
    problem: "Uma startup em crescimento rápido precisava migrar sua estrutura monolítica para uma API escalável que suportasse tráfego intenso de usuários simultâneos, carregamento instantâneo de arquivos e notificações em tempo real, mantendo os custos de nuvem sob controle.",
    solution: "Desenvolvimento de uma infraestrutura de backend focada em performance e escalabilidade, implementando autenticação JWT descentralizada, uploads de mídia diretamente para AWS S3 e conexões persistentes via WebSockets.",
    technicalDecisions: [
      {
        title: "Upload Direto e Seguro via AWS S3 Presigned URLs",
        description: "Para economizar recursos de processamento da API principal, o backend gera URLs seguras temporárias para que o app envie arquivos pesados diretamente à AWS, desonerando o servidor Node.js."
      },
      {
        title: "Mensageria e Notificações em Tempo Real com WebSockets",
        description: "Configuração de servidor WebSocket otimizado com agrupamento por canais (rooms) e entrega confiável de mensagens com baixa latência de ponta a ponta."
      },
      {
        title: "Modelagem de Dados de Alta Performance",
        description: "Otimização de queries PostgreSQL complexas através do Prisma ORM e criação de índices estratégicos para buscas e relatórios instantâneos."
      }
    ],
    estimatedResults: [
      "Suporte a mais de 10.000 conexões ativas concorrentes via WebSockets sem degradação do servidor.",
      "Tempo médio de resposta de chamadas da API reduzido para 45ms.",
      "Corte de 40% nos custos de infraestrutura por delegar o upload diretamente para o S3."
    ]
  }
]
