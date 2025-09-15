import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, Download, Eye } from "lucide-react"

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Mock product data - in a real app, this would come from a database
const getProduct = (slug: string) => {
  const products = {
    "cosmic-waves": {
      id: "cosmic-waves",
      name: "Cosmic Waves Shader",
      description:
        "Mesmerizing wave patterns with cosmic lighting effects that respond to user interaction. Perfect for creating immersive backgrounds and visual experiences.",
      price: "$29.99",
      category: "Shaders",
      rating: 4.8,
      reviews: 124,
      image: "/placeholder-guu82.png",
      features: [
        "Interactive wave patterns",
        "Customizable color schemes",
        "Performance optimized",
        "Cross-platform compatible",
        "Detailed documentation",
        "Source code included",
      ],
      specifications: {
        "File Format": "GLSL, HLSL",
        Compatibility: "WebGL 2.0+, OpenGL 3.3+",
        "File Size": "2.4 MB",
        License: "Commercial Use",
      },
    },
  }

  return products[slug as keyof typeof products] || null
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProduct(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - ShaderStore`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-white/20 text-white/80 bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white/80 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Demo
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="bg-white/10 text-white/80 mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-light text-white mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-white/20"
                      }`}
                    />
                  ))}
                  <span className="text-white/80 ml-2">{product.rating}</span>
                </div>
                <span className="text-white/60">({product.reviews} reviews)</span>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-semibold text-white">{product.price}</span>
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Features */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white/80">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-white/60">{key}:</dt>
                      <dd className="text-white/80">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
