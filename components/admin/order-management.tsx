"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export function OrderManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Order Management
        </CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Orders will appear here once customers start purchasing</p>
        </div>
      </CardContent>
    </Card>
  )
}
