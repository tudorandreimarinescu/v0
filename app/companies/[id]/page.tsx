import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Edit, ArrowLeft, Globe, Mail, Phone, MapPin, Calendar, Hash } from "lucide-react"
import Link from "next/link"

interface CompanyPageProps {
  params: { id: string }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    redirect("/auth/login")
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select(`
      *,
      company_administrators(*),
      company_shareholders(*),
      company_financial_data(*),
      company_documents(*)
    `)
    .eq("id", params.id)
    .eq("created_by", user.user.id)
    .single()

  if (error || !company) {
    notFound()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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

  const statusConfig = getStatusBadge(company.status)

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
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Building2 className="h-8 w-8" />
                  {company.name}
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </h1>
                <p className="text-muted-foreground mt-1">
                  {company.legal_form} • CUI: {company.cui}
                </p>
              </div>
              <Button asChild>
                <Link href={`/companies/${company.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editează
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informații de Bază</CardTitle>
                <CardDescription>Detaliile principale ale companiei</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Număr Înregistrare</p>
                      <p className="font-medium">{company.registration_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data Înregistrării</p>
                      <p className="font-medium">
                        {company.registration_date ? formatDate(company.registration_date) : "Nu este specificată"}
                      </p>
                    </div>
                  </div>
                </div>

                {company.activity_description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Descrierea Activității</p>
                    <p className="text-sm">{company.activity_description}</p>
                  </div>
                )}

                {company.activity_code && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cod CAEN</p>
                    <p className="font-medium">{company.activity_code}</p>
                  </div>
                )}

                {company.share_capital && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Capital Social</p>
                    <p className="font-medium">{formatCurrency(company.share_capital)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>Informații de contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${company.email}`} className="font-medium text-primary hover:underline">
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <a href={`tel:${company.phone}`} className="font-medium text-primary hover:underline">
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address */}
            {company.registered_address && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresa Sediului Social
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {company.registered_address.street && <p>{company.registered_address.street}</p>}
                    <p>
                      {[
                        company.registered_address.city,
                        company.registered_address.county,
                        company.registered_address.postal_code,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {company.registered_address.country && <p>{company.registered_address.country}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistici Rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Administratori</span>
                  <span className="font-medium">{company.company_administrators?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Acționari</span>
                  <span className="font-medium">{company.company_shareholders?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documente</span>
                  <span className="font-medium">{company.company_documents?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rapoarte Financiare</span>
                  <span className="font-medium">{company.company_financial_data?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
