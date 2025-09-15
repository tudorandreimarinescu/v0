"use client"

import { useTranslations } from "next-intl"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"

// Sample product data
const products = [
  {
    id: "1",
    name: "Ethereal Glow Shader",
    description: "A mesmerizing shader that creates ethereal glowing effects with dynamic color transitions.",
    price: 29.99,
    image: "/ethereal-glow-shader-effect.jpg",
    category: "Shaders",
    baseCurrency: "EUR",
  },
  {
    id: "2",
    name: "Paper Texture Pack",
    description: "High-quality paper textures with realistic lighting and shadow effects.",
    price: 19.99,
    image: "/paper-texture-pack.jpg",
    category: "Textures",
    baseCurrency: "EUR",
  },
  {
    id: "3",
    name: "Liquid Motion Shader",
    description: "Create stunning liquid motion effects with customizable parameters and colors.",
    price: 39.99,
    image: "/liquid-motion-shader.jpg",
    category: "Shaders",
    baseCurrency: "EUR",
  },
  {
    id: "4",
    name: "Holographic Material",
    description: "Iridescent holographic material shader with rainbow reflections.",
    price: 24.99,
    image: "/holographic-material-shader.jpg",
    category: "Materials",
    baseCurrency: "EUR",
  },
]

export default function ShopPage() {
  const t = useTranslations("shop")

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">{t("title")}</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">{t("description")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
