import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Edit, Trash2 } from "lucide-react"

interface Document {
  id: string
  document_name: string
  document_type: string
  file_size: number
  mime_type: string
  issue_date: string | null
  expiry_date: string | null
  status: string
  created_at: string
  companies: {
    name: string
    cui: string
  }
}

interface DocumentsListProps {
  userId: string
}

export async function DocumentsList({ userId }: DocumentsListProps) {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
    .from("company_documents")
    .select(`
      id,
      document_name,
      document_type,
      file_size,
      mime_type,
      issue_date,
      expiry_date,
      status,
      created_at,
      companies!inner(name, cui, created_by)
    `)
    .eq("companies.created_by", userId)
    .order("created_at", { ascending: false })

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
      tax_return: "Declarație Fiscală",
      legal_document: "Document Legal",
      financial_statement: "Situație Financiară",
      other: "Altele",
    }
    return types[type] || type
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activ", variant: "default" as const },
      expired: { label: "Expirat", variant: "destructive" as const },
      pending: { label: "În Așteptare", variant: "secondary" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" as const }
  }

  if (documentsList.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Niciun document găsit</h3>
          <p className="text-muted-foreground mb-6">
            Nu ai încărcat încă documente în sistem. Începe prin a adăuga primul document.
          </p>
          <Button asChild>
            <a href="/documents/upload">
              <FileText className="h-4 w-4 mr-2" />
              Încarcă Primul Document
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {documentsList.map((document) => {
        const statusConfig = getStatusBadge(document.status)
        return (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium truncate">{document.document_name}</h3>
                      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div>
                        <span className="font-medium">Companie:</span> {document.companies.name}
                      </div>
                      <div>
                        <span className="font-medium">CUI:</span> {document.companies.cui}
                      </div>
                      <div>
                        <span className="font-medium">Tip:</span> {getDocumentTypeLabel(document.document_type)}
                      </div>
                      <div>
                        <span className="font-medium">Mărime:</span> {formatFileSize(document.file_size || 0)}
                      </div>
                      <div>
                        <span className="font-medium">Data Emiterii:</span> {formatDate(document.issue_date)}
                      </div>
                      <div>
                        <span className="font-medium">Data Expirării:</span> {formatDate(document.expiry_date)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Încărcat la {formatDate(document.created_at)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
