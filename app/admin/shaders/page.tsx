import AdminGuard from "@/components/admin-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Palette, Eye, Edit, Trash2, Flag, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Shader {
  id: string
  name: string
  type: "fragment" | "vertex" | "compute"
  status: "published" | "draft" | "reported" | "featured"
  views: number
  downloads: number
  likes: number
  created_at: string
  author: {
    name: string
    email: string
  }
}

export default async function AdminShadersPage() {
  // Mock data for now - replace with actual API call
  const shaders: Shader[] = [
    {
      id: "1",
      name: "Cosmic Waves",
      type: "fragment",
      status: "featured",
      views: 1247,
      downloads: 89,
      likes: 156,
      created_at: "2024-01-15",
      author: { name: "Alex Chen", email: "alex@example.com" },
    },
    {
      id: "2",
      name: "Particle Storm",
      type: "compute",
      status: "published",
      views: 892,
      downloads: 45,
      likes: 78,
      created_at: "2024-01-20",
      author: { name: "Sarah Kim", email: "sarah@example.com" },
    },
    {
      id: "3",
      name: "Neon Grid",
      type: "fragment",
      status: "reported",
      views: 234,
      downloads: 12,
      likes: 23,
      created_at: "2024-01-10",
      author: { name: "Mike Johnson", email: "mike@example.com" },
    },
  ]

  const getStatusBadge = (status: Shader["status"]) => {
    switch (status) {
      case "featured":
        return { label: "Featured", variant: "default" as const, color: "text-yellow-300" }
      case "published":
        return { label: "Published", variant: "secondary" as const, color: "text-green-300" }
      case "draft":
        return { label: "Draft", variant: "outline" as const, color: "text-gray-300" }
      case "reported":
        return { label: "Reported", variant: "destructive" as const, color: "text-red-300" }
    }
  }

  const getTypeColor = (type: Shader["type"]) => {
    switch (type) {
      case "fragment":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "vertex":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "compute":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
    }
  }

  const totalShaders = shaders.length
  const featuredShaders = shaders.filter((s) => s.status === "featured").length
  const reportedShaders = shaders.filter((s) => s.status === "reported").length
  const totalViews = shaders.reduce((sum, s) => sum + s.views, 0)

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
            <h1 className="text-3xl font-bold text-white">Shader Management</h1>
            <p className="text-white/60">Moderate and manage all shaders on the platform</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Total Shaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalShaders}</div>
                <p className="text-xs text-white/60">Shaders on platform</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Featured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">{featuredShaders}</div>
                <p className="text-xs text-white/60">Featured shaders</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Reported
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{reportedShaders}</div>
                <p className="text-xs text-white/60">Need review</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-white/60">Platform views</p>
              </CardContent>
            </Card>
          </div>

          {/* Shaders Table */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="h-5 w-5" />
                All Shaders ({totalShaders})
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage shader content, moderation, and featured status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shaders.length === 0 ? (
                <div className="text-center py-8">
                  <Palette className="h-12 w-12 mx-auto text-white/20 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-white">No shaders found</h3>
                  <p className="text-white/60">No shaders have been uploaded to the platform yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/70">Shader</TableHead>
                      <TableHead className="text-white/70">Type</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                      <TableHead className="text-white/70">Stats</TableHead>
                      <TableHead className="text-white/70">Author</TableHead>
                      <TableHead className="text-white/70">Created</TableHead>
                      <TableHead className="text-white/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shaders.map((shader) => {
                      const statusConfig = getStatusBadge(shader.status)
                      return (
                        <TableRow key={shader.id} className="border-white/10">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                                <Palette className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{shader.name}</p>
                                <p className="text-xs text-white/50">{shader.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getTypeColor(shader.type)}>
                              {shader.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-white/70">
                              <div>{shader.views} views</div>
                              <div>{shader.downloads} downloads</div>
                              <div>{shader.likes} likes</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">{shader.author.name}</p>
                              <p className="text-xs text-white/50">{shader.author.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/70">
                            {new Date(shader.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <Trash2 className="h-4 w-4" />
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
        </div>
      </div>
    </AdminGuard>
  )
}
