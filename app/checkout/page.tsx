import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Checkout - ShaderStore",
  description: "Complete your purchase of premium shader products.",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
          <span className="font-medium italic instrument">Secure</span> Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white/80">
                      First Name
                    </Label>
                    <Input id="firstName" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white/80">
                      Last Name
                    </Label>
                    <Input id="lastName" className="bg-white/10 border-white/20 text-white" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input id="email" type="email" className="bg-white/10 border-white/20 text-white" />
                </div>
                <div>
                  <Label htmlFor="address" className="text-white/80">
                    Address
                  </Label>
                  <Input id="address" className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-white/80">
                      City
                    </Label>
                    <Input id="city" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-white/80">
                      Country
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-white/80">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-white/80">
                      Expiry Date
                    </Label>
                    <Input id="expiry" placeholder="MM/YY" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-white/80">
                      CVV
                    </Label>
                    <Input id="cvv" placeholder="123" className="bg-white/10 border-white/20 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>Cosmic Waves Shader</span>
                    <span>$29.99</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Neon Grid Template (x2)</span>
                    <span>$39.98</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal</span>
                    <span>$69.97</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Tax</span>
                    <span>$5.60</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>$75.57</span>
                  </div>
                </div>
                <Button className="w-full bg-white text-black hover:bg-white/90">Complete Purchase</Button>
                <p className="text-xs text-white/60 text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
