"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface Stats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      try {
        // Fetch user count
        const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

        // Fetch product count
        const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })

        // Fetch order count and total revenue
        const { data: orders } = await supabase.from("orders").select("total_amount")

        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

        setStats({
          totalUsers: userCount || 0,
          totalProducts: productCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Statistics...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Statistics</CardTitle>
        <CardDescription>Real-time overview of your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalProducts}</div>
            <div className="text-sm text-muted-foreground">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalOrders}</div>
            <div className="text-sm text-muted-foreground">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">${stats.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
