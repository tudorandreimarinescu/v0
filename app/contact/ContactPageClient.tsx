"use client"

import type React from "react"

import { useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle, Clock, Loader2 } from "lucide-react"
import { FormErrorAnnouncer } from "@/components/accessibility/form-error-announcer"
import { useToast } from "@/hooks/use-toast"

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      })
      setErrors({})
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8 text-center">
            Get in <span className="font-medium italic instrument">Touch</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <FormErrorAnnouncer errors={errors} isSubmitting={isSubmitting} />
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white/80">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                        disabled={isSubmitting}
                        required
                      />
                      {errors.firstName && (
                        <p id="firstName-error" className="text-red-400 text-sm mt-1" role="alert">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white/80">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                        disabled={isSubmitting}
                        required
                      />
                      {errors.lastName && (
                        <p id="lastName-error" className="text-red-400 text-sm mt-1" role="alert">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white/80">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-white/10 border-white/20 text-white"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.email && (
                      <p id="email-error" className="text-red-400 text-sm mt-1" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-white/80">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      className="bg-white/10 border-white/20 text-white"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.subject && (
                      <p id="subject-error" className="text-red-400 text-sm mt-1" role="alert">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-white/80">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      rows={6}
                      className="bg-white/10 border-white/20 text-white resize-none"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error message-help" : "message-help"}
                      disabled={isSubmitting}
                      required
                    />
                    <p id="message-help" className="text-white/60 text-xs mt-1">
                      Please provide at least 10 characters
                    </p>
                    {errors.message && (
                      <p id="message-error" className="text-red-400 text-sm mt-1" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 focus:ring-2 focus:ring-purple-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="h-5 w-5 text-purple-400" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-white">Email Support</h3>
                  </div>
                  <p className="text-white/80 mb-2">
                    <a
                      href="mailto:support@kynky.ro"
                      className="hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                    >
                      support@kynky.ro
                    </a>
                  </p>
                  <p className="text-white/60 text-sm">
                    For technical support, billing questions, and general inquiries
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageCircle className="h-5 w-5 text-purple-400" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-white">Live Chat</h3>
                  </div>
                  <p className="text-white/80 mb-2">Available on our website</p>
                  <p className="text-white/60 text-sm">Get instant help from our support team during business hours</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-5 w-5 text-purple-400" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-white">Business Hours</h3>
                  </div>
                  <div className="space-y-1 text-white/80">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Support</h3>
                <p className="text-white/80 leading-relaxed">
                  For return requests or questions about our policy, please contact us at support@kynky.ro or use our
                  contact form.
                </p>
              </div>

              <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white/90 font-medium">How do I download my purchases?</h4>
                    <p className="text-white/60 text-sm">
                      Check your email for download links, or visit your account dashboard.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white/90 font-medium">Can I use products commercially?</h4>
                    <p className="text-white/60 text-sm">Yes, all our products include commercial usage rights.</p>
                  </div>
                  <div>
                    <h4 className="text-white/90 font-medium">Do you offer custom shader development?</h4>
                    <p className="text-white/60 text-sm">
                      Contact us to discuss custom project requirements and pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
