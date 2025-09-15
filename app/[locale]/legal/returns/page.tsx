import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Returns Policy - ShaderStore",
  description: "Learn about our returns and refund policy for digital products.",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
            Returns <span className="font-medium italic instrument">Policy</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Digital Product Returns</h2>
                <p className="text-white/80 leading-relaxed">
                  Due to the instant delivery and digital nature of our products, we generally do not offer refunds once
                  a download has been completed. However, we understand that exceptional circumstances may arise.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Eligible Return Reasons</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  We may consider refunds in the following situations:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Technical issues preventing product download or use</li>
                  <li>Product significantly different from description</li>
                  <li>Duplicate purchases made in error</li>
                  <li>Product files are corrupted or incomplete</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Return Process</h2>
                <p className="text-white/80 leading-relaxed mb-4">To request a return, please follow these steps:</p>
                <ol className="list-decimal list-inside text-white/80 space-y-2">
                  <li>Contact our support team within 30 days of purchase</li>
                  <li>Provide your order number and reason for return</li>
                  <li>Include any relevant screenshots or error messages</li>
                  <li>Allow 3-5 business days for review and response</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Refund Processing</h2>
                <p className="text-white/80 leading-relaxed">
                  Approved refunds will be processed back to the original payment method within 5-10 business days. You
                  will receive an email confirmation once the refund has been initiated.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Contact Support</h2>
                <p className="text-white/80 leading-relaxed">
                  For return requests or questions about our policy, please contact us at support@shaderstore.com or use
                  our contact form.
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
