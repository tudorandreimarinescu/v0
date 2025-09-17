import AdminGuard from "@/components/admin-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Settings, Shield, Mail, Database, Bell, Users } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Setări Sistem</h1>
            <p className="text-muted-foreground">Configurează setările generale ale sistemului</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Setări Generale
                </CardTitle>
                <CardDescription>Configurări de bază ale sistemului</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Numele Sistemului</Label>
                  <Input id="site-name" defaultValue="Kynky.ro" />
                </div>
                <div>
                  <Label htmlFor="site-description">Descrierea Sistemului</Label>
                  <Textarea
                    id="site-description"
                    defaultValue="Sistem de management pentru companii românești"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Email Administrator Principal</Label>
                  <Input id="admin-email" type="email" placeholder="admin@kynky.ro" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Mod Mentenanță</Label>
                    <p className="text-sm text-muted-foreground">Activează pentru a restricționa accesul</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Setări Securitate
                </CardTitle>
                <CardDescription>Configurări de securitate și autentificare</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require-email-verification">Verificare Email Obligatorie</Label>
                    <p className="text-sm text-muted-foreground">Utilizatorii trebuie să verifice email-ul</p>
                  </div>
                  <Switch id="require-email-verification" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth">Autentificare cu Doi Factori</Label>
                    <p className="text-sm text-muted-foreground">Activează 2FA pentru administratori</p>
                  </div>
                  <Switch id="two-factor-auth" />
                </div>
                <div>
                  <Label htmlFor="session-timeout">Timeout Sesiune (minute)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-complexity">Complexitate Parolă</Label>
                    <p className="text-sm text-muted-foreground">Cerințe stricte pentru parole</p>
                  </div>
                  <Switch id="password-complexity" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Setări Email
                </CardTitle>
                <CardDescription>Configurări pentru trimiterea de email-uri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtp-host">Server SMTP</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-port">Port SMTP</Label>
                    <Input id="smtp-port" type="number" defaultValue="587" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-security">Securitate</Label>
                    <Input id="smtp-security" defaultValue="TLS" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="from-email">Email Expeditor</Label>
                  <Input id="from-email" type="email" placeholder="noreply@kynky.ro" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificări Email</Label>
                    <p className="text-sm text-muted-foreground">Trimite notificări automate</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Database Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Setări Bază de Date
                </CardTitle>
                <CardDescription>Configurări pentru baza de date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Backup Automat</Label>
                    <p className="text-sm text-muted-foreground">Backup zilnic al bazei de date</p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="backup-retention">Păstrare Backup-uri (zile)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="query-logging">Logging Query-uri</Label>
                    <p className="text-sm text-muted-foreground">Înregistrează query-urile lente</p>
                  </div>
                  <Switch id="query-logging" />
                </div>
                <div>
                  <Label htmlFor="connection-pool">Pool Conexiuni</Label>
                  <Input id="connection-pool" type="number" defaultValue="20" />
                </div>
              </CardContent>
            </Card>

            {/* User Management Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Setări Utilizatori
                </CardTitle>
                <CardDescription>Configurări pentru gestionarea utilizatorilor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-registration">Înregistrare Publică</Label>
                    <p className="text-sm text-muted-foreground">Permite înregistrarea de noi utilizatori</p>
                  </div>
                  <Switch id="allow-registration" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="max-companies">Companii Maxime per Utilizator</Label>
                  <Input id="max-companies" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="max-documents">Documente Maxime per Companie</Label>
                  <Input id="max-documents" type="number" defaultValue="100" />
                </div>
                <div>
                  <Label htmlFor="max-file-size">Mărime Maximă Fișier (MB)</Label>
                  <Input id="max-file-size" type="number" defaultValue="10" />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Setări Notificări
                </CardTitle>
                <CardDescription>Configurări pentru notificările sistemului</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="document-expiry-alerts">Alerte Expirare Documente</Label>
                    <p className="text-sm text-muted-foreground">Notifică cu 30 zile înainte</p>
                  </div>
                  <Switch id="document-expiry-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-user-alerts">Alerte Utilizatori Noi</Label>
                    <p className="text-sm text-muted-foreground">Notifică administratorii</p>
                  </div>
                  <Switch id="new-user-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-alerts">Alerte Sistem</Label>
                    <p className="text-sm text-muted-foreground">Erori și probleme de sistem</p>
                  </div>
                  <Switch id="system-alerts" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="alert-email">Email pentru Alerte</Label>
                  <Input id="alert-email" type="email" placeholder="alerts@kynky.ro" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button size="lg">Salvează Setările</Button>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
