"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart/store"
import { ShoppingCart, Check } from "lucide-react"
import { formatPrice } from "@/lib/supabase/products"

interface Product {
  id: string
  slug: string
  brand: string
  base_price: number
  default_currency: string
  image_url: string
  translations?: {
    name: string
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

interface AddToCartButtonProps {
  product: Product
  selectedVariant?: number
  quantity?: number
  className?: string
  size?: "sm" | "default" | "lg"
}

export default function AddToCartButton({
  product,
  selectedVariant = 0,
  quantity = 1,
  className,
  size = "default",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, setIsOpen } = useCartStore()

  const translation = product.translations?.find((t) => t.locale === "en") || product.translations?.[0]
  const productName = translation?.name || `${product.brand} Product`

  const activeVariants = product.variants?.filter((v) => v.is_active) || []
  const currentVariant = activeVariants[selectedVariant]
  const finalPrice = product.base_price + (currentVariant?.price_adjustment || 0)

  const isOutOfStock = currentVariant && currentVariant.stock === 0

  const handleAddToCart = async () => {
    if (isOutOfStock) return

    setIsAdding(true)

    try {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: productName,
        price: finalPrice,
        currency: product.default_currency,
        image: product.image_url || "/placeholder.svg",
        variantId: currentVariant?.id,
        variantName: currentVariant?.attributes?.name,
        maxStock: currentVariant?.stock,
        quantity,
      })

      setJustAdded(true)
      setIsOpen(true)

      // Reset the "just added" state after 2 seconds
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  if (justAdded) {
    return (
      <Button size={size} className={`bg-green-600 text-white hover:bg-green-700 ${className}`} disabled>
        <Check className="h-4 w-4 mr-2" />
        Added to Cart
      </Button>
    )
  }

  return (
    <Button
      size={size}
      onClick={handleAddToCart}
      disabled={isAdding || isOutOfStock}
      className={`bg-white text-black hover:bg-white/90 ${className}`}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isOutOfStock
        ? "Out of Stock"
        : isAdding
          ? "Adding..."
          : `Add to Cart - ${formatPrice(finalPrice * quantity, product.default_currency)}`}
    </Button>
  )
}
