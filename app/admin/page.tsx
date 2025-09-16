import AdminGuard from "@/components/admin-guard"
import { getCurrentUserProfile } from "@/lib/auth/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Package, ShoppingCart, Star, Settings, BarChart3 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const profile = await getCurrentUserProfile()

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/60">Welcome back, {profile?.first_name || "Admin"}</p>
          </div>

          {/* Admin Status Card */}
          <div className="mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-purple-400" />
                  Admin Access Verified
                </CardTitle>
                <CardDescription className="text-white/60">You have full administrative privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-white">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-sm text-white/60">{profile?.email}</p>
                  </div>
                  <Badge className="bg-purple-400 text-black">Admin</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-purple-400" />
                  User Management
                </CardTitle>
                <CardDescription className="text-white/60">Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Package className="h-5 w-5 text-purple-400" />
                  Product Management
                </CardTitle>
                <CardDescription className="text-white/60">Add, edit, and manage products</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ShoppingCart className="h-5 w-5 text-purple-400" />
                  Order Management
                </CardTitle>
                <CardDescription className="text-white/60">View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                  <Link href="/admin/orders">Manage Orders</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Star className="h-5 w-5 text-purple-400" />
                  Review Management
                </CardTitle>
                <CardDescription className="text-white/60">Moderate and manage reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                  <Link href="/admin/reviews">Manage Reviews</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Analytics
                </CardTitle>
                <CardDescription className="text-white/60">View sales and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-purple-400" />
                  System Settings
                </CardTitle>
                <CardDescription className="text-white/60">Configure system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                  <Link href="/admin/settings">System Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-white/60">Latest system activity and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Authentication system configured</p>
                    <p className="text-sm text-white/60">All auth components are working correctly</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Database schema with RLS enabled</p>
                    <p className="text-sm text-white/60">Row Level Security policies are active</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Admin role management active</p>
                    <p className="text-sm text-white/60">JWT claims and role verification working</p>
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
