"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/supabase/products"
import { Eye, Grid, List } from "lucide-react"
import Link from "next/link"
import AddToCartButton from "@/components/add-to-cart-button"

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

interface ShopContentProps {
  products: Product[]
  total: number
  currentPage: number
  limit: number
  error?: string | null
}

export default function ShopContent({ products, total, currentPage, limit, error }: ShopContentProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / limit)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/shop?${params.toString()}`)
  }

  if (error) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <p className="text-red-400 mb-4">Error loading products: {error}</p>
          <Button onClick={() => window.location.reload()} className="bg-white text-black hover:bg-white/90">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <p className="text-white/80 mb-4">No products found matching your criteria.</p>
          <Button onClick={() => router.push("/shop")} className="bg-white text-black hover:bg-white/90">
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-white/80">
          Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, total)} of {total} products
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid"
                ? "bg-white text-black"
                : "border-white/20 text-white bg-transparent hover:bg-white/10"
            }
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list"
                ? "bg-white text-black"
                : "border-white/20 text-white bg-transparent hover:bg-white/10"
            }
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
        {products.map((product) => {
          const translation = product.translations?.find((t) => t.locale === "en") || product.translations?.[0]
          const productName = translation?.name || `${product.brand} Product`
          const productDesc = translation?.short_desc || "Premium shader product"

          if (viewMode === "list") {
            return (
              <Card
                key={product.id}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_url || "/placeholder.svg?height=96&width=96&query=shader"}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="secondary" className="bg-white/10 text-white/80 mb-2">
                            {product.category?.name || "Shader"}
                          </Badge>
                          <h3 className="text-white font-semibold">{productName}</h3>
                          <p className="text-white/60 text-sm">{productDesc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">
                            {formatPrice(product.base_price, product.default_currency)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/product/${product.slug}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white bg-transparent hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <AddToCartButton
                          product={product}
                          size="sm"
                          className="bg-white text-black hover:bg-white/90"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }

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
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-white/10 text-white/80">
                    {product.category?.name || "Shader"}
                  </Badge>
                  <span className="text-lg font-semibold text-white">
                    {formatPrice(product.base_price, product.default_currency)}
                  </span>
                </div>
                <CardTitle className="text-white mb-2">{productName}</CardTitle>
                <CardDescription className="text-white/60">{productDesc}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Link href={`/product/${product.slug}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white bg-transparent hover:bg-white/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
                <AddToCartButton product={product} className="bg-white text-black hover:bg-white/90" />
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="border-white/20 text-white bg-transparent hover:bg-white/10 disabled:opacity-50"
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(pageNum)}
                className={
                  pageNum === currentPage
                    ? "bg-white text-black"
                    : "border-white/20 text-white bg-transparent hover:bg-white/10"
                }
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="border-white/20 text-white bg-transparent hover:bg-white/10 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
