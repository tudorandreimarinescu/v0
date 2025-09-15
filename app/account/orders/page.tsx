import type { Metadata } from "next"
import { redirect } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createServerClient } from "@/lib/supabase/server"
import { Download, Eye } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Order History - ShaderStore",
  description: "View your order history and download purchased items.",
}

export default async function OrderHistoryPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/account/orders")
  }

  // Fetch user's orders from database
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
          <span className="font-medium italic instrument">Order</span> History
        </h1>

        {!orders || orders.length === 0 ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <p className="text-white/80 mb-4">You haven't placed any orders yet.</p>
              <Link href="/shop">
                <Button className="bg-white text-black hover:bg-white/90">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Order #{order.order_number}</CardTitle>
                      <p className="text-white/60 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={order.status === "completed" ? "default" : "secondary"} className="mb-2">
                        {order.status}
                      </Badge>
                      <p className="text-white font-semibold">${order.total_amount}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                      >
                        <div>
                          <p className="text-white">{item.products?.name}</p>
                          <p className="text-white/60 text-sm">
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="bg-white text-black hover:bg-white/90">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
