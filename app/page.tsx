"use client"

import SiteHeader from "@/components/site-header"
import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import TrustStrip from "@/components/trust-strip"
import SiteFooter from "@/components/site-footer"
import { ErrorBoundary } from "@/components/error-boundary"

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <ShaderBackground>
          <SiteHeader />
          <main id="main-content">
            <HeroContent />
            <PulsingCircle />
          </main>
        </ShaderBackground>
        <TrustStrip />
        <SiteFooter />
      </div>
    </ErrorBoundary>
  )
}
