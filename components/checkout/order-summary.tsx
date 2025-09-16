"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart/cart-context"
import { formatCurrency } from "@/lib/utils/currency"

export default function OrderSummary() {
  const { items, totalAmount } = useCart()

  const subtotal = totalAmount
  const vatRate = 0.2 // 20% VAT
  const vatAmount = subtotal * vatRate
  const total = subtotal + vatAmount

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                {item.variantId && <p className="text-xs text-muted-foreground">Variant: {item.variantId}</p>}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity, item.currency)}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, "USD")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>VAT (20%)</span>
            <span>{formatCurrency(vatAmount, "USD")}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatCurrency(total, "USD")}</span>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>* Shipping costs will be calculated based on your location</p>
          <p>* Final total may vary depending on shipping method selected</p>
        </div>
      </CardContent>
    </Card>
  )
}
