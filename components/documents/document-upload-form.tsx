"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentUploadFormProps {
  userId: string
}

export function DocumentUploadForm({ userId }: DocumentUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [companies, setCompanies] = useState<Array<{ id: string; name: string; cui: string }>>([])
  const [formData, setFormData] = useState({
    companyId: "",
    documentName: "",
    documentType: "",
    issueDate: "",
    expiryDate: "",
    description: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadCompanies = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("companies").select("id, name, cui").eq("created_by", userId).order("name")

      if (data) {
        setCompanies(data)
      }
    }
    loadCompanies()
  }, [userId])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Eroare",
          description: "Fișierul este prea mare. Dimensiunea maximă permisă este 10MB.",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      if (!formData.documentName) {
        setFormData((prev) => ({
          ...prev,
          documentName: file.name.replace(/\.[^/.]+$/, ""),
        }))
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedFile || !formData.companyId || !formData.documentName || !formData.documentType) {
      toast({
        title: "Eroare",
        description: "Te rog completează toate câmpurile obligatorii și selectează un fișier.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `documents/${userId}/${fileName}`

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, selectedFile)

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        // Continue without file storage if bucket doesn't exist
      }

      // Get public URL if upload was successful
      let fileUrl = null
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath)
        fileUrl = urlData.publicUrl
      }

      const { data, error } = await supabase
        .from("company_documents")
        .insert({
          company_id: formData.companyId,
          document_name: formData.documentName,
          document_type: formData.documentType,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          file_url: fileUrl,
          issue_date: formData.issueDate || null,
          expiry_date: formData.expiryDate || null,
          status: "active",
          uploaded_by: userId,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Succes",
        description: "Documentul a fost încărcat cu succes.",
      })

      router.push("/documents")
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Eroare",
        description: "A apărut o eroare la încărcarea documentului.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="company">Companie *</Label>
          <Select
            value={formData.companyId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, companyId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectează compania" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name} ({company.cui})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="documentType">Tip Document *</Label>
          <Select
            value={formData.documentType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, documentType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectează tipul documentului" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="certificate">Certificat</SelectItem>
              <SelectItem value="balance_sheet">Bilanț</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="invoice">Factură</SelectItem>
              <SelectItem value="tax_return">Declarație Fiscală</SelectItem>
              <SelectItem value="legal_document">Document Legal</SelectItem>
              <SelectItem value="financial_statement">Situație Financiară</SelectItem>
              <SelectItem value="other">Altele</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="documentName">Nume Document *</Label>
          <Input
            id="documentName"
            value={formData.documentName}
            onChange={(e) => setFormData((prev) => ({ ...prev, documentName: e.target.value }))}
            placeholder="Numele documentului"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="issueDate">Data Emiterii</Label>
            <Input
              id="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">Data Expirării</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descriere</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descriere opțională a documentului"
            rows={3}
          />
        </div>

        <div>
          <Label>Fișier *</Label>
          {selectedFile ? (
            <Card className="mt-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Click pentru a încărca</span> sau trage fișierul aici
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Se încarcă..." : "Încarcă Document"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Anulează
        </Button>
      </div>
    </form>
  )
}
