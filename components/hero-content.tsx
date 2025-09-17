"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export default function HeroContent() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
          <span className="text-accent text-sm font-medium">✨ New: Advanced Shader Technology</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          <span className="instrument italic text-accent">Beautiful</span> Digital
          <br />
          Experiences for{" "}
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Romanian Business
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
          Transform your company management with our advanced shader technology and comprehensive business tools. From
          stunning visual experiences to powerful analytics - everything you need in one platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3">
            <Link href="/auth/sign-up">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
            <Play className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-sm text-muted-foreground">
          <p className="mb-4">Trusted by 500+ Romanian companies</p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
