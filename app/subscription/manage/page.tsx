"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, CreditCard, Download, Settings, AlertTriangle, TrendingUp, FileText, Palette } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface SubscriptionData {
  plan: "free" | "pro" | "enterprise"
  status: "active" | "cancelled" | "past_due" | "trialing"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  usage: {
    projects: { used: number; limit: number }
    storage: { used: number; limit: number }
    bandwidth: { used: number; limit: number }
  }
  billing_history: Array<{
    id: string
    date: string
    amount: number
    status: "paid" | "pending" | "failed"
    invoice_url?: string
  }>
}

export default function ManageSubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockSubscription: SubscriptionData = {
      plan: "pro",
      status: "active",
      current_period_start: "2024-01-01",
      current_period_end: "2024-02-01",
      cancel_at_period_end: false,
      usage: {
        projects: { used: 8, limit: 50 },
        storage: { used: 2.4, limit: 10 },
        bandwidth: { used: 45.2, limit: 100 },
      },
      billing_history: [
        {
          id: "inv_001",
          date: "2024-01-01",
          amount: 1900,
          status: "paid",
          invoice_url: "#",
        },
        {
          id: "inv_002",
          date: "2023-12-01",
          amount: 1900,
          status: "paid",
          invoice_url: "#",
        },
      ],
    }

    setTimeout(() => {
      setSubscription(mockSubscription)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case "pro":
        return { name: "Pro", price: 19, color: "text-purple-300" }
      case "enterprise":
        return { name: "Enterprise", price: 99, color: "text-gold-300" }
      default:
        return { name: "Free", price: 0, color: "text-gray-300" }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", variant: "default" as const, color: "text-green-300" }
      case "cancelled":
        return { label: "Cancelled", variant: "secondary" as const, color: "text-gray-300" }
      case "past_due":
        return { label: "Past Due", variant: "destructive" as const, color: "text-red-300" }
      case "trialing":
        return { label: "Trial", variant: "outline" as const, color: "text-blue-300" }
      default:
        return { label: status, variant: "secondary" as const, color: "text-gray-300" }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-white">Loading subscription details...</div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-white">Unable to load subscription details.</div>
      </div>
    )
  }

  const planDetails = getPlanDetails(subscription.plan)
  const statusConfig = getStatusBadge(subscription.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
            <p className="text-white/60">Manage your subscription, billing, and usage</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown className="h-6 w-6 text-purple-400" />
                      <div>
                        <CardTitle className="text-white">{planDetails.name} Plan</CardTitle>
                        <CardDescription className="text-white/60">${planDetails.price}/month</CardDescription>
                      </div>
                    </div>
                    <Badge variant={statusConfig.variant} className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Current period:</span>
                      <div className="text-white">
                        {new Date(subscription.current_period_start).toLocaleDateString()} -{" "}
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Next billing:</span>
                      <div className="text-white">
                        {subscription.cancel_at_period_end
                          ? "Cancelled"
                          : new Date(subscription.current_period_end).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {subscription.cancel_at_period_end && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-300 font-medium">Subscription Cancelled</span>
                      </div>
                      <p className="text-white/70 text-sm mt-1">
                        Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}.
                        You'll still have access to Pro features until then.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {subscription.plan !== "enterprise" && (
                      <Button asChild className="bg-purple-500 hover:bg-purple-600">
                        <Link href="/pricing">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Upgrade Plan
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Payment
                    </Button>
                    {!subscription.cancel_at_period_end && (
                      <Button
                        variant="outline"
                        className="border-red-500/20 text-red-300 hover:bg-red-500/10 bg-transparent"
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Usage Statistics</CardTitle>
                  <CardDescription className="text-white/60">
                    Your current usage for this billing period
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Projects
                      </span>
                      <span className="text-white">
                        {subscription.usage.projects.used}/{subscription.usage.projects.limit}
                      </span>
                    </div>
                    <Progress
                      value={(subscription.usage.projects.used / subscription.usage.projects.limit) * 100}
                      className="h-2 bg-white/10"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Storage</span>
                      <span className="text-white">
                        {subscription.usage.storage.used}GB/{subscription.usage.storage.limit}GB
                      </span>
                    </div>
                    <Progress
                      value={(subscription.usage.storage.used / subscription.usage.storage.limit) * 100}
                      className="h-2 bg-white/10"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Bandwidth</span>
                      <span className="text-white">
                        {subscription.usage.bandwidth.used}GB/{subscription.usage.bandwidth.limit}GB
                      </span>
                    </div>
                    <Progress
                      value={(subscription.usage.bandwidth.used / subscription.usage.bandwidth.limit) * 100}
                      className="h-2 bg-white/10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Billing History</CardTitle>
                  <CardDescription className="text-white/60">Your recent invoices and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscription.billing_history.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-white/60" />
                          <div>
                            <p className="text-white font-medium">{formatCurrency(invoice.amount)}</p>
                            <p className="text-white/60 text-sm">{new Date(invoice.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={invoice.status === "paid" ? "default" : "destructive"}
                            className={invoice.status === "paid" ? "text-green-300" : "text-red-300"}
                          >
                            {invoice.status}
                          </Badge>
                          {invoice.invoice_url && (
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Link href="/dashboard">
                      <Palette className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Link href="/projects">
                      <FileText className="h-4 w-4 mr-2" />
                      My Projects
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Link href="/support">
                      <Settings className="h-4 w-4 mr-2" />
                      Get Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <CreditCard className="h-5 w-5 text-white/60" />
                    <div>
                      <p className="text-white font-medium">•••• •••• •••• 4242</p>
                      <p className="text-white/60 text-sm">Expires 12/25</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-3 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Update Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
