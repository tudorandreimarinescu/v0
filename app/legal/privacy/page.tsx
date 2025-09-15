import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Privacy Policy - ShaderStore",
  description: "Learn how ShaderStore collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
            Privacy <span className="font-medium italic instrument">Policy</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
                <p className="text-white/80 leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, make a
                  purchase, or contact us for support. This may include your name, email address, billing information,
                  and communication preferences.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
                <p className="text-white/80 leading-relaxed mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Process transactions and deliver products</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send important updates about your account or purchases</li>
                  <li>Improve our products and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Information Sharing</h2>
                <p className="text-white/80 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except as described in this policy. We may share information with trusted service providers
                  who assist us in operating our website and conducting business.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Data Security</h2>
                <p className="text-white/80 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                  is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
                <p className="text-white/80 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@shaderstore.com or
                  through our contact page.
                </p>
              </section>

              <p className="text-white/60 text-sm">Last updated: December 2024</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
