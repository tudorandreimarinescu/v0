import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shop - Premium Shader Products",
  description: "Browse our collection of premium shader experiences, templates, and digital tools.",
}

const products = [
  {
    id: "cosmic-waves",
    name: "Cosmic Waves Shader",
    description: "Mesmerizing wave patterns with cosmic lighting effects",
    price: "$29.99",
    category: "Shaders",
    image: "/placeholder-guu82.png",
  },
  {
    id: "neon-grid",
    name: "Neon Grid Template",
    description: "Retro-futuristic grid system with neon glow effects",
    price: "$19.99",
    category: "Templates",
    image: "/placeholder-kyz95.png",
  },
  {
    id: "particle-storm",
    name: "Particle Storm Kit",
    description: "Dynamic particle system with customizable storm effects",
    price: "$39.99",
    category: "Tools",
    image: "/placeholder-su9ur.png",
  },
  {
    id: "holographic-ui",
    name: "Holographic UI Pack",
    description: "Futuristic holographic interface elements and components",
    price: "$24.99",
    category: "Templates",
    image: "/placeholder-piv5b.png",
  },
  {
    id: "liquid-metal",
    name: "Liquid Metal Shader",
    description: "Realistic liquid metal surface with dynamic reflections",
    price: "$34.99",
    category: "Shaders",
    image: "/placeholder-9dldc.png",
  },
  {
    id: "aurora-lights",
    name: "Aurora Lights Effect",
    description: "Beautiful aurora borealis lighting system",
    price: "$27.99",
    category: "Shaders",
    image: "/placeholder-q6uc3.png",
  },
]

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            <span className="font-medium italic instrument">Premium</span> Shader Collection
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover our curated collection of premium shader experiences, templates, and digital tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <CardHeader className="p-0">
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-white/10 text-white/80">
                    {product.category}
                  </Badge>
                  <span className="text-lg font-semibold text-white">{product.price}</span>
                </div>
                <CardTitle className="text-white mb-2">{product.name}</CardTitle>
                <CardDescription className="text-white/60">{product.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/product/${product.id}`} className="w-full">
                  <Button className="w-full bg-white text-black hover:bg-white/90">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
