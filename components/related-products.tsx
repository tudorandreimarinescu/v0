import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Eye } from "lucide-react"
import { getRelatedProducts } from "@/lib/supabase/products"
import { formatCurrency } from "@/lib/currency"
import { getProductThumbnail } from "@/lib/product-images"

interface RelatedProductsProps {
  productId: string
  categoryId: string
}

export default async function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(productId, categoryId, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-light text-foreground">Related Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const productThumbnail = getProductThumbnail(product)

          return (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <Link href={`/product/${product.slug}`}>
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden rounded-t-lg">
                    <img
                      src={productThumbnail || "/placeholder.svg"}
                      alt={`${product.name} - Professional software interface`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {product.category_name}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{product.avg_rating.toFixed(1)}</span>
                  </div>
                </div>

                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2">{product.short_desc}</p>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(product.localized_price, product.currency)}
                  </span>

                  <Link href={`/product/${product.slug}`}>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
