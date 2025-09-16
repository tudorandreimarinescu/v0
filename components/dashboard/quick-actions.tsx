import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, FileText, Users } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acțiuni Rapide</CardTitle>
        <CardDescription>Operațiuni frecvente pentru gestionarea companiilor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start bg-transparent" variant="outline">
          <Link href="/companies/new">
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Companie Nouă
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent" variant="outline">
          <Link href="/documents/upload">
            <Upload className="h-4 w-4 mr-2" />
            Încarcă Document
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent" variant="outline">
          <Link href="/reports">
            <FileText className="h-4 w-4 mr-2" />
            Generează Raport
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent" variant="outline">
          <Link href="/users">
            <Users className="h-4 w-4 mr-2" />
            Gestionează Utilizatori
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
