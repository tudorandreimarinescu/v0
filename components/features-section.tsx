"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, BarChart3, Shield, Zap, Users, Globe, Database, Smartphone, Cloud } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Advanced Shader Editor",
    description:
      "Create stunning visual effects with our intuitive shader editor. Real-time preview and advanced debugging tools.",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Comprehensive analytics dashboard to track your company performance and make data-driven decisions.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption, SSO integration, and compliance with Romanian data protection laws.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with edge computing and CDN delivery for instant loading across Romania.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time collaboration tools, comments, and version control.",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Full support for Romanian and English interfaces with localized business features.",
  },
  {
    icon: Database,
    title: "Smart Data Management",
    description: "Automated data organization with intelligent categorization and powerful search capabilities.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Native mobile experience with offline capabilities and push notifications.",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Reliable cloud hosting with 99.9% uptime guarantee and automatic backups.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to <span className="instrument italic text-accent">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful features designed specifically for Romanian businesses, from startups to enterprises.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
