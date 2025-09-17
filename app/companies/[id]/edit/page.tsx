import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CompanyForm } from "@/components/companies/company-form"

interface EditCompanyPageProps {
  params: { id: string }
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    redirect("/auth/login")
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", params.id)
    .eq("created_by", user.user.id)
    .single()

  if (error || !company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CompanyForm company={company} userId={user.user.id} mode="edit" />
        </div>
      </div>
    </div>
  )
}
