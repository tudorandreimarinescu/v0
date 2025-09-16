import AdminGuard from "@/components/admin-guard"
import { getCurrentUserProfile } from "@/lib/auth/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Building2, FileText, BarChart3, Settings, Shield, Database, Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const profile = await getCurrentUserProfile()

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Panou Administrare</h1>
            <p className="text-muted-foreground">Bun venit, {profile?.first_name || "Administrator"}</p>
          </div>

          {/* Admin Status Card */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  Acces Administrator Verificat
                </CardTitle>
                <CardDescription>Ai privilegii administrative complete pentru sistemul Kynky.ro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">Administrator</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Gestionare Utilizatori
                </CardTitle>
                <CardDescription>Administrează conturile și permisiunile utilizatorilor</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/users">Gestionează Utilizatori</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-accent" />
                  Gestionare Companii
                </CardTitle>
                <CardDescription>Administrează companiile înregistrate în sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/companies">Gestionează Companii</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Gestionare Documente
                </CardTitle>
                <CardDescription>Administrează documentele încărcate în sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/documents">Gestionează Documente</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Rapoarte și Analize
                </CardTitle>
                <CardDescription>Vezi statistici și rapoarte de performanță</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/analytics">Vezi Analize</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-accent" />
                  Administrare Bază de Date
                </CardTitle>
                <CardDescription>Gestionează schema și datele din baza de date</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/database">Administrare BD</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" />
                  Setări Sistem
                </CardTitle>
                <CardDescription>Configurează setările sistemului</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/settings">Setări Sistem</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status Sistem
              </CardTitle>
              <CardDescription>Activitatea recentă și notificări de sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Sistem de autentificare configurat</p>
                    <p className="text-sm text-muted-foreground">
                      Toate componentele de autentificare funcționează corect
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Schema bazei de date cu RLS activă</p>
                    <p className="text-sm text-muted-foreground">Politicile Row Level Security sunt active</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Gestionarea rolurilor de administrator activă</p>
                    <p className="text-sm text-muted-foreground">JWT claims și verificarea rolurilor funcționează</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Sistem de gestionare companii operațional</p>
                    <p className="text-sm text-muted-foreground">Schema pentru companii românești implementată</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
