"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Download, Share2, Palette } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Project {
  id: string
  name: string
  type: "fragment" | "vertex" | "compute"
  status: "draft" | "published" | "private"
  views: number
  downloads: number
  created_at: string
  thumbnail?: string
}

interface ProjectsOverviewProps {
  userId: string
}

export function ProjectsOverview({ userId }: ProjectsOverviewProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockProjects: Project[] = [
      {
        id: "1",
        name: "Cosmic Waves",
        type: "fragment",
        status: "published",
        views: 1247,
        downloads: 89,
        created_at: "2024-01-15",
        thumbnail: "/cosmic-waves-shader.jpg",
      },
      {
        id: "2",
        name: "Particle Storm",
        type: "compute",
        status: "draft",
        views: 0,
        downloads: 0,
        created_at: "2024-01-20",
        thumbnail: "/particle-storm-shader.jpg",
      },
      {
        id: "3",
        name: "Neon Grid",
        type: "fragment",
        status: "published",
        views: 892,
        downloads: 156,
        created_at: "2024-01-10",
        thumbnail: "/neon-grid-shader.jpg",
      },
    ]

    setTimeout(() => {
      setProjects(mockProjects)
      setIsLoading(false)
    }, 1000)
  }, [userId])

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "draft":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "private":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
  }

  const getTypeIcon = (type: Project["type"]) => {
    return <Palette className="h-3 w-3" />
  }

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Your Shader Projects</CardTitle>
          <CardDescription className="text-white/60">Loading your creative work...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Your Shader Projects</CardTitle>
            <CardDescription className="text-white/60">
              {projects.length} projects • {projects.filter((p) => p.status === "published").length} published
            </CardDescription>
          </div>
          <Button asChild className="bg-purple-500 hover:bg-purple-600">
            <Link href="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                {getTypeIcon(project.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-white truncate">{project.name}</h3>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-white/70 border-white/20">
                    {project.type}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {project.views}
                  </span>
                  <span className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {project.downloads}
                  </span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8">
            <Palette className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-4">No shader projects yet</p>
            <Button asChild className="bg-purple-500 hover:bg-purple-600">
              <Link href="/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Shader
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
