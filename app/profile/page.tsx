import type { Metadata } from "next"
import { redirect } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield } from "lucide-react"
import { getCurrentUserProfile } from "@/lib/auth/admin"
import ProfileEditForm from "@/components/profile-edit-form"

export const metadata: Metadata = {
  title: "Profile - ShaderStore",
  description: "Manage your ShaderStore account and preferences.",
}

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile()

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-light text-white">
              My <span className="font-medium italic instrument">Profile</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto bg-purple-400/20 rounded-full flex items-center justify-center mb-4">
                    <User className="h-10 w-10 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white/60">{profile.email}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">Role</span>
                    <Badge
                      variant={profile.role === "admin" ? "default" : "secondary"}
                      className={
                        profile.role === "admin" ? "bg-purple-400 text-black" : "bg-white/10 text-white border-white/20"
                      }
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {profile.role === "admin" ? "Administrator" : "Customer"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">Member since</span>
                    <div className="flex items-center gap-1 text-sm text-white">
                      <Calendar className="h-3 w-3" />
                      {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Edit Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileEditForm profile={profile} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
