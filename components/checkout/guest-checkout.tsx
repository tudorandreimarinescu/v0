"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart, User, Mail, MapPin, CreditCard } from "lucide-react"

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string
}

interface GuestCheckoutProps {
  items: CheckoutItem[]
  onSuccess?: (orderId: string) => void
}

export function GuestCheckout({ items, onSuccess }: GuestCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Guest information
  const [guestEmail, setGuestEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Shipping address
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  // Billing address
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const [useSameAddress, setUseSameAddress] = useState(true)

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          guest_email: guestEmail,
          total_amount: totalAmount,
          status: "pending",
          payment_status: "pending",
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            ...shippingAddress,
          },
          billing_address: useSameAddress
            ? {
                first_name: firstName,
                last_name: lastName,
                ...shippingAddress,
              }
            : {
                first_name: firstName,
                last_name: lastName,
                ...billingAddress,
              },
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Call success callback
      onSuccess?.(order.id)
    } catch (error) {
      console.error("Checkout error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during checkout")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {item.image_url && (
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Guest Checkout
            </CardTitle>
            <CardDescription>Complete your purchase without creating an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="shippingStreet">Street Address</Label>
                    <Input
                      id="shippingStreet"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingZip">ZIP Code</Label>
                      <Input
                        id="shippingZip"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingCountry">Country</Label>
                      <Input
                        id="shippingCountry"
                        required
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Billing Address */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    checked={useSameAddress}
                    onChange={(e) => setUseSameAddress(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="sameAddress">Billing address same as shipping</Label>
                </div>

                {!useSameAddress && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Billing Address
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="billingStreet">Street Address</Label>
                        <Input
                          id="billingStreet"
                          required
                          value={billingAddress.street}
                          onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingCity">City</Label>
                          <Input
                            id="billingCity"
                            required
                            value={billingAddress.city}
                            onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingState">State</Label>
                          <Input
                            id="billingState"
                            required
                            value={billingAddress.state}
                            onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingZip">ZIP Code</Label>
                          <Input
                            id="billingZip"
                            required
                            value={billingAddress.zipCode}
                            onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingCountry">Country</Label>
                          <Input
                            id="billingCountry"
                            required
                            value={billingAddress.country}
                            onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</div>}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Processing..." : `Complete Order - $${totalAmount.toFixed(2)}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
