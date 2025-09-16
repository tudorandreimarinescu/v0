import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Ne pare rău, ceva nu a mers bine.</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                /* Updated error message to Romanian */
                <p className="text-sm text-muted-foreground">Cod eroare: {params.error}</p>
              ) : (
                /* Updated generic error message to Romanian */
                <p className="text-sm text-muted-foreground">A apărut o eroare nespecificată.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
