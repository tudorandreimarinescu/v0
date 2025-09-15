import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shopping Cart - ShaderStore",
  description: "Review your selected shader products and proceed to checkout.",
}

// Mock cart data
const cartItems = [
  {
    id: "cosmic-waves",
    name: "Cosmic Waves Shader",
    price: 29.99,
    quantity: 1,
    image: "/placeholder-ov9sg.png",
  },
  {
    id: "neon-grid",
    name: "Neon Grid Template",
    price: 19.99,
    quantity: 2,
    image: "/placeholder-kyz95.png",
  },
]

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
          Shopping <span className="font-medium italic instrument">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-white/60">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-white/20 text-white/80 bg-transparent">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" className="border-white/20 text-white/80 bg-transparent">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-white text-black hover:bg-white/90">Proceed to Checkout</Button>
                </Link>
                <Link href="/shop" className="block">
                  <Button variant="outline" className="w-full border-white/20 text-white/80 bg-transparent">
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
