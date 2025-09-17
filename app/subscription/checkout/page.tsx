"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, Crown, Zap, CreditCard, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") || "pro"
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = {
    pro: {
      name: "Pro",
      price: 19,
      description: "Perfect for serious shader developers",
      features: [
        "Unlimited shader projects",
        "All shader types (fragment, vertex, compute)",
        "Premium templates & assets",
        "Priority support",
        "10GB storage",
        "HD export without watermarks",
        "Advanced debugging tools",
        "Collaboration features",
      ],
      icon: Crown,
    },
    enterprise: {
      name: "Enterprise",
      price: 99,
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "SSO integration",
        "100GB storage",
        "White-label exports",
        "API access",
        "Custom integrations",
        "Dedicated support",
      ],
      icon: Zap,
    },
  }

  const selectedPlan = plans[planParam as keyof typeof plans] || plans.pro
  const Icon = selectedPlan.icon

  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      // Here you would integrate with Stripe or your payment processor
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page or dashboard
      window.location.href = "/subscription/success"
    } catch (error) {
      console.error("Checkout error:", error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 text-white hover:bg-white/10">
              <Link href="/pricing">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pricing
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Subscription</h1>
            <p className="text-white/60">You're just one step away from unlocking premium shader development tools.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{selectedPlan.name} Plan</CardTitle>
                    <CardDescription className="text-white/60">{selectedPlan.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">${selectedPlan.price}</span>
                  <span className="text-white/60">/month</span>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  <h4 className="font-medium text-white">What's included:</h4>
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white">${selectedPlan.price}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tax</span>
                    <span className="text-white">$0.00</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between font-medium">
                    <span className="text-white">Total</span>
                    <span className="text-white">${selectedPlan.price}.00/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Payment Information</CardTitle>
                <CardDescription className="text-white/60">
                  Your payment is secured with 256-bit SSL encryption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mock Payment Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Card Information</label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Full name on card"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Country</label>
                    <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Shield className="h-4 w-4" />
                    <span>Secured by Stripe. Your payment information is encrypted and secure.</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : `Subscribe for $${selectedPlan.price}/month`}
                  </Button>

                  <p className="text-xs text-white/50 text-center">
                    By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="flex justify-center items-center gap-8 text-white/40">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm">Stripe Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span className="text-sm">Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
