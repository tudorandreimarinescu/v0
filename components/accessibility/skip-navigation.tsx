"use client"

import { Button } from "@/components/ui/button"

export function SkipNavigation() {
  return (
    <Button
      asChild
      variant="outline"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-background border-2"
    >
      <a href="#main-content">Skip to main content</a>
    </Button>
  )
}
