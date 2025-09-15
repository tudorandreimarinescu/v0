"use client"

import SiteHeader from "@/components/site-header"
import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import TrustStrip from "@/components/trust-strip"
import SiteFooter from "@/components/site-footer"
import { I18nDemo } from "@/components/i18n-demo"
import { PreviewInstructions } from "@/components/preview-instructions"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <ShaderBackground>
        <SiteHeader />
        <HeroContent />
        <PulsingCircle />
      </ShaderBackground>
      <TrustStrip />
      <SiteFooter />
      <I18nDemo />
      <PreviewInstructions />
    </div>
  )
}
