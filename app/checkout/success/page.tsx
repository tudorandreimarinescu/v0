import type { Metadata } from "next"
import { Suspense } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import OrderConfirmationContent from "@/components/order-confirmation-content"

export const metadata: Metadata = {
  title: "Order Confirmed - kynky.ro",
  description: "Your order has been successfully processed.",
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />
      <Suspense
        fallback={<div className="container mx-auto px-4 py-12 text-center text-white">Loading order details...</div>}
      >
        <OrderConfirmationContent />
      </Suspense>
      <SiteFooter />
    </div>
  )
}
