import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { SubscriptionStatus } from "@/components/dashboard/subscription-status"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UsageStats } from "@/components/dashboard/usage-stats"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ProjectsOverview userId={data.user.id} />
            <RecentActivity userId={data.user.id} />
          </div>
          <div className="space-y-6">
            <SubscriptionStatus userId={data.user.id} />
            <QuickActions />
            <UsageStats userId={data.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
