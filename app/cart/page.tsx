import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CartPageClient from "./CartPageClient"

// Note: This would normally be generated server-side
export const metadata: Metadata = {
  title: "Shopping Cart - ShaderStore",
  description: "Review your selected shader products and proceed to checkout.",
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />
      <CartPageClient />
      <SiteFooter />
    </div>
  )
}
