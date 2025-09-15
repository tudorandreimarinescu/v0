"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Code } from "lucide-react"
import { useEffect, useState } from "react"

export function ShaderHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated shader background */}
      <div className="absolute inset-0 shader-bg" />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/90" />

      {/* Additional animated overlay */}
      <div className="absolute inset-0 shader-overlay shader-pulse" />

      {/* Floating elements */}
      <div className="absolute top-20 left-20 text-primary/20 float-animation">
        <Sparkles size={32} />
      </div>
      <div className="absolute top-40 right-32 text-accent/20 float-animation" style={{ animationDelay: "2s" }}>
        <Zap size={28} />
      </div>
      <div className="absolute bottom-32 left-32 text-primary/20 float-animation" style={{ animationDelay: "4s" }}>
        <Code size={24} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Premium Shader
            </span>
            <br />
            Experiences
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create stunning visual effects with our advanced shader technology. Transform your digital projects with
            cutting-edge graphics.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Sparkles size={16} className="text-primary" />
              Real-time Effects
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Zap size={16} className="text-accent" />
              GPU Accelerated
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Code size={16} className="text-primary" />
              Easy Integration
            </div>
          </div>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-secondary text-primary-foreground px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Shaders
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg font-semibold transition-all duration-300 bg-transparent"
            >
              View Documentation
            </Button>
          </div>

          {/* Stats or social proof */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Premium Shaders</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">10k+</div>
              <div className="text-sm text-muted-foreground">Happy Developers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
