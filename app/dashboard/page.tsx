import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CompanyOverview } from "@/components/dashboard/company-overview"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CompanyOverview userId={data.user.id} />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <FinancialSummary userId={data.user.id} />
          </div>
        </div>
        <div className="mt-8">
          <RecentDocuments userId={data.user.id} />
        </div>
      </main>
    </div>
  )
}
