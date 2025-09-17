"use client"

import SiteHeader from "@/components/site-header"
import HeroContent from "@/components/hero-content"
import FeaturesSection from "@/components/features-section"
import PricingSection from "@/components/pricing-section"
import TestimonialsSection from "@/components/testimonials-section"
import CTASection from "@/components/cta-section"
import SiteFooter from "@/components/site-footer"
import { ErrorBoundary } from "@/components/error-boundary"

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main>
          <HeroContent />
          <FeaturesSection />
          <PricingSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <SiteFooter />
      </div>
    </ErrorBoundary>
  )
}
