import { Metadata } from "next"
import GridPattern from "@/components/ui/grid-pattern"
import Badge from "@/components/ui/badge"
import MarketClient from "@/components/market/MarketClient"
import { marketProducts } from "@/lib/market"

export const metadata: Metadata = {
  title: "Market — Produtos Digitais e Scripts",
  description: "Vitrine de produtos digitais, scripts prontos, MVPs e landing pages à venda. Códigos prontos para deploy e integração rápida no seu produto.",
}

export default function MarketPage() {
  return (
    <div className="relative min-h-screen py-20">
      <GridPattern type="dot" />
      <div className="absolute top-0 right-0 h-[250px] w-[250px] rounded-full bg-neon-lime/3 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Badge variant="neon" dot>Produtos Disponíveis</Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Soluções prontas, <span className="text-neon-lime">deploy imediato.</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Adquira scripts robustos, estruturas de MVPs prontas para uso ou templates de alta conversão desenvolvidos sob o mais alto padrão de qualidade e escalabilidade.
          </p>
        </div>

        {/* Client Side Filters and Grid */}
        <MarketClient products={marketProducts} />
      </div>
    </div>
  )
}
