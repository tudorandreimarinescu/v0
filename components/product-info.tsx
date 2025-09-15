"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2 } from "lucide-react"
import { formatPrice } from "@/lib/supabase/products"
import AddToCartButton from "@/components/add-to-cart-button"

interface Product {
  id: string
  slug: string
  brand: string
  base_price: number
  default_currency: string
  specs: any
  category?: {
    name: string
    slug: string
  }
  translations?: {
    name: string
    short_desc: string
    long_desc: string
    locale: string
  }[]
  variants?: {
    id: string
    sku: string
    attributes: any
    stock: number
    price_adjustment: number
    is_active: boolean
  }[]
}

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviewStats, setReviewStats] = useState<{
    totalReviews: number
    averageRating: number
  } | null>(null)

  const translation = product.translations?.find((t) => t.locale === "en") || product.translations?.[0]
  const productName = translation?.name || `${product.brand} Product`
  const shortDesc = translation?.short_desc || "Premium shader product"
  const longDesc = translation?.long_desc || shortDesc

  const activeVariants = product.variants?.filter((v) => v.is_active) || []
  const currentVariant = activeVariants[selectedVariant]
  const finalPrice = product.base_price + (currentVariant?.price_adjustment || 0)

  // Fetch review stats for the product
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await fetch(`/api/reviews/stats?product_id=${product.id}`)
        const data = await response.json()
        if (response.ok) {
          setReviewStats(data.stats)
        }
      } catch (error) {
        console.error("Error fetching review stats:", error)
      }
    }

    fetchReviewStats()
  }, [product.id])

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        <Badge variant="secondary" className="bg-white/10 text-white/80 mb-2">
          {product.category?.name || "Shader"}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-light text-white mb-4">{productName}</h1>

        {/* Rating */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  reviewStats && i < Math.floor(reviewStats.averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-white/20"
                }`}
              />
            ))}
            <span className="text-white/80 ml-2">
              {reviewStats ? reviewStats.averageRating.toFixed(1) : "No ratings"}
            </span>
          </div>
          <span className="text-white/60">({reviewStats ? reviewStats.totalReviews : 0} reviews)</span>
        </div>

        <p className="text-white/70 text-lg leading-relaxed">{shortDesc}</p>
      </div>

      {/* Price and Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-semibold text-white">{formatPrice(finalPrice, product.default_currency)}</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`border-white/20 ${
                isWishlisted ? "bg-red-500/20 text-red-400" : "text-white/80 bg-transparent"
              } hover:bg-white/10`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white/80 bg-transparent hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Variants */}
        {activeVariants.length > 0 && (
          <div>
            <h3 className="text-white font-medium mb-2">Variants</h3>
            <div className="flex flex-wrap gap-2">
              {activeVariants.map((variant, index) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedVariant(index)}
                  className={
                    selectedVariant === index
                      ? "bg-white text-black"
                      : "border-white/20 text-white bg-transparent hover:bg-white/10"
                  }
                >
                  {variant.attributes?.name || `Variant ${index + 1}`}
                  {variant.price_adjustment !== 0 && (
                    <span className="ml-1">
                      ({variant.price_adjustment > 0 ? "+" : ""}
                      {formatPrice(variant.price_adjustment, product.default_currency)})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-white/80">Quantity:</span>
            <div className="flex items-center border border-white/20 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-white hover:bg-white/10"
              >
                -
              </Button>
              <span className="px-3 py-1 text-white">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="text-white hover:bg-white/10"
              >
                +
              </Button>
            </div>
          </div>

          {currentVariant && (
            <span className="text-white/60 text-sm">
              {currentVariant.stock > 0 ? `${currentVariant.stock} in stock` : "Out of stock"}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          size="lg"
          className="w-full"
        />
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5">
          <TabsTrigger
            value="description"
            className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-white/80 leading-relaxed">{longDesc}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <dl className="space-y-3">
                {product.specs && typeof product.specs === "object" ? (
                  Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-white/60 capitalize">{key.replace(/_/g, " ")}:</dt>
                      <dd className="text-white/80">{String(value)}</dd>
                    </div>
                  ))
                ) : (
                  <div className="text-white/60">No specifications available</div>
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <ul className="space-y-2">
                {/* Mock features - in a real app, these would come from the database */}
                {[
                  "High-performance optimized code",
                  "Cross-platform compatibility",
                  "Detailed documentation included",
                  "Source code provided",
                  "Commercial license included",
                  "Free updates for 1 year",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-white/80">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
