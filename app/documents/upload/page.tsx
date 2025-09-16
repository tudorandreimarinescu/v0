import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DocumentUploadForm } from "@/components/documents/document-upload-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"

export default async function DocumentUploadPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Încarcă Document Nou
              </CardTitle>
              <CardDescription>Adaugă documente importante pentru companiile tale în sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploadForm userId={data.user.id} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
