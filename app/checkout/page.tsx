import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { CheckoutProvider } from "@/lib/checkout/checkout-context"
import CheckoutPageClient from "@/components/checkout-page-client"
import { getCurrentUserProfile } from "@/lib/auth/admin"

export const metadata: Metadata = {
  title: "Checkout - ShaderStore",
  description: "Complete your purchase of premium shader products.",
}

export default async function CheckoutPage() {
  const profile = await getCurrentUserProfile()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <CheckoutProvider>
        <CheckoutPageClient userProfile={profile} />
      </CheckoutProvider>
      <SiteFooter />
    </div>
  )
}
