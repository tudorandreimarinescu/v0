"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useCheckout } from "@/lib/checkout/checkout-context"

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AU", name: "Australia" },
]

export default function BillingStep() {
  const { state, updateBilling, nextStep, prevStep } = useCheckout()
  const { billingInfo, shippingInfo, errors } = state

  const handleInputChange = (field: string, value: string) => {
    updateBilling({ [field]: value })
  }

  const handleSameAsShippingChange = (checked: boolean) => {
    updateBilling({ sameAsShipping: checked })
    if (checked) {
      // Clear billing-specific fields when using shipping address
      updateBilling({
        firstName: undefined,
        lastName: undefined,
        address: undefined,
        address2: undefined,
        city: undefined,
        state: undefined,
        postalCode: undefined,
        country: undefined,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsShipping"
              checked={billingInfo.sameAsShipping}
              onCheckedChange={handleSameAsShippingChange}
            />
            <Label htmlFor="sameAsShipping">Same as shipping address</Label>
          </div>

          {!billingInfo.sameAsShipping && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingFirstName">First Name *</Label>
                  <Input
                    id="billingFirstName"
                    value={billingInfo.firstName || ""}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.billingFirstName ? "border-red-500" : ""}
                  />
                  {errors.billingFirstName && <p className="text-sm text-red-500 mt-1">{errors.billingFirstName}</p>}
                </div>
                <div>
                  <Label htmlFor="billingLastName">Last Name *</Label>
                  <Input
                    id="billingLastName"
                    value={billingInfo.lastName || ""}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.billingLastName ? "border-red-500" : ""}
                  />
                  {errors.billingLastName && <p className="text-sm text-red-500 mt-1">{errors.billingLastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="billingAddress">Address *</Label>
                <Input
                  id="billingAddress"
                  value={billingInfo.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.billingAddress ? "border-red-500" : ""}
                />
                {errors.billingAddress && <p className="text-sm text-red-500 mt-1">{errors.billingAddress}</p>}
              </div>

              <div>
                <Label htmlFor="billingAddress2">Address Line 2 (Optional)</Label>
                <Input
                  id="billingAddress2"
                  value={billingInfo.address2 || ""}
                  onChange={(e) => handleInputChange("address2", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingCity">City *</Label>
                  <Input
                    id="billingCity"
                    value={billingInfo.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={errors.billingCity ? "border-red-500" : ""}
                  />
                  {errors.billingCity && <p className="text-sm text-red-500 mt-1">{errors.billingCity}</p>}
                </div>
                <div>
                  <Label htmlFor="billingState">State/Province *</Label>
                  <Input
                    id="billingState"
                    value={billingInfo.state || ""}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={errors.billingState ? "border-red-500" : ""}
                  />
                  {errors.billingState && <p className="text-sm text-red-500 mt-1">{errors.billingState}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingPostalCode">Postal Code *</Label>
                  <Input
                    id="billingPostalCode"
                    value={billingInfo.postalCode || ""}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className={errors.billingPostalCode ? "border-red-500" : ""}
                  />
                  {errors.billingPostalCode && <p className="text-sm text-red-500 mt-1">{errors.billingPostalCode}</p>}
                </div>
                <div>
                  <Label htmlFor="billingCountry">Country *</Label>
                  <Select onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger className={errors.billingCountry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.billingCountry && <p className="text-sm text-red-500 mt-1">{errors.billingCountry}</p>}
                </div>
              </div>
            </>
          )}

          {billingInfo.sameAsShipping && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Billing address will be the same as your shipping address:
              </p>
              <div className="mt-2 text-sm">
                <p>
                  {shippingInfo.firstName} {shippingInfo.lastName}
                </p>
                <p>{shippingInfo.address}</p>
                {shippingInfo.address2 && <p>{shippingInfo.address2}</p>}
                <p>
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
                </p>
                <p>{countries.find((c) => c.code === shippingInfo.country)?.name}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
              Back to Shipping
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
