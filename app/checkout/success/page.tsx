import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Order Confirmed - ShaderStore",
  description: "Your order has been successfully processed.",
}

function OrderConfirmationContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
              <span className="font-medium italic instrument">Order</span> Confirmed!
            </h1>
            <p className="text-white/80 text-lg">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-left space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>Order Number:</span>
                  <span className="font-mono">#ORD-2024-001</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Total:</span>
                  <span className="font-semibold">$75.57</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-white font-medium mb-2">Items Purchased:</h3>
                <div className="space-y-1 text-white/80">
                  <div className="flex justify-between">
                    <span>Cosmic Waves Shader</span>
                    <span>$29.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neon Grid Template (x2)</span>
                    <span>$39.98</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button className="w-full bg-white text-black hover:bg-white/90">
              <Download className="h-4 w-4 mr-2" />
              Download Your Files
            </Button>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Link href="/account/orders">View Order History</Link>
              </Button>
              <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-200 text-sm">
              📧 A confirmation email has been sent to your email address with download links and receipt.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
