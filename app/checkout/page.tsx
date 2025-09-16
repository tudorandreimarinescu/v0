import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { CheckoutProvider } from "@/lib/checkout/checkout-context"
import CheckoutPageClient from "@/components/checkout-page-client"
import { getCurrentUserProfile } from "@/lib/auth/admin"

export const metadata: Metadata = {
  title: "Checkout - kynky.ro",
  description: "Complete your purchase of premium shader products.",
}

export default async function CheckoutPage() {
  const profile = await getCurrentUserProfile()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />
      <CheckoutProvider>
        <CheckoutPageClient userProfile={profile} />
      </CheckoutProvider>
      <SiteFooter />
    </div>
  )
}
