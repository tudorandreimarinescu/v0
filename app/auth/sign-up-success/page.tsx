import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Mulțumim pentru înregistrare!</CardTitle>
              <CardDescription>Verifică-ți emailul pentru confirmare</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Te-ai înregistrat cu succes. Te rugăm să verifici emailul pentru a confirma contul înainte de
                autentificare.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
