import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-green-500 rounded-full w-24 h-24 flex items-center justify-center">
                <Check className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                <Crown className="h-4 w-4 mr-2" />
                Welcome to Pro!
              </Badge>
            </div>
          </div>

          {/* Success Message */}
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-white mb-2">🎉 Subscription Activated!</CardTitle>
              <CardDescription className="text-white/60 text-lg">
                Your Pro subscription has been successfully activated. You now have access to all premium features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">Unlimited shader projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">All shader types unlocked</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">Premium templates & assets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">Priority support</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">10GB storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">HD export without watermarks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">Advanced debugging tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-white/80 text-sm">Collaboration features</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">What's Next?</span>
                </div>
                <p className="text-white/70 text-sm">
                  Start creating amazing shaders with your new Pro features. Check out our premium templates or dive
                  into advanced shader development tools.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-600">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/projects/templates">Browse Templates</Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-white/60">
            <p className="text-sm mb-2">
              A confirmation email has been sent to your inbox with your subscription details.
            </p>
            <p className="text-sm">
              Need help getting started?{" "}
              <Link href="/docs" className="text-purple-400 hover:text-purple-300 underline">
                Check out our documentation
              </Link>{" "}
              or{" "}
              <Link href="/support" className="text-purple-400 hover:text-purple-300 underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
