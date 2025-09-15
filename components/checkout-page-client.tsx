"use client"

import { useCart } from "@/lib/cart/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import CheckoutForm from "@/components/checkout-form"
import { formatCurrency } from "@/lib/currency"
import type { UserProfile } from "@/lib/auth/admin"

interface CheckoutPageClientProps {
  userProfile: UserProfile | null
}

export default function CheckoutPageClient({ userProfile }: CheckoutPageClientProps) {
  const { items, totalAmount, isLoading } = useCart()

  const subtotal = totalAmount
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading checkout...</div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-light text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to your cart before checking out.</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </main>
    )
  }

  // Convert cart items to checkout format
  const checkoutItems = items.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }))

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-8">
        <span className="font-medium italic instrument">Secure</span> Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <CheckoutForm cartItems={checkoutItems} total={total} userProfile={userProfile} />
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} (x{item.quantity})
                    </span>
                    <span>{formatCurrency(item.price * item.quantity, item.currency)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
