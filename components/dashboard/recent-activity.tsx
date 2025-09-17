"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Heart, MessageCircle, Share2 } from "lucide-react"
import { useState, useEffect } from "react"

interface ActivityItem {
  id: string
  type: "view" | "download" | "like" | "comment" | "share"
  project_name: string
  user_name?: string
  timestamp: string
  details?: string
}

interface RecentActivityProps {
  userId: string
}

export function RecentActivity({ userId }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockActivities: ActivityItem[] = [
      {
        id: "1",
        type: "download",
        project_name: "Cosmic Waves",
        user_name: "Alex Chen",
        timestamp: "2024-01-20T10:30:00Z",
        details: "Downloaded shader source",
      },
      {
        id: "2",
        type: "like",
        project_name: "Neon Grid",
        user_name: "Sarah Kim",
        timestamp: "2024-01-20T09:15:00Z",
      },
      {
        id: "3",
        type: "comment",
        project_name: "Particle Storm",
        user_name: "Mike Johnson",
        timestamp: "2024-01-20T08:45:00Z",
        details: "Amazing particle effects!",
      },
      {
        id: "4",
        type: "view",
        project_name: "Cosmic Waves",
        timestamp: "2024-01-20T08:20:00Z",
        details: "25 new views",
      },
      {
        id: "5",
        type: "share",
        project_name: "Neon Grid",
        user_name: "Emma Davis",
        timestamp: "2024-01-19T16:30:00Z",
        details: "Shared on Twitter",
      },
    ]

    setTimeout(() => {
      setActivities(mockActivities)
      setIsLoading(false)
    }, 900)
  }, [userId])

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "view":
        return <Eye className="h-4 w-4 text-blue-400" />
      case "download":
        return <Download className="h-4 w-4 text-green-400" />
      case "like":
        return <Heart className="h-4 w-4 text-red-400" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-yellow-400" />
      case "share":
        return <Share2 className="h-4 w-4 text-purple-400" />
    }
  }

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "view":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "download":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "like":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "comment":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "share":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-white/60">Latest interactions with your shaders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className={getActivityColor(activity.type)}>
                    {activity.type}
                  </Badge>
                  <span className="text-sm text-white/60">{formatTimestamp(activity.timestamp)}</span>
                </div>
                <p className="text-sm text-white">
                  {activity.user_name && <span className="font-medium">{activity.user_name} </span>}
                  {activity.type === "view" && "viewed"}
                  {activity.type === "download" && "downloaded"}
                  {activity.type === "like" && "liked"}
                  {activity.type === "comment" && "commented on"}
                  {activity.type === "share" && "shared"}{" "}
                  <span className="font-medium text-purple-300">{activity.project_name}</span>
                </p>
                {activity.details && <p className="text-xs text-white/50 mt-1">{activity.details}</p>}
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
