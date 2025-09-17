import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Eye, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CompaniesPage() {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    redirect("/auth/login")
  }

  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .eq("created_by", user.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching companies:", error)
  }

  const companiesList = companies || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activă", variant: "default" as const },
      suspended: { label: "Suspendată", variant: "secondary" as const },
      dissolved: { label: "Dizolvată", variant: "destructive" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" as const }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi la Dashboard
              </Link>
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Companiile Mele</h1>
                <p className="text-muted-foreground">Gestionează toate companiile înregistrate</p>
              </div>
              <Button asChild>
                <Link href="/companies/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă Companie
                </Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Toate Companiile ({companiesList.length})
              </CardTitle>
              <CardDescription>Lista completă a companiilor tale înregistrate în sistem</CardDescription>
            </CardHeader>
            <CardContent>
              {companiesList.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nicio companie înregistrată</h3>
                  <p className="text-muted-foreground mb-6">Începe prin a adăuga prima ta companie în sistem.</p>
                  <Button asChild>
                    <Link href="/companies/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Adaugă Prima Companie
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {companiesList.map((company) => {
                    const statusConfig = getStatusBadge(company.status)
                    return (
                      <Card key={company.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{company.name}</CardTitle>
                              <Badge variant={statusConfig.variant} className="mb-2">
                                {statusConfig.label}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex justify-between">
                              <span>CUI:</span>
                              <span className="font-medium">{company.cui}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Nr. Reg:</span>
                              <span className="font-medium">{company.registration_number}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Forma:</span>
                              <span className="font-medium">{company.legal_form}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Creată:</span>
                              <span className="font-medium">{formatDate(company.created_at)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                              <Link href={`/companies/${company.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Vezi
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                              <Link href={`/companies/${company.id}/edit`}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editează
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
