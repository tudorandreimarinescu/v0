import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ShaderBackground from "@/components/shader-background"
import HeroContent from "@/components/hero-content"
import TrustStrip from "@/components/trust-strip"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ShaderBackground />
      <SiteHeader />
      <HeroContent />
      <div className="absolute bottom-0 left-0 right-0">
        <TrustStrip />
      </div>
      <SiteFooter />
    </div>
  )
}
