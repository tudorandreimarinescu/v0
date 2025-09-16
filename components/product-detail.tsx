"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import ProductGallery from "@/components/product-gallery"
import QuantitySelector from "@/components/quantity-selector"
import ProductReviews from "@/components/product-reviews"
import { formatCurrency } from "@/lib/currency"
import { useCart } from "@/lib/cart/cart-context"
import { getProductImages } from "@/lib/product-images"

interface ProductDetailProps {
  product: any
}

export default function ProductDetailComponent({ product }: ProductDetailProps) {
  const { addItem, getItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const currentPrice = selectedVariant
    ? product.localized_price + (selectedVariant.price_adjustment || 0)
    : product.localized_price

  const currentStock = selectedVariant?.stock || product.stock || 0
  const isInStock = currentStock > 0

  // Check if item is already in cart
  const cartItem = getItem(product.id, selectedVariant?.id)
  const isInCart = !!cartItem

  const handleAddToCart = async () => {
    if (!isInStock) return

    setIsAddingToCart(true)

    try {
      const cartItemData = {
        id: `${product.id}-${selectedVariant?.id || "default"}`,
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        slug: product.slug,
        image_url: product.image_url,
        price: currentPrice,
        currency: product.currency,
        stock: currentStock,
        category: product.category_name,
        brand: product.brand,
        quantity,
      }

      addItem(cartItemData)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist functionality
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_desc,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const productImages = getProductImages(product)
  const galleryImages = productImages.gallery.map((src, index) => ({
    src,
    alt: index === 0 ? productImages.alt : `${productImages.alt} - View ${index + 1}`,
  }))

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div className="space-y-4">
          <ProductGallery images={galleryImages} productName={product.name} />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category_name}</Badge>
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.avg_rating) ? "text-yellow-400 fill-current" : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-foreground ml-2">{product.avg_rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">({product.review_count} reviews)</span>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">{product.long_desc || product.short_desc}</p>
          </div>

          {/* Price and Stock */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-semibold text-foreground">
                  {formatCurrency(currentPrice, product.currency)}
                </span>
                {product.localized_price !== product.base_price && (
                  <div className="text-sm text-muted-foreground">{formatCurrency(product.base_price, "USD")} USD</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleWishlist}>
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isInStock ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock ({currentStock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Variants</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.is_active || variant.stock <= 0}
                  >
                    {Object.entries(variant.attributes || {})
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                    {variant.price_adjustment !== 0 && (
                      <span className="ml-1">
                        ({variant.price_adjustment > 0 ? "+" : ""}
                        {formatCurrency(variant.price_adjustment, product.currency)})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={Math.min(currentStock, 10)}
                  disabled={!isInStock}
                />
              </div>
            </div>

            <Button onClick={handleAddToCart} disabled={!isInStock || isAddingToCart} size="lg" className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? "Adding to Cart..." : isInCart ? `In Cart (${cartItem?.quantity})` : "Add to Cart"}
            </Button>
          </div>

          {/* Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <dt className="text-muted-foreground font-medium">{key}:</dt>
                      <dd className="text-foreground text-right max-w-[60%]">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="ml-2 text-foreground">{selectedVariant?.sku || product.slug}</span>
                </div>
                {product.material && (
                  <div>
                    <span className="text-muted-foreground">Material:</span>
                    <span className="ml-2 text-foreground">{product.material}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 text-foreground capitalize">{product.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Added:</span>
                  <span className="ml-2 text-foreground">{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProductReviews productId={product.id} productName={product.name} />
    </div>
  )
}
