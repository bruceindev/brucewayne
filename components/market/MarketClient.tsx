"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PackageX } from "lucide-react"
import FilterBar from "./FilterBar"
import ProductCard from "./ProductCard"
import ProductModal from "./ProductModal"
import { MarketProduct, ProductType } from "@/types/market"
import AnimatedSection from "@/components/ui/animated-section"

type FilterOption = ProductType | "Todos"

interface MarketClientProps {
  products: MarketProduct[]
}

// Framer Motion Grid Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function MarketClient({ products }: MarketClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Todos")
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null)

  // Filter products based on active filter state
  const filteredProducts = products.filter(
    (product) => activeFilter === "Todos" || product.type === activeFilter
  )

  return (
    <div className="space-y-8">
      {/* Filter Options */}
      <AnimatedSection delay={0.1}>
        <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
      </AnimatedSection>

      {/* Products Grid & Transitions */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants} layout>
                  <ProductCard product={product} onViewDetails={setSelectedProduct} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center p-12 border border-white/5 bg-[#0a0a0b]/40 backdrop-blur-sm rounded-2xl max-w-md mx-auto mt-8 space-y-4"
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/10 text-white/40">
                <PackageX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-white">
                  Nenhum produto encontrado
                </h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">
                  Não encontramos nenhum produto na categoria <strong>{activeFilter}</strong> no momento. Volte em breve!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Details Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
