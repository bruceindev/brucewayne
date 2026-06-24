export const siteConfig = {
  // --- Informações Pessoais ---
  name: "Bruce",
  role: "Full Stack. Full Culture.",
  location: "São Paulo, SP",

  // --- Copy Principal ---
  hero: {
    headline: "BRUCE.",
    subheadline:
      "Construo sistemas que não quebram às 2h da manhã. Desenvolvimento full-stack com gosto, estética e som de vinil.",
    ctaPrimary: "Falar sobre seu projeto",
    ctaSecondary: "Ver projetos",
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
    title: "BRUCE. — Full Stack Developer & Creative Engineer",
    description:
      "The other side of full stack. Sistemas de alta performance construídos com gosto, estética e cultura analógica.",
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
    responseTime: "24h",
  },
} as const;

// Helper: gera o link completo do WhatsApp com mensagem pré-preenchida
export const getWhatsAppUrl = () =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    siteConfig.contact.whatsappMessage
  )}`;
