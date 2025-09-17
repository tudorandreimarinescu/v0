"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Eye, Download, Heart } from "lucide-react"
import { useState, useEffect } from "react"

interface UsageStatsData {
  totalViews: number
  totalDownloads: number
  totalLikes: number
  monthlyGrowth: number
}

interface UsageStatsProps {
  userId: string
}

export function UsageStats({ userId }: UsageStatsProps) {
  const [stats, setStats] = useState<UsageStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockStats: UsageStatsData = {
      totalViews: 3247,
      totalDownloads: 892,
      totalLikes: 156,
      monthlyGrowth: 23.5,
    }

    setTimeout(() => {
      setStats(mockStats)
      setIsLoading(false)
    }, 1200)
  }, [userId])

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Usage Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Usage Stats</CardTitle>
        <CardDescription className="text-white/60">Your shader performance this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <span className="text-white/70">Total Views</span>
          </div>
          <span className="text-white font-medium">{stats.totalViews.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4 text-green-400" />
            <span className="text-white/70">Downloads</span>
          </div>
          <span className="text-white font-medium">{stats.totalDownloads.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-white/70">Likes</span>
          </div>
          <span className="text-white font-medium">{stats.totalLikes.toLocaleString()}</span>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-white/70">Monthly Growth</span>
            </div>
            <span className="text-green-400 font-medium">+{stats.monthlyGrowth}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
