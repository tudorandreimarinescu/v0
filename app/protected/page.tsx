import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCurrentUserProfile } from "@/lib/auth/admin"
import RoleBadge from "@/components/role-badge"
import { Settings } from "lucide-react"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const profile = await getCurrentUserProfile()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Protected Area</h1>

          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Your account information and role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{data.user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Role:</span>
                    <RoleBadge role={profile?.role || "user"} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Member since: {new Date(profile?.created_at || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Access Card */}
            {profile?.role === "admin" && (
              <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <Settings className="h-5 w-5" />
                    Admin Access
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    You have administrative privileges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/admin">Access Admin Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Authentication Status */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Status</CardTitle>
                <CardDescription>Your current session information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> Authenticated ✅
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">User ID:</span> {data.user.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email Confirmed:</span>{" "}
                    {data.user.email_confirmed_at ? "Yes ✅" : "No ❌"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common actions and navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/">Home</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/orders">My Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
