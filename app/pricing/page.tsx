import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Palette, Star } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started with shader development",
      features: [
        "5 shader projects",
        "Basic shader templates",
        "Community support",
        "1GB storage",
        "Standard export formats",
      ],
      limitations: ["Watermarked exports", "Limited to fragment shaders", "No priority support"],
      cta: "Get Started",
      popular: false,
      icon: Palette,
    },
    {
      name: "Pro",
      price: 19,
      description: "For serious shader artists and developers",
      features: [
        "Unlimited shader projects",
        "All shader types (fragment, vertex, compute)",
        "Premium templates & assets",
        "Priority support",
        "10GB storage",
        "HD export without watermarks",
        "Advanced debugging tools",
        "Collaboration features",
        "Custom shader libraries",
      ],
      cta: "Start Pro Trial",
      popular: true,
      icon: Crown,
    },
    {
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
        "Advanced analytics",
        "Custom training",
      ],
      cta: "Contact Sales",
      popular: false,
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Star className="h-3 w-3 mr-1" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}
              Creative Power
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Unlock the full potential of shader development with our flexible pricing plans designed for creators at
            every level.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.name}
                className={`relative bg-white/5 border-white/10 backdrop-blur-sm ${
                  plan.popular ? "ring-2 ring-purple-500/50 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-full">
                      <Icon className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-white/60">/month</span>
                  </div>
                  <CardDescription className="text-white/60 mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-4 w-4 flex-shrink-0 flex items-center justify-center">
                            <div className="h-1 w-3 bg-white/30 rounded"></div>
                          </div>
                          <span className="text-white/50 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    asChild
                    className={`w-full mt-8 ${
                      plan.popular
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    <Link
                      href={
                        plan.name === "Free"
                          ? "/auth/sign-up"
                          : `/subscription/checkout?plan=${plan.name.toLowerCase()}`
                      }
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                  prorate any billing differences.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Is there a free trial for Pro?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Yes! We offer a 14-day free trial for the Pro plan. No credit card required to start your trial.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are
                  processed securely through Stripe.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Absolutely. You can cancel your subscription at any time from your account settings. You'll continue
                  to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Amazing Shaders?</h2>
          <p className="text-white/70 mb-8">
            Join thousands of developers and artists who are already creating stunning visual effects with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-600">
              <Link href="/auth/sign-up">Start Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
