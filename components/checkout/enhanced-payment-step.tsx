"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCheckout } from "@/lib/checkout/checkout-context"
import { useCart } from "@/lib/cart/cart-context"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Smartphone, Loader2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export default function EnhancedPaymentStep() {
  const { state, updatePayment, prevStep, setLoading, setErrors } = useCheckout()
  const { items, totalAmount, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const { paymentInfo, shippingInfo, billingInfo, errors, isLoading } = state
  const supabase = createBrowserClient()

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

  const processPayment = async () => {
    try {
      setIsProcessing(true)

      // Calculate totals
      const subtotal = totalAmount
      const vatRate = 0.2
      const vatAmount = subtotal * vatRate
      const total = subtotal + vatAmount

      // Get user info
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Create payment intent
      const createIntentResponse = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          description: `Order for ${items.length} item(s)`,
          receipt_email: shippingInfo.email,
          metadata: {
            user_id: user?.id || "guest",
            item_count: items.length.toString(),
          },
          shipping: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            address: {
              line1: shippingInfo.address!,
              line2: shippingInfo.address2,
              city: shippingInfo.city!,
              state: shippingInfo.state!,
              postal_code: shippingInfo.postalCode!,
              country: shippingInfo.country!,
            },
          },
        }),
      })

      if (!createIntentResponse.ok) {
        const error = await createIntentResponse.json()
        throw new Error(error.error || "Failed to create payment intent")
      }

      const { payment_intent } = await createIntentResponse.json()

      // Confirm payment
      const confirmResponse = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_intent_id: payment_intent.id,
          payment_method: {
            type: "card",
            card: {
              number: paymentInfo.cardNumber!.replace(/\s/g, ""),
              exp_month: Number.parseInt(paymentInfo.expiryDate!.split("/")[0]),
              exp_year: Number.parseInt("20" + paymentInfo.expiryDate!.split("/")[1]),
              cvc: paymentInfo.cvv!,
            },
            billing_details: {
              name: paymentInfo.cardholderName,
              email: shippingInfo.email,
              address: billingInfo.sameAsShipping
                ? {
                    line1: shippingInfo.address,
                    line2: shippingInfo.address2,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    postal_code: shippingInfo.postalCode,
                    country: shippingInfo.country,
                  }
                : {
                    line1: billingInfo.address,
                    line2: billingInfo.address2,
                    city: billingInfo.city,
                    state: billingInfo.state,
                    postal_code: billingInfo.postalCode,
                    country: billingInfo.country,
                  },
            },
          },
        }),
      })

      if (!confirmResponse.ok) {
        const error = await confirmResponse.json()
        throw new Error(error.error || "Payment failed")
      }

      const { payment_intent: confirmedIntent } = await confirmResponse.json()

      if (confirmedIntent.status !== "succeeded") {
        throw new Error("Payment was not successful")
      }

      // Create order
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          guestEmail: !user ? shippingInfo.email : undefined,
          items,
          shippingInfo,
          billingInfo,
          paymentIntentId: confirmedIntent.id,
          subtotal,
          vatAmount,
          total,
          currency: "USD",
        }),
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || "Failed to create order")
      }

      const { order } = await orderResponse.json()

      // Clear cart
      clearCart()

      toast({
        title: "Order Successful!",
        description: `Your order #${order.order_number} has been confirmed.`,
      })

      // Redirect to success page
      router.push(`/checkout/success?order=${order.order_number}`)
    } catch (error) {
      console.error("Payment processing error:", error)

      if (error instanceof Error) {
        if (error.message.includes("card_declined")) {
          setErrors({ payment: "Your card was declined. Please try a different payment method." })
        } else if (error.message.includes("expired_card")) {
          setErrors({ payment: "Your card has expired. Please use a different card." })
        } else if (error.message.includes("incorrect_cvc")) {
          setErrors({ payment: "Your card's security code is incorrect." })
        } else {
          setErrors({ payment: error.message })
        }
      } else {
        setErrors({ payment: "An unexpected error occurred. Please try again." })
      }

      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await processPayment()
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
                <p className="text-xs text-muted-foreground mt-1">
                  Test cards: 4242424242424242 (success), 4000000000000002 (declined)
                </p>
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

          {errors.payment && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.payment}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
              Back to Billing
            </Button>
            <Button type="submit" className="flex-1" disabled={isProcessing}>
              {isProcessing ? (
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
