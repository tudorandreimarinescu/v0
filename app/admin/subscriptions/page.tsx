import AdminGuard from "@/components/admin-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Crown, DollarSign, Users, TrendingUp, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Subscription {
  id: string
  user: {
    name: string
    email: string
  }
  plan: "free" | "pro" | "enterprise"
  status: "active" | "cancelled" | "past_due" | "trialing"
  current_period_start: string
  current_period_end: string
  amount: number
  currency: string
}

export default async function AdminSubscriptionsPage() {
  // Mock data for now - replace with actual API call
  const subscriptions: Subscription[] = [
    {
      id: "sub_1",
      user: { name: "Alex Chen", email: "alex@example.com" },
      plan: "pro",
      status: "active",
      current_period_start: "2024-01-01",
      current_period_end: "2024-02-01",
      amount: 1999,
      currency: "USD",
    },
    {
      id: "sub_2",
      user: { name: "Sarah Kim", email: "sarah@example.com" },
      plan: "enterprise",
      status: "active",
      current_period_start: "2024-01-15",
      current_period_end: "2024-02-15",
      amount: 4999,
      currency: "USD",
    },
    {
      id: "sub_3",
      user: { name: "Mike Johnson", email: "mike@example.com" },
      plan: "pro",
      status: "past_due",
      current_period_start: "2024-01-10",
      current_period_end: "2024-02-10",
      amount: 1999,
      currency: "USD",
    },
  ]

  const getStatusBadge = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return { label: "Active", variant: "default" as const, color: "text-green-300" }
      case "cancelled":
        return { label: "Cancelled", variant: "secondary" as const, color: "text-gray-300" }
      case "past_due":
        return { label: "Past Due", variant: "destructive" as const, color: "text-red-300" }
      case "trialing":
        return { label: "Trial", variant: "outline" as const, color: "text-blue-300" }
    }
  }

  const getPlanBadge = (plan: Subscription["plan"]) => {
    switch (plan) {
      case "free":
        return { label: "Free", color: "bg-gray-500/20 text-gray-300 border-gray-500/30" }
      case "pro":
        return { label: "Pro", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" }
      case "enterprise":
        return { label: "Enterprise", color: "bg-gold-500/20 text-gold-300 border-gold-500/30" }
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100)
  }

  const totalSubscriptions = subscriptions.length
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length
  const monthlyRevenue = subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.amount, 0)
  const pastDueCount = subscriptions.filter((s) => s.status === "past_due").length

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4 text-white hover:bg-white/10">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
            <p className="text-white/60">Monitor subscriptions, billing, and revenue analytics</p>
          </div>

          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{formatCurrency(monthlyRevenue, "USD")}</div>
                <p className="text-xs text-white/60">Recurring revenue</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{activeSubscriptions}</div>
                <p className="text-xs text-white/60">of {totalSubscriptions} total</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">+12.5%</div>
                <p className="text-xs text-white/60">vs last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Past Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{pastDueCount}</div>
                <p className="text-xs text-white/60">Need attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscriptions Table */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Crown className="h-5 w-5" />
                All Subscriptions ({totalSubscriptions})
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage user subscriptions and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 mx-auto text-white/20 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-white">No subscriptions found</h3>
                  <p className="text-white/60">No active subscriptions on the platform yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/70">User</TableHead>
                      <TableHead className="text-white/70">Plan</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                      <TableHead className="text-white/70">Amount</TableHead>
                      <TableHead className="text-white/70">Current Period</TableHead>
                      <TableHead className="text-white/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => {
                      const statusConfig = getStatusBadge(subscription.status)
                      const planConfig = getPlanBadge(subscription.plan)
                      return (
                        <TableRow key={subscription.id} className="border-white/10">
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">{subscription.user.name}</p>
                              <p className="text-xs text-white/50">{subscription.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={planConfig.color}>
                              <Crown className="h-3 w-3 mr-1" />
                              {planConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="font-medium">
                              {formatCurrency(subscription.amount, subscription.currency)}
                            </div>
                            <div className="text-xs text-white/50">per month</div>
                          </TableCell>
                          <TableCell className="text-white/70">
                            <div className="text-sm">
                              <div>
                                {new Date(subscription.current_period_start).toLocaleDateString()} -{" "}
                                {new Date(subscription.current_period_end).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Revenue by Plan</CardTitle>
                <CardDescription className="text-white/60">Monthly recurring revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-white">Pro Plan</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatCurrency(
                        subscriptions
                          .filter((s) => s.plan === "pro" && s.status === "active")
                          .reduce((sum, s) => sum + s.amount, 0),
                        "USD",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gold-500 rounded-full"></div>
                      <span className="text-white">Enterprise Plan</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatCurrency(
                        subscriptions
                          .filter((s) => s.plan === "enterprise" && s.status === "active")
                          .reduce((sum, s) => sum + s.amount, 0),
                        "USD",
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Subscription Health</CardTitle>
                <CardDescription className="text-white/60">Key subscription metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Churn Rate</span>
                    <span className="text-green-400 font-medium">2.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Average Revenue Per User</span>
                    <span className="text-white font-medium">
                      {formatCurrency(monthlyRevenue / activeSubscriptions || 0, "USD")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Customer Lifetime Value</span>
                    <span className="text-white font-medium">$1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
