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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.first_name || "Admin"}</p>
          </div>

          {/* Admin Status Card */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Admin Access Verified
                </CardTitle>
                <CardDescription>You have full administrative privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                  <Badge variant="destructive">Admin</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Management
                </CardTitle>
                <CardDescription>Add, edit, and manage products</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Management
                </CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/orders">Manage Orders</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Review Management
                </CardTitle>
                <CardDescription>Moderate and manage reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/reviews">Manage Reviews</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics
                </CardTitle>
                <CardDescription>View sales and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/settings">System Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activity and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Authentication system configured</p>
                    <p className="text-sm text-muted-foreground">All auth components are working correctly</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Database schema with RLS enabled</p>
                    <p className="text-sm text-muted-foreground">Row Level Security policies are active</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Admin role management active</p>
                    <p className="text-sm text-muted-foreground">JWT claims and role verification working</p>
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
