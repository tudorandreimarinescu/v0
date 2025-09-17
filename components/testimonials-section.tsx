"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Maria Popescu",
    role: "CEO, TechStart Romania",
    avatar: "/professional-woman-diverse.png",
    content:
      "Kynky.ro transformed how we manage our company. The shader technology is incredible and the business tools are exactly what we needed.",
    rating: 5,
  },
  {
    name: "Alexandru Ionescu",
    role: "Creative Director, Digital Agency",
    avatar: "/professional-man.png",
    content:
      "The visual effects capabilities are outstanding. Our clients are amazed by what we can create with this platform.",
    rating: 5,
  },
  {
    name: "Elena Radu",
    role: "Operations Manager, Manufacturing Co.",
    avatar: "/confident-business-woman.png",
    content:
      "Finally, a platform that understands Romanian business needs. The analytics and reporting features are game-changing.",
    rating: 5,
  },
  {
    name: "Mihai Constantinescu",
    role: "Founder, E-commerce Startup",
    avatar: "/young-entrepreneur.jpg",
    content:
      "Started with the free plan and quickly upgraded to Pro. The ROI has been incredible for our growing business.",
    rating: 5,
  },
  {
    name: "Andreea Stoica",
    role: "Marketing Director, SaaS Company",
    avatar: "/marketing-professional.png",
    content:
      "The collaboration features have revolutionized how our team works together. Highly recommend for any growing company.",
    rating: 5,
  },
  {
    name: "Cristian Munteanu",
    role: "CTO, FinTech Startup",
    avatar: "/tech-executive.png",
    content: "Security and performance are top-notch. Perfect for companies that need enterprise-grade solutions.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by <span className="instrument italic text-accent">Romanian</span> Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join hundreds of companies that have transformed their operations with our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-card-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-card-foreground text-sm">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
