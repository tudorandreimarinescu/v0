import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  cui: string
  registration_number: string
  legal_form: string
  status: string
  created_at: string
}

interface CompanyOverviewProps {
  userId: string
}

export async function CompanyOverview({ userId }: CompanyOverviewProps) {
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
      created_at
    `)
    .eq("created_by", userId)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching companies:", error)
  }

  const companiesList = companies || []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Companiile Mele
            </CardTitle>
            <CardDescription>Gestionează companiile înregistrate în sistem</CardDescription>
          </div>
          <Button asChild>
            <Link href="/companies/new">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Companie
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {companiesList.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nicio companie înregistrată</h3>
            <p className="text-muted-foreground mb-4">Începe prin a adăuga prima ta companie în sistem.</p>
            <Button asChild>
              <Link href="/companies/new">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Prima Companie
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {companiesList.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{company.name}</h3>
                    <Badge variant={company.status === "active" ? "default" : "secondary"}>
                      {company.status === "active" ? "Activă" : "Inactivă"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>CUI: {company.cui}</span>
                    <span>Nr. Reg: {company.registration_number}</span>
                    <span>{company.legal_form}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/companies/${company.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/companies/${company.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            {companiesList.length >= 6 && (
              <div className="text-center pt-4">
                <Button variant="outline" asChild>
                  <Link href="/companies">Vezi Toate Companiile</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
