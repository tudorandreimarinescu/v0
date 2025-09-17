import AdminGuard from "@/components/admin-guard"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileText, Eye, Download, Trash2 } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Document {
  id: string
  document_name: string
  document_type: string
  file_size: number
  status: string
  created_at: string
  companies: {
    name: string
    cui: string
  }
  profiles: {
    first_name: string | null
    last_name: string | null
    email: string
  }
}

export default async function AdminDocumentsPage() {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
    .from("company_documents")
    .select(`
      id,
      document_name,
      document_type,
      file_size,
      status,
      created_at,
      companies!inner(name, cui),
      profiles!company_documents_uploaded_by_fkey(first_name, last_name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
  }

  const documentsList = documents || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activ", variant: "default" as const },
      expired: { label: "Expirat", variant: "destructive" as const },
      pending: { label: "În Așteptare", variant: "secondary" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" as const }
  }

  // Calculate statistics
  const totalDocuments = documentsList.length
  const totalSize = documentsList.reduce((sum, doc) => sum + (doc.file_size || 0), 0)
  const documentsByType = documentsList.reduce(
    (acc, doc) => {
      acc[doc.document_type] = (acc[doc.document_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

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
            <h1 className="text-3xl font-bold text-foreground">Gestionare Documente</h1>
            <p className="text-muted-foreground">Administrează toate documentele din sistem</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Documente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDocuments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Spațiu Utilizat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tipuri Documente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(documentsByType).length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Documente Astăzi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    documentsList.filter((doc) => {
                      const today = new Date()
                      const docDate = new Date(doc.created_at)
                      return docDate.toDateString() === today.toDateString()
                    }).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Toate Documentele ({totalDocuments})
              </CardTitle>
              <CardDescription>Lista completă a documentelor încărcate în sistem</CardDescription>
            </CardHeader>
            <CardContent>
              {documentsList.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Niciun document în sistem</h3>
                  <p className="text-muted-foreground">Nu există documente încărcate momentan.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Companie</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Mărime</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Încărcat de</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentsList.map((document) => {
                        const statusConfig = getStatusBadge(document.status)
                        return (
                          <TableRow key={document.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{document.document_name}</p>
                                  <p className="text-xs text-muted-foreground">{document.id.slice(0, 8)}...</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{document.companies.name}</p>
                                <p className="text-xs text-muted-foreground">{document.companies.cui}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{getDocumentTypeLabel(document.document_type)}</Badge>
                            </TableCell>
                            <TableCell>{formatFileSize(document.file_size || 0)}</TableCell>
                            <TableCell>
                              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {document.profiles?.first_name} {document.profiles?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">{document.profiles?.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(document.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Types Overview */}
          {Object.keys(documentsByType).length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Distribuția Tipurilor de Documente</CardTitle>
                <CardDescription>Numărul de documente pe fiecare tip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(documentsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">{getDocumentTypeLabel(type)}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}
