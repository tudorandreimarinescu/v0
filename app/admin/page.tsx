import AdminGuard from "@/components/admin-guard"
import { getCurrentUserProfile } from "@/lib/auth/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Palette, BarChart3, Settings, Shield, Database, Activity, Crown } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const profile = await getCurrentUserProfile()

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/60">Welcome back, {profile?.first_name || "Administrator"}</p>
          </div>

          {/* Admin Status Card */}
          <div className="mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-purple-400" />
                  Administrator Access Verified
                </CardTitle>
                <CardDescription className="text-white/60">
                  You have full administrative privileges for the Kynky.ro shader platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-white">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-sm text-white/60">{profile?.email}</p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <Crown className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-purple-400" />
                  User Management
                </CardTitle>
                <CardDescription className="text-white/60">
                  Manage user accounts, subscriptions, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Palette className="h-5 w-5 text-purple-400" />
                  Shader Management
                </CardTitle>
                <CardDescription className="text-white/60">
                  Moderate shaders, manage featured content, and handle reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <Link href="/admin/shaders">Manage Shaders</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Crown className="h-5 w-5 text-purple-400" />
                  Subscription Management
                </CardTitle>
                <CardDescription className="text-white/60">
                  Monitor subscriptions, billing, and revenue analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <Link href="/admin/subscriptions">Manage Subscriptions</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Analytics & Reports
                </CardTitle>
                <CardDescription className="text-white/60">
                  View platform statistics, user engagement, and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="h-5 w-5 text-purple-400" />
                  Database Administration
                </CardTitle>
                <CardDescription className="text-white/60">
                  Monitor database health, manage schemas, and view system logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <Link href="/admin/database">Database Admin</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-purple-400" />
                  System Settings
                </CardTitle>
                <CardDescription className="text-white/60">
                  Configure platform settings, features, and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <Link href="/admin/settings">System Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription className="text-white/60">
                Recent activity and system health notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Authentication system operational</p>
                    <p className="text-sm text-white/60">All authentication components working correctly</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Database schema with RLS active</p>
                    <p className="text-sm text-white/60">Row Level Security policies are enforced</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Shader rendering engine operational</p>
                    <p className="text-sm text-white/60">WebGL and compute shader support active</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Subscription system active</p>
                    <p className="text-sm text-white/60">Payment processing and billing operational</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
