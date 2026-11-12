export const siteConfig = {
  // --- Informações Pessoais ---
  name: "Bruce",
  role: "Automação, IA & Dados",
  location: "São Paulo, SP",

  // --- Copy Principal ---
  hero: {
    headline: "Sistemas que não quebram às 2h da manhã.",
    subheadline:
      "Sou Ryan “Bruce” Jesus. Construo automações, agentes de IA e produtos de dados — como o MONK, que coloca clínicas e estúdios no piloto automático.",
    ctaPrimary: "Vamos conversar",
    ctaSecondary: "Ver o trabalho",
    availabilityLabel: "Disponível para projetos",
    available: true, // mude para false quando estiver ocupado
  },

  // --- Contato ---
  contact: {
    email: "euryanjesus@gmail.com",
    whatsapp: "5511934182993",
    whatsappMessage: "Olá Bruce, vim pelo seu portfólio e quero conversar sobre um projeto.",
    responseTime: "Respondo em até 24h",
  },

  // --- Redes Sociais ---
  social: {
    github: "https://github.com/bruceindev",
    linkedin: "https://linkedin.com/in/euryanjesus",
  },

  // --- SEO & Metadata ---
  seo: {
    title: "Bruce — Ryan Jesus · Automação, IA & Dados",
    description:
      "Automações que trabalham enquanto você dorme. Agentes de IA, dados e produtos como o MONK, o SaaS que coloca clínicas e estúdios no piloto automático.",
    url: "https://ryanjesus.dev", // atualize quando tiver domínio
    ogImage: "/og-image.png",
  },

  // --- Ofertas / Serviços ---
  services: {
    landingPage: {
      title: "Landing Page de Alta Conversão",
      delivery: "5 dias úteis",
      startingPrice: "R$ 650",
    },
    mvp: {
      title: "MVP Funcional",
      delivery: "2–3 semanas",
      startingPrice: "R$ 2.000",
    },
    system: {
      title: "Automação sob medida",
      delivery: "3–4 semanas",
      startingPrice: "R$ 3.500",
    },
    aiIntegration: {
      title: "Agente de IA no seu negócio",
      delivery: "Sob consulta",
      startingPrice: "Sob consulta",
    },
  },

  // --- Métricas / Social Proof ---
  metrics: {
    projectsDelivered: "+10",
    onTimeRate: "100%",
    supportDays: "30 dias",
    responseTime: "24h",
  },
} as const;

// Helper: gera o link completo do WhatsApp com mensagem pré-preenchida
export const getWhatsAppUrl = () =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    siteConfig.contact.whatsappMessage
  )}`;
