"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCheckout } from "@/lib/checkout/checkout-context"
import { CreditCard, Smartphone } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function PaymentStep() {
  const { state, updatePayment, prevStep, setLoading } = useCheckout()
  const { paymentInfo, errors, isLoading } = state

  const handleInputChange = (field: string, value: string) => {
    updatePayment({ [field]: value })
  }

  const handlePaymentMethodChange = (method: "card" | "paypal" | "apple_pay") => {
    updatePayment({ method })
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    handleInputChange("cardNumber", formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    handleInputChange("expiryDate", formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // This will be handled by the payment processing logic
    // For now, we'll just simulate processing
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium">Payment Method</Label>
            <RadioGroup value={paymentInfo.method} onValueChange={handlePaymentMethodChange} className="mt-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                <RadioGroupItem value="paypal" id="paypal" disabled />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                  <div className="h-4 w-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                    P
                  </div>
                  PayPal (Coming Soon)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                <RadioGroupItem value="apple_pay" id="apple_pay" disabled />
                <Label htmlFor="apple_pay" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  Apple Pay (Coming Soon)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentInfo.method === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardholderName">Cardholder Name *</Label>
                <Input
                  id="cardholderName"
                  value={paymentInfo.cardholderName || ""}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                  className={errors.cardholderName ? "border-red-500" : ""}
                  placeholder="John Doe"
                />
                {errors.cardholderName && <p className="text-sm text-red-500 mt-1">{errors.cardholderName}</p>}
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  value={paymentInfo.cardNumber || ""}
                  onChange={handleCardNumberChange}
                  className={errors.cardNumber ? "border-red-500" : ""}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    value={paymentInfo.expiryDate || ""}
                    onChange={handleExpiryChange}
                    className={errors.expiryDate ? "border-red-500" : ""}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={paymentInfo.cvv || ""}
                    onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                    className={errors.cvv ? "border-red-500" : ""}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
              Back to Billing
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Order"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
