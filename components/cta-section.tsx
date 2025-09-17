"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-accent to-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            Ready to Transform Your <span className="instrument italic">Business?</span>
          </h2>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Join thousands of Romanian companies already using our platform to create stunning experiences and
            streamline their operations.
          </p>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-white/90">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-accent hover:bg-white/90 px-8 py-3 text-lg font-semibold"
            >
              <Link href="/auth/sign-up">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
              asChild
            >
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </div>

          {/* Trust Signal */}
          <p className="text-white/70 text-sm mt-8">
            Trusted by 500+ companies • GDPR compliant • Romanian data centers
          </p>
        </div>
      </div>
    </section>
  )
}
