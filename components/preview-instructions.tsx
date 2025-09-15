"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Globe, DollarSign } from "lucide-react"
import { useState } from "react"

export function PreviewInstructions() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-4 z-50 max-w-md">
      <Card className="bg-black/95 border-white/20 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              🎯 Preview-Compatible i18n
              <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                Working
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 text-white/60 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <CardDescription className="text-white/60 text-xs">
            Full internationalization working in v0 preview environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <Globe className="h-3 w-3" />
              <span className="font-medium">Language Switching:</span>
            </div>
            <ul className="text-white/80 space-y-1 ml-5 text-xs">
              <li>• Click language switcher in header</li>
              <li>• Supports EN, RO, HU, DE</li>
              <li>• Uses URL params + localStorage</li>
              <li>• All text updates instantly</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium">Currency System:</span>
            </div>
            <ul className="text-white/80 space-y-1 ml-5 text-xs">
              <li>• Independent currency switcher</li>
              <li>• RON, EUR, HUF, GBP support</li>
              <li>• Cookie-based persistence</li>
              <li>• Works across all locales</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-white/10">
            <p className="text-white/60 text-xs">
              <strong>How it works:</strong> Uses custom i18n system instead of next-intl middleware for v0
              compatibility.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
