import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"

interface DocumentsFiltersProps {
  userId: string
}

export async function DocumentsFilters({ userId }: DocumentsFiltersProps) {
  const supabase = await createClient()

  // Get companies for filter
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, cui")
    .eq("created_by", userId)
    .order("name")

  // Get document types count
  const { data: documentTypes } = await supabase
    .from("company_documents")
    .select(`
      document_type,
      companies!inner(created_by)
    `)
    .eq("companies.created_by", userId)

  const companiesList = companies || []
  const typesCounts =
    documentTypes?.reduce(
      (acc, doc) => {
        acc[doc.document_type] = (acc[doc.document_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      certificate: "Certificat",
      balance_sheet: "Bilanț",
      contract: "Contract",
      invoice: "Factură",
      tax_return: "Declarație Fiscală",
      legal_document: "Document Legal",
      financial_statement: "Situație Financiară",
      other: "Altele",
    }
    return types[type] || type
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Companii</h4>
            <div className="space-y-2">
              {companiesList.map((company) => (
                <div key={company.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{company.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {company.cui}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Tipuri Documente</h4>
            <div className="space-y-2">
              {Object.entries(typesCounts).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between text-sm">
                  <span>{getDocumentTypeLabel(type)}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active</span>
                <Badge variant="default">Activ</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Expirate</span>
                <Badge variant="destructive">Expirat</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>În Așteptare</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
