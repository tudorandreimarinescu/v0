import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface FinancialSummaryProps {
  userId: string
}

export async function FinancialSummary({ userId }: FinancialSummaryProps) {
  const supabase = await createClient()

  // Get financial data for user's companies
  const { data: financialData, error } = await supabase
    .from("company_financial_data")
    .select(`
      revenue,
      profit,
      year,
      companies!inner(created_by)
    `)
    .eq("companies.created_by", userId)
    .eq("year", new Date().getFullYear())

  if (error) {
    console.error("Error fetching financial data:", error)
  }

  const data = financialData || []
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const totalProfit = data.reduce((sum, item) => sum + (item.profit || 0), 0)
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Sumar Financiar {new Date().getFullYear()}
        </CardTitle>
        <CardDescription>Performanța financiară agregată</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cifra de Afaceri</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatCurrency(totalRevenue)}</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Profit Net</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatCurrency(totalProfit)}</span>
              {totalProfit >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Marja de Profit</span>
            <span className="font-medium">{profitMargin.toFixed(1)}%</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Bazat pe {data.length} {data.length === 1 ? "companie" : "companii"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
