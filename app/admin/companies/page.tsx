import AdminGuard from "@/components/admin-guard"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Building2, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Company {
  id: string
  name: string
  cui: string
  registration_number: string
  legal_form: string
  status: string
  created_at: string
  profiles: {
    first_name: string | null
    last_name: string | null
    email: string
  }
}

export default async function AdminCompaniesPage() {
  const supabase = await createClient()

  const { data: companies, error } = await supabase
    .from("companies")
    .select(`
      id,
      name,
      cui,
      registration_number,
      legal_form,
      status,
      created_at,
      profiles!companies_created_by_fkey(first_name, last_name, email)
    `)
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
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi la Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Gestionare Companii</h1>
            <p className="text-muted-foreground">Administrează toate companiile înregistrate în sistem</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Toate Companiile ({companiesList.length})
              </CardTitle>
              <CardDescription>Vezi și administrează companiile înregistrate de utilizatori</CardDescription>
            </CardHeader>
            <CardContent>
              {companiesList.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nicio companie înregistrată</h3>
                  <p className="text-muted-foreground">Nu există companii în sistem momentan.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Companie</TableHead>
                      <TableHead>CUI</TableHead>
                      <TableHead>Nr. Înregistrare</TableHead>
                      <TableHead>Forma Juridică</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Proprietar</TableHead>
                      <TableHead>Data Creării</TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companiesList.map((company) => {
                      const statusConfig = getStatusBadge(company.status)
                      return (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.cui}</TableCell>
                          <TableCell>{company.registration_number}</TableCell>
                          <TableCell>{company.legal_form}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {company.profiles?.first_name} {company.profiles?.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">{company.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(company.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
