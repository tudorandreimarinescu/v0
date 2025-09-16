import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DocumentsHeader } from "@/components/documents/documents-header"
import { DocumentsList } from "@/components/documents/documents-list"
import { DocumentsFilters } from "@/components/documents/documents-filters"

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DocumentsHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <DocumentsFilters userId={data.user.id} />
          </div>
          <div className="lg:col-span-3">
            <DocumentsList userId={data.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
