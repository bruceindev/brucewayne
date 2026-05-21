
export const siteConfig = {
  // --- Informações Pessoais ---
  name: "Ryan Wayne",
  role: "Desenvolvedor Fullstack & Engenheiro de Produto",
  location: "São Paulo, SP",

  // --- Copy Principal ---
  hero: {
    headline: "Sistemas fullstack com IA integrada. Entregues em semanas, sem surpresas.",
    subheadline:
      "Construo MVPs, sistemas e landing pages para negócios que precisam de velocidade e resultado. Escopo fixo. Prazo fixo. Suporte incluso.",
    ctaPrimary: "Falar sobre seu projeto",
    ctaSecondary: "Ver projetos",
    availabilityLabel: "Disponível para projetos",
    available: true, // mude para false quando estiver ocupado
  },

  // --- Contato ---
  contact: {
    email: "euryanjesus@gmail.com",
    whatsapp: "5511934182993",
    whatsappMessage: "Olá, vim pelo seu portfólio e quero conversar sobre um projeto.",
    responseTime: "Respondo em até 2h em horário comercial",
  },

  // --- Redes Sociais ---
  social: {
    github: "https://github.com/bruceindev",
    linkedin: "https://linkedin.com/in/euryanjesus",
  },

  // --- SEO & Metadata ---
  seo: {
    title: "Ryan Jesus — Desenvolvedor Fullstack & IA",
    description:
      "Sistemas fullstack com IA integrada, MVPs e landing pages. Entrega em semanas com escopo fixo, suporte incluso e documentação em português.",
    url: "https://ryanjesus.dev", // atualize quando tiver domínio
    ogImage: "/og-image.png",
  },

  // --- Ofertas / Serviços ---
  services: {
    landingPage: {
      title: "Landing Page de Alta Conversão",
      delivery: "5 dias úteis",
      startingPrice: "R$ 500",
    },
    mvp: {
      title: "MVP Funcional",
      delivery: "2–3 semanas",
      startingPrice: "R$ 2.000",
    },
    system: {
      title: "Sistema Interno",
      delivery: "3–4 semanas",
      startingPrice: "R$ 3.500",
    },
    aiIntegration: {
      title: "IA Integrada ao Produto",
      delivery: "Sob consulta",
      startingPrice: "Sob consulta",
    },
  },

  // --- Métricas / Social Proof ---
  metrics: {
    projectsDelivered: "+10",
    onTimeRate: "100%",
    supportDays: "30 dias",
    responseTime: "2h",
  },
} as const;

// Helper: gera o link completo do WhatsApp com mensagem pré-preenchida
export const getWhatsAppUrl = () =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    siteConfig.contact.whatsappMessage
  )}`;
