import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Terms of Service - ShaderStore",
  description: "Read the terms and conditions for using ShaderStore products and services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
            Terms of <span className="font-medium italic instrument">Service</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Acceptance of Terms</h2>
                <p className="text-white/80 leading-relaxed">
                  By accessing and using ShaderStore, you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">License and Usage</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Upon purchase, you are granted a non-exclusive license to use our digital products subject to the
                  following conditions:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Products may be used for commercial and personal projects</li>
                  <li>You may not redistribute, resell, or share the original files</li>
                  <li>Attribution is appreciated but not required</li>
                  <li>Modifications are allowed for your own use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Age Restriction</h2>
                <p className="text-white/80 leading-relaxed">
                  Our services are intended for users who are 18 years of age or older. By using our services, you
                  represent that you are at least 18 years old.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Refunds and Returns</h2>
                <p className="text-white/80 leading-relaxed">
                  Due to the digital nature of our products, all sales are final. However, if you experience technical
                  issues or receive a defective product, please contact our support team within 30 days of purchase.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h2>
                <p className="text-white/80 leading-relaxed">
                  ShaderStore shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses.
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
