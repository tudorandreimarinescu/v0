import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CompanyForm } from "@/components/companies/company-form"

export default async function NewCompanyPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CompanyForm userId={data.user.id} mode="create" />
        </div>
      </div>
    </div>
  )
}
