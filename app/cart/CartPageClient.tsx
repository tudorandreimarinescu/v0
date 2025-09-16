"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart/cart-context"
import { formatCurrency } from "@/lib/utils/currency"
import QuantitySelector from "@/components/quantity-selector"

export default function CartPageClient() {
  const { items, totalAmount, updateQuantity, removeItem, clearCart, isLoading } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = async () => {
    setIsClearing(true)
    clearCart()
    setTimeout(() => setIsClearing(false), 500)
  }

  const subtotal = totalAmount
  const vatRate = 0.2 // 20% VAT
  const vatAmount = subtotal * vatRate
  const total = subtotal + vatAmount

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading cart...</div>
        </main>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-light text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Discover our amazing shader products and add them to your cart.
            </p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-foreground">
            Shopping <span className="font-medium italic instrument">Cart</span>
          </h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleClearCart} disabled={isClearing} className="bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing..." : "Clear Cart"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Link href={`/product/${item.slug}`}>
                      <img
                        src={
                          item.image_url ||
                          `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.name) || "/placeholder.svg"}`
                        }
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      {item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
                      {item.variantId && <p className="text-sm text-muted-foreground">Variant: {item.variantId}</p>}
                      <p className="text-sm font-medium text-foreground">{formatCurrency(item.price, item.currency)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(quantity) => updateQuantity(item.id, quantity)}
                        min={1}
                        max={Math.min(item.stock, 10)}
                      />

                      <div className="text-right min-w-[80px]">
                        <p className="font-medium text-foreground">
                          {formatCurrency(item.price * item.quantity, item.currency)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive/80 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT (20%)</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                  <p className="font-medium mb-1">Shipping Information:</p>
                  <p>• Digital products: Instant download (Free)</p>
                  <p>• Physical products: Calculated at checkout</p>
                </div>

                <div className="space-y-2 pt-4">
                  <Link href="/checkout" className="block">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                  <Link href="/shop" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground pt-4">
                  <p>• Secure checkout with SSL encryption</p>
                  <p>• Instant download after payment</p>
                  <p>• 30-day money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
