"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Eye } from "lucide-react"
import type { Product } from "@/lib/supabase/products"
import { formatCurrency } from "@/lib/currency"
import { useCart } from "@/lib/cart/cart-context"

interface ProductGridProps {
  products: Product[]
  currentPage: number
  hasMore: boolean
  totalResults: number
}

export default function ProductGrid({ products, currentPage, hasMore, totalResults }: ProductGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/shop?${params.toString()}`)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No products found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {totalResults}+ products
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {(currentPage > 1 || hasMore) && (
        <div className="flex items-center justify-center gap-2 pt-8">
          {currentPage > 1 && (
            <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </Button>
          )}

          <span className="px-4 py-2 text-sm text-muted-foreground">Page {currentPage}</span>

          {hasMore && (
            <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, getItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  // Check if item is already in cart
  const cartItem = getItem(product.id)
  const isInCart = !!cartItem

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (product.stock <= 0) return

    setIsLoading(true)

    try {
      const cartItemData = {
        id: `${product.id}-default`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image_url: product.image_url,
        price: product.localized_price,
        currency: product.currency,
        stock: product.stock,
        category: product.category_name,
        brand: product.brand,
        quantity: 1,
      }

      addItem(cartItemData)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
            <img
              src={
                product.image_url || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary">Out of Stock</Badge>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category_name}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.avg_rating.toFixed(1)} ({product.review_count})
            </span>
          </div>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.short_desc}</p>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(product.localized_price, product.currency)}
            </span>
            {product.localized_price !== product.base_price && (
              <div className="text-xs text-muted-foreground">{formatCurrency(product.base_price, "USD")} USD</div>
            )}
          </div>

          {product.stock > 0 && (
            <Badge variant="outline" className="text-xs">
              {product.stock} in stock
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/product/${product.slug}`} className="flex-1">
          <Button variant="outline" className="w-full bg-transparent" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>

        <Button onClick={handleAddToCart} disabled={product.stock <= 0 || isLoading} size="sm" className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? "Adding..." : isInCart ? `In Cart (${cartItem?.quantity})` : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
