"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail, Package, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"

interface OrderData {
  order: {
    id: string
    order_number: string
    total_amount: number
    subtotal: number
    vat_amount: number
    currency: string
    status: string
    shipping_address: any
    created_at: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    unit_price: number
    total_price: number
    currency: string
    image_url?: string
  }>
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderNumber) {
        setError("Order number not provided")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderNumber}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        setOrderData(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [orderNumber])

  if (loading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </main>
    )
  }

  if (error || !orderData) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Order Not Found</h2>
              <p className="text-white/80 mb-6">{error || "We could not find the order you are looking for."}</p>
              <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const { order, items } = orderData
  const estimatedDelivery = new Date(order.created_at)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            <span className="font-medium italic instrument">Order</span> Confirmed!
          </h1>
          <p className="text-white/80 text-lg">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-left space-y-2">
              <div className="flex justify-between text-white/80">
                <span>Order Number:</span>
                <span className="font-mono">#{order.order_number}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Status:</span>
                <span className="capitalize font-medium text-green-400">{order.status}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-white font-medium mb-3">Items Purchased:</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-white/80">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="text-left">
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">{formatCurrency(item.total_price, item.currency)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="space-y-1 text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal, order.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (20%):</span>
                  <span>{formatCurrency(order.vat_amount, order.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold text-white text-lg border-t border-white/10 pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total_amount, order.currency)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-white font-medium mb-2">Shipping Address:</h3>
              <div className="text-left text-white/80 text-sm">
                <p>
                  {order.shipping_address.firstName} {order.shipping_address.lastName}
                </p>
                <p>{order.shipping_address.address}</p>
                {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button className="w-full bg-white text-black hover:bg-white/90">
            <Download className="h-4 w-4 mr-2" />
            Download Your Files
          </Button>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Link href="/account/orders">View Order History</Link>
            </Button>
            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
            <Mail className="h-4 w-4" />
            <span className="font-medium">Confirmation Email Sent</span>
          </div>
          <p className="text-blue-200/80 text-sm">
            A confirmation email has been sent to {order.shipping_address.email} with your receipt and download links.
          </p>
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-2">
            <Package className="h-4 w-4" />
            <span className="font-medium">Estimated Delivery</span>
          </div>
          <p className="text-green-200/80 text-sm">
            Your order will be delivered by{" "}
            {estimatedDelivery.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </main>
  )
}
