import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"
import Link from "next/link"

interface Document {
  id: string
  document_name: string
  document_type: string
  created_at: string
  companies: {
    name: string
  }
}

interface RecentDocumentsProps {
  userId: string
}

export async function RecentDocuments({ userId }: RecentDocumentsProps) {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
    .from("company_documents")
    .select(`
      id,
      document_name,
      document_type,
      created_at,
      companies!inner(name, created_by)
    `)
    .eq("companies.created_by", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching documents:", error)
  }

  const documentsList = documents || []

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      certificate: "Certificat",
      balance_sheet: "Bilanț",
      contract: "Contract",
      invoice: "Factură",
      other: "Altele",
    }
    return types[type] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documente Recente
            </CardTitle>
            <CardDescription>Ultimele documente încărcate în sistem</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/documents">Vezi Toate</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documentsList.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Niciun document</h3>
            <p className="text-muted-foreground">Documentele încărcate vor apărea aici.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documentsList.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{document.document_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{getDocumentTypeLabel(document.document_type)}</Badge>
                      <span className="text-sm text-muted-foreground">{document.companies.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(document.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
