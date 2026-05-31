export type ProductType = 'SaaS' | 'MVP' | 'Script' | 'Landing Page'

export interface Screenshot {
  src: string    // caminho em /public/market/ ou URL externa
  alt: string
  caption: string  // ex: "Dashboard principal"
}

export interface MarketProduct {
  id: string
  slug: string
  title: string
  type: ProductType
  tagline: string        // frase curta de venda — max 60 chars
  description: string    // descrição completa para o modal
  screenshots: Screenshot[]  // mínimo 2
  stack: string[]
  features: string[]     // lista do que está incluído no produto
  price: number
  currency: 'R$' | 'USD'
  buyUrl: string         // Stripe, Gumroad, Lemon Squeezy etc.
  available: boolean     // false = badge "Em breve", botão desabilitado
}
