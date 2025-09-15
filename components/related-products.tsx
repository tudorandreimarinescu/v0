import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/supabase/products"
import { Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  slug: string
  brand: string
  image_url: string
  base_price: number
  default_currency: string
  category?: {
    name: string
    slug: string
  }
  translations?: {
    name: string
    short_desc: string
    locale: string
  }[]
}

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-light text-white">
        <span className="font-medium italic instrument">Related</span> Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const translation = product.translations?.find((t) => t.locale === "en") || product.translations?.[0]
          const productName = translation?.name || `${product.brand} Product`
          const productDesc = translation?.short_desc || "Premium shader product"

          return (
            <Card
              key={product.id}
              className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <CardHeader className="p-0">
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-t-lg overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg?height=200&width=300&query=shader"}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-white/10 text-white/80 text-xs">
                    {product.category?.name || "Shader"}
                  </Badge>
                  <span className="text-sm font-semibold text-white">
                    {formatPrice(product.base_price, product.default_currency)}
                  </span>
                </div>
                <CardTitle className="text-white text-sm mb-1">{productName}</CardTitle>
                <CardDescription className="text-white/60 text-xs line-clamp-2">{productDesc}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Link href={`/product/${product.slug}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/20 text-white bg-transparent hover:bg-white/10"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </Link>
                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                  <ShoppingCart className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
