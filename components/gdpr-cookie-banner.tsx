"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Cookie, Settings } from "lucide-react"
import Link from "next/link"

const COOKIE_CONSENT_KEY = "kynky_cookie_consent"
const ANALYTICS_CONSENT_KEY = "kynky_analytics_consent"

interface CookieConsent {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

export default function GDPRCookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  })

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!existingConsent) {
      setIsVisible(true)
    } else {
      // Load existing consent and enable analytics if consented
      const parsed = JSON.parse(existingConsent) as CookieConsent
      setConsent(parsed)
      if (parsed.analytics) {
        enableAnalytics()
      }
    }
  }, [])

  const enableAnalytics = () => {
    // Enable Google Analytics or other analytics tools here
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "true")

    // Example: Enable Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }
  }

  const disableAnalytics = () => {
    localStorage.removeItem(ANALYTICS_CONSENT_KEY)

    // Example: Disable Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: "denied",
      })
    }
  }

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    }

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))
    setConsent(newConsent)
    enableAnalytics()
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    const newConsent = { ...consent, timestamp: Date.now() }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))

    if (newConsent.analytics) {
      enableAnalytics()
    } else {
      disableAnalytics()
    }

    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const newConsent: CookieConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    }

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))
    setConsent(newConsent)
    disableAnalytics()
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto max-w-6xl">
        <Card className="bg-white/5 border-white/20">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Cookie className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-white text-lg">Cookie-uri și Confidențialitate</CardTitle>
                  <CardDescription className="text-white/70">
                    Respectăm confidențialitatea dumneavoastră conform GDPR
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-white/80 text-sm leading-relaxed">
              Utilizăm cookie-uri pentru a îmbunătăți experiența dumneavoastră și pentru a analiza traficul site-ului.
              Puteți alege ce tipuri de cookie-uri să acceptați. Cookie-urile esențiale sunt necesare pentru
              funcționarea site-ului.
            </p>

            {showDetails && (
              <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Cookie-uri Esențiale</h4>
                      <p className="text-white/60 text-sm">
                        Necesare pentru funcționarea de bază a site-ului (autentificare, coș de cumpărături)
                      </p>
                    </div>
                    <Checkbox checked={true} disabled className="border-white/30" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Cookie-uri Analitice</h4>
                      <p className="text-white/60 text-sm">
                        Ne ajută să înțelegem cum utilizați site-ul pentru a-l îmbunătăți
                      </p>
                    </div>
                    <Checkbox
                      checked={consent.analytics}
                      onCheckedChange={(checked) => setConsent((prev) => ({ ...prev, analytics: !!checked }))}
                      className="border-white/30"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Cookie-uri Marketing</h4>
                      <p className="text-white/60 text-sm">
                        Pentru publicitate personalizată și urmărirea conversiilor
                      </p>
                    </div>
                    <Checkbox
                      checked={consent.marketing}
                      onCheckedChange={(checked) => setConsent((prev) => ({ ...prev, marketing: !!checked }))}
                      className="border-white/30"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAcceptAll}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Acceptă Toate
              </Button>

              <Button
                onClick={handleRejectAll}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Doar Esențiale
              </Button>

              {showDetails ? (
                <Button
                  onClick={handleAcceptSelected}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Salvează Selecția
                </Button>
              ) : (
                <Button onClick={() => setShowDetails(true)} variant="ghost" className="text-white/80 hover:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Personalizează
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-white/60 pt-2 border-t border-white/10">
              <Link href="/legal/privacy" className="hover:text-white underline">
                Politica de Confidențialitate
              </Link>
              <Link href="/legal/terms" className="hover:text-white underline">
                Termeni și Condiții
              </Link>
              <span>Conform GDPR - Aveți dreptul să vă modificați preferințele oricând</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
