import type { Metadata } from "next"
import { redirect } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Download, Eye, Calendar } from "lucide-react"
import { getCurrentUserProfile } from "@/lib/auth/admin"
import { getUserOrders } from "@/lib/supabase/orders"
import Link from "next/link"
import { formatCurrency } from "@/lib/currency"

export const metadata: Metadata = {
  title: "Order History - kynky.ro",
  description: "View your order history and download purchased products.",
}

export default async function OrdersPage() {
  const profile = await getCurrentUserProfile()

  if (!profile) {
    redirect("/auth/login")
  }

  const orders = await getUserOrders(profile.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-light text-white">
              Order <span className="font-medium italic instrument">History</span>
            </h1>
          </div>

          {orders.length === 0 ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-white/60" />
                <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                <p className="text-white/60 mb-6">Start shopping to see your orders here.</p>
                <Link href="/shop">
                  <Button className="bg-white text-black hover:bg-white/90">Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-white">Order #{order.order_number}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <span>•</span>
                          <span>{order.order_items?.length || 0} items</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">
                          {formatCurrency(order.total_amount, order.currency || "USD")}
                        </div>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            order.status === "completed"
                              ? "bg-purple-400 text-black"
                              : order.status === "pending"
                                ? "bg-white/10 text-white border-white/20"
                                : "bg-red-500/20 text-red-400 border-red-500/20"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                          <img
                            src={
                              item.products?.image_url ||
                              `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(
                                item.products?.product_translations?.[0]?.name || "Product",
                              )}`
                            }
                            alt={item.products?.product_translations?.[0]?.name || "Product"}
                            className="w-12 h-12 rounded object-cover"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white line-clamp-1">
                              {item.products?.product_translations?.[0]?.name || "Unknown Product"}
                            </h4>
                            <p className="text-sm text-white/60 line-clamp-1">
                              {item.products?.product_translations?.[0]?.short_desc}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span>{formatCurrency(item.unit_price, order.currency || "USD")} each</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-medium text-white">
                              {formatCurrency(item.total_price, order.currency || "USD")}
                            </div>
                            {order.status === "completed" && (
                              <div className="flex gap-1 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                                <Link href={`/product/${item.products?.slug}`}>
                                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">Payment Status:</span>
                        <Badge
                          variant={order.payment_status === "completed" ? "default" : "secondary"}
                          className={
                            order.payment_status === "completed"
                              ? "bg-purple-400 text-black"
                              : "bg-white/10 text-white border-white/20"
                          }
                        >
                          {order.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
