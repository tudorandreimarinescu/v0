"use client"
import { useCartStore } from "@/lib/cart/store"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/supabase/products"
import { useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99 // Free shipping over $50
  const total = subtotal - discount + tax + shipping

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "shader10") {
      setDiscount(subtotal * 0.1) // 10% discount
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(subtotal * 0.2) // 20% discount
    } else {
      alert("Invalid promo code")
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
        <SiteHeader />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-white/40 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
              Your Cart is <span className="font-medium italic instrument">Empty</span>
            </h1>
            <p className="text-white/70 mb-8">
              Discover our amazing shader collection and start building your library.
            </p>
            <Link href="/shop">
              <Button className="bg-white text-black hover:bg-white/90">Browse Products</Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-white">
            Shopping <span className="font-medium italic instrument">Cart</span>
          </h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="border-white/20 text-white/80 bg-transparent hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      {item.variantName && <p className="text-white/60 text-sm">{item.variantName}</p>}
                      <p className="text-white/60">{formatPrice(item.price, item.currency)}</p>
                      {item.maxStock && <p className="text-white/50 text-xs">{item.maxStock} available</p>}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="border-white/20 text-white/80 bg-transparent hover:bg-white/10"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-white w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                        className="border-white/20 text-white/80 bg-transparent hover:bg-white/10 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatPrice(item.price * item.quantity, item.currency)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Promo Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    onClick={applyPromoCode}
                    variant="outline"
                    className="border-white/20 text-white bg-transparent hover:bg-white/10"
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-white/60 text-xs">Try: SHADER10 or WELCOME20</p>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal, items[0]?.currency || "USD")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount, items[0]?.currency || "USD")}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping, items[0]?.currency || "USD")}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Tax</span>
                  <span>{formatPrice(tax, items[0]?.currency || "USD")}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total, items[0]?.currency || "USD")}</span>
                  </div>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-white text-black hover:bg-white/90">Proceed to Checkout</Button>
                </Link>
                <Link href="/shop" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white/80 bg-transparent hover:bg-white/10"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
