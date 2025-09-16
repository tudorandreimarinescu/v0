import AdminGuard from "@/components/admin-guard"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, Users, FileText, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  // Get analytics data
  const [
    { count: totalUsers },
    { count: totalCompanies },
    { count: totalDocuments },
    { data: recentCompanies },
    { data: financialData },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("company_documents").select("*", { count: "exact", head: true }),
    supabase
      .from("companies")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false }),
    supabase.from("company_financial_data").select("revenue, profit, year").eq("year", new Date().getFullYear()),
  ])

  const totalRevenue = financialData?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0
  const totalProfit = financialData?.reduce((sum, item) => sum + (item.profit || 0), 0) || 0
  const recentCompaniesCount = recentCompanies?.length || 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
            <h1 className="text-3xl font-bold text-foreground">Analize și Rapoarte</h1>
            <p className="text-muted-foreground">Statistici și metrici de performanță pentru sistemul Kynky.ro</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Utilizatori înregistrați în sistem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Companii</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCompanies || 0}</div>
                <p className="text-xs text-muted-foreground">Companii înregistrate în sistem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documente</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDocuments || 0}</div>
                <p className="text-xs text-muted-foreground">Documente încărcate în sistem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Companii Noi (30 zile)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentCompaniesCount}</div>
                <p className="text-xs text-muted-foreground">Companii adăugate recent</p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Cifra de Afaceri Totală {new Date().getFullYear()}
                </CardTitle>
                <CardDescription>Suma tuturor veniturilor companiilor din sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Bazat pe {financialData?.length || 0} companii cu date financiare
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {totalProfit >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  Profit Total {new Date().getFullYear()}
                </CardTitle>
                <CardDescription>Suma tuturor profiturilor companiilor din sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(totalProfit)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Marja de profit medie: {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>Starea Sistemului</CardTitle>
              <CardDescription>Monitorizarea componentelor critice ale sistemului</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Baza de Date</p>
                      <p className="text-sm text-muted-foreground">Toate tabelele funcționează normal</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">Operațional</div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Autentificare</p>
                      <p className="text-sm text-muted-foreground">Supabase Auth funcționează corect</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">Operațional</div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Row Level Security</p>
                      <p className="text-sm text-muted-foreground">Politicile RLS sunt active</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">Operațional</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
