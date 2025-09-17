"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface SubscriptionData {
  plan: "free" | "pro" | "enterprise"
  status: "active" | "cancelled" | "past_due"
  current_period_end: string
  usage: {
    projects: { used: number; limit: number }
    storage: { used: number; limit: number }
    bandwidth: { used: number; limit: number }
  }
}

interface SubscriptionStatusProps {
  userId: string
}

export function SubscriptionStatus({ userId }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockSubscription: SubscriptionData = {
      plan: "pro",
      status: "active",
      current_period_end: "2024-02-15",
      usage: {
        projects: { used: 8, limit: 50 },
        storage: { used: 2.4, limit: 10 }, // GB
        bandwidth: { used: 45.2, limit: 100 }, // GB
      },
    }

    setTimeout(() => {
      setSubscription(mockSubscription)
      setIsLoading(false)
    }, 800)
  }, [userId])

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 bg-white/5 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) return null

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "enterprise":
        return "bg-gold-500/20 text-gold-300 border-gold-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "pro":
        return <Crown className="h-4 w-4" />
      case "enterprise":
        return <Zap className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Subscription</CardTitle>
          <Badge variant="outline" className={getPlanColor(subscription.plan)}>
            {getPlanIcon(subscription.plan)}
            <span className="ml-1 capitalize">{subscription.plan}</span>
          </Badge>
        </div>
        <CardDescription className="text-white/60">
          {subscription.status === "active" ? "Active until" : "Status:"}{" "}
          {subscription.status === "active"
            ? new Date(subscription.current_period_end).toLocaleDateString()
            : subscription.status}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usage Stats */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70">Projects</span>
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
            <div className="flex justify-between text-sm mb-1">
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
            <div className="flex justify-between text-sm mb-1">
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
        </div>

        <div className="pt-2 space-y-2">
          {subscription.plan === "free" && (
            <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
              <Link href="/subscription/upgrade">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            asChild
            className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <Link href="/subscription/manage">
              <Calendar className="h-4 w-4 mr-2" />
              Manage Subscription
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
