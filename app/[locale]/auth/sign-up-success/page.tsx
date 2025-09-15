import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18nPreview } from "@/hooks/use-i18n-preview"

export default function SignUpSuccessPage() {
  const { t } = useI18nPreview()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("auth.thankYou")}</CardTitle>
              <CardDescription>{t("auth.checkEmailConfirm")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("auth.confirmEmailDescription")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
