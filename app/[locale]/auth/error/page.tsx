import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18nPreview } from "@/hooks/use-i18n-preview"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams
  const { t } = useI18nPreview()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("auth.errorTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  {t("auth.errorCode")}: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">{t("auth.errorGeneric")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
