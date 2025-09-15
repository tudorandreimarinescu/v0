"use client"

import { useI18n } from "@/hooks/use-i18n-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { localeNames, localeFlags } from "@/lib/i18n-preview"

export function I18nDemo() {
  const { locale, t } = useI18n()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-black/90 border-white/20 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            🌐 i18n Preview Demo
            <Badge variant="secondary" className="text-xs">
              {localeFlags[locale]} {localeNames[locale]}
            </Badge>
          </CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Language switching works in preview! Try the language switcher in the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 text-white/80">
            <div>
              <span className="text-white/60">Current:</span> {t("nav.shop")}
            </div>
            <div>
              <span className="text-white/60">Hero:</span> {t("hero.cta")}
            </div>
            <div>
              <span className="text-white/60">Trust:</span> {t("trust.shipping")}
            </div>
            <div>
              <span className="text-white/60">Footer:</span> {t("footer.company")}
            </div>
          </div>
          <div className="text-white/60 text-xs pt-2 border-t border-white/10">
            URL: ?lang={locale} | Storage: localStorage
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
