"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Layers } from "lucide-react"
import { useEffect, useRef } from "react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Shader-like animation
    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01

      // Clear canvas
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Create gradient that shifts over time
      const gradient = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Animated colors
      const hue1 = (time * 50) % 360
      const hue2 = (time * 30 + 120) % 360
      const hue3 = (time * 40 + 240) % 360

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, 0.1)`)
      gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 60%, 0.15)`)
      gradient.addColorStop(1, `hsla(${hue3}, 70%, 60%, 0.1)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Add floating particles
      for (let i = 0; i < 20; i++) {
        const x = Math.sin(time + i) * 100 + canvas.offsetWidth / 2
        const y = Math.cos(time * 0.8 + i) * 80 + canvas.offsetHeight / 2
        const size = Math.sin(time + i) * 2 + 3

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${(time * 100 + i * 30) % 360}, 70%, 70%, 0.3)`
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-accent/20 rounded-full shader-animation" />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 border border-secondary/20 rotate-45 shader-animation"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/10 rounded-lg shader-animation"
          style={{ animationDelay: "10s" }}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-1/4 right-1/4 w-6 h-6 text-accent/30 float-animation" />
        <Zap className="absolute bottom-1/3 left-1/4 w-8 h-8 text-secondary/30 float-animation float-delay-1" />
        <Layers className="absolute top-1/3 left-1/3 w-5 h-5 text-primary/30 float-animation float-delay-2" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {"Premium Shader Technology"}
          </div>

          {/* Main Headline */}
          <h1 className="heading text-5xl md:text-7xl font-bold text-primary leading-tight text-balance">
            {"Create Stunning "}
            <span className="relative">
              <span className="bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent gradient-animation">
                {"Visual Effects"}
              </span>
            </span>
            {" with Advanced Shaders"}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            {
              "Transform your digital experiences with our premium collection of GPU-accelerated shaders and visual effects. Perfect for games, apps, and creative projects."
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {"Explore Shaders"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary/20 hover:border-primary/40 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 hover:bg-primary/5 bg-transparent"
            >
              {"View Gallery"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary heading">{"500+"}</div>
              <div className="text-sm text-muted-foreground">{"Premium Shaders"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary heading">{"50k+"}</div>
              <div className="text-sm text-muted-foreground">{"Developers"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary heading">{"99.9%"}</div>
              <div className="text-sm text-muted-foreground">{"Uptime"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
