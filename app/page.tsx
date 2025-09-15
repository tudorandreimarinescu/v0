import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import HeroContent from "@/components/hero-content"
import TrustStrip from "@/components/trust-strip"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background with shader effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Header */}
      <SiteHeader />

      {/* Main content */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 relative">
          <HeroContent />
        </div>
        <TrustStrip />
      </div>

      {/* Footer */}
      <SiteFooter />

      {/* SVG Filters for glass effect */}
      <svg className="absolute inset-0 pointer-events-none" width="0" height="0">
        <defs>
          <filter id="glass-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            <feColorMatrix
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.8 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
