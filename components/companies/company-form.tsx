"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id?: string
  name: string
  cui: string
  registration_number: string
  legal_form: string
  status: string
  activity_description?: string
  activity_code?: string
  website?: string
  email?: string
  phone?: string
  share_capital?: number
  registration_date?: string
  registered_address?: {
    street: string
    city: string
    county: string
    postal_code: string
    country: string
  }
}

interface CompanyFormProps {
  company?: Company
  userId: string
  mode: "create" | "edit"
}

export function CompanyForm({ company, userId, mode }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Company>({
    name: company?.name || "",
    cui: company?.cui || "",
    registration_number: company?.registration_number || "",
    legal_form: company?.legal_form || "",
    status: company?.status || "active",
    activity_description: company?.activity_description || "",
    activity_code: company?.activity_code || "",
    website: company?.website || "",
    email: company?.email || "",
    phone: company?.phone || "",
    share_capital: company?.share_capital || 0,
    registration_date: company?.registration_date || "",
    registered_address: company?.registered_address || {
      street: "",
      city: "",
      county: "",
      postal_code: "",
      country: "România",
    },
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.name || !formData.cui || !formData.registration_number || !formData.legal_form) {
      toast({
        title: "Eroare",
        description: "Te rog completează toate câmpurile obligatorii.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const companyData = {
        name: formData.name,
        cui: formData.cui,
        registration_number: formData.registration_number,
        legal_form: formData.legal_form,
        status: formData.status,
        activity_description: formData.activity_description,
        activity_code: formData.activity_code,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        share_capital: formData.share_capital,
        registration_date: formData.registration_date || null,
        registered_address: formData.registered_address,
        ...(mode === "create" ? { created_by: userId } : {}),
        updated_by: userId,
      }

      let result
      if (mode === "create") {
        result = await supabase.from("companies").insert(companyData).select().single()
      } else {
        result = await supabase.from("companies").update(companyData).eq("id", company?.id).select().single()
      }

      if (result.error) throw result.error

      toast({
        title: "Succes",
        description: mode === "create" ? "Compania a fost creată cu succes." : "Compania a fost actualizată cu succes.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving company:", error)
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvarea companiei.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {mode === "create" ? "Adaugă Companie Nouă" : "Editează Compania"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Completează informațiile pentru a înregistra o companie nouă în sistem."
            : "Actualizează informațiile companiei."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informații de Bază</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Denumirea Companiei *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="SC EXEMPLU SRL"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cui">CUI *</Label>
                <Input
                  id="cui"
                  value={formData.cui}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cui: e.target.value }))}
                  placeholder="RO12345678"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registration_number">Număr de Înregistrare *</Label>
                <Input
                  id="registration_number"
                  value={formData.registration_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, registration_number: e.target.value }))}
                  placeholder="J40/1234/2023"
                  required
                />
              </div>

              <div>
                <Label htmlFor="legal_form">Forma Juridică *</Label>
                <Select
                  value={formData.legal_form}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, legal_form: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează forma juridică" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SRL">SRL - Societate cu Răspundere Limitată</SelectItem>
                    <SelectItem value="SA">SA - Societate pe Acțiuni</SelectItem>
                    <SelectItem value="PFA">PFA - Persoană Fizică Autorizată</SelectItem>
                    <SelectItem value="II">II - Întreprindere Individuală</SelectItem>
                    <SelectItem value="SNC">SNC - Societate în Nume Colectiv</SelectItem>
                    <SelectItem value="SCS">SCS - Societate în Comandită Simplă</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activă</SelectItem>
                    <SelectItem value="suspended">Suspendată</SelectItem>
                    <SelectItem value="dissolved">Dizolvată</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="registration_date">Data Înregistrării</Label>
                <Input
                  id="registration_date"
                  type="date"
                  value={formData.registration_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, registration_date: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informații despre Activitate</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity_code">Cod CAEN</Label>
                <Input
                  id="activity_code"
                  value={formData.activity_code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, activity_code: e.target.value }))}
                  placeholder="6201"
                />
              </div>

              <div>
                <Label htmlFor="share_capital">Capital Social (RON)</Label>
                <Input
                  id="share_capital"
                  type="number"
                  value={formData.share_capital}
                  onChange={(e) => setFormData((prev) => ({ ...prev, share_capital: Number(e.target.value) }))}
                  placeholder="200"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="activity_description">Descrierea Activității</Label>
              <Textarea
                id="activity_description"
                value={formData.activity_description}
                onChange={(e) => setFormData((prev) => ({ ...prev, activity_description: e.target.value }))}
                placeholder="Descrierea principalei activități a companiei"
                rows={3}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informații de Contact</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@companie.ro"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+40 123 456 789"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://companie.ro"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Adresa Sediului Social</h3>

            <div>
              <Label htmlFor="street">Strada și Numărul</Label>
              <Input
                id="street"
                value={formData.registered_address?.street || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    registered_address: {
                      ...prev.registered_address!,
                      street: e.target.value,
                    },
                  }))
                }
                placeholder="Str. Exemplu, nr. 123"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Orașul</Label>
                <Input
                  id="city"
                  value={formData.registered_address?.city || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      registered_address: {
                        ...prev.registered_address!,
                        city: e.target.value,
                      },
                    }))
                  }
                  placeholder="București"
                />
              </div>

              <div>
                <Label htmlFor="county">Județul</Label>
                <Input
                  id="county"
                  value={formData.registered_address?.county || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      registered_address: {
                        ...prev.registered_address!,
                        county: e.target.value,
                      },
                    }))
                  }
                  placeholder="București"
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Cod Poștal</Label>
                <Input
                  id="postal_code"
                  value={formData.registered_address?.postal_code || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      registered_address: {
                        ...prev.registered_address!,
                        postal_code: e.target.value,
                      },
                    }))
                  }
                  placeholder="123456"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Se salvează..." : mode === "create" ? "Creează Compania" : "Actualizează Compania"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              <X className="h-4 w-4 mr-2" />
              Anulează
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
