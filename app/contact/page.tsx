import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - ShaderStore",
  description: "Get in touch with our team for support, questions, or feedback.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white/80">
                      First Name
                    </Label>
                    <Input id="firstName" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white/80">
                      Last Name
                    </Label>
                    <Input id="lastName" className="bg-white/10 border-white/20 text-white" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input id="email" type="email" className="bg-white/10 border-white/20 text-white" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-white/80">
                    Subject
                  </Label>
                  <Input id="subject" className="bg-white/10 border-white/20 text-white" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-white/80">
                    Message
                  </Label>
                  <Textarea id="message" rows={6} className="bg-white/10 border-white/20 text-white resize-none" />
                </div>
                <Button className="w-full bg-white text-black hover:bg-white/90">Send Message</Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Email Support</h3>
                  </div>
                  <p className="text-white/80 mb-2">support@shaderstore.com</p>
                  <p className="text-white/60 text-sm">
                    For technical support, billing questions, and general inquiries
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageCircle className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Live Chat</h3>
                  </div>
                  <p className="text-white/80 mb-2">Available on our website</p>
                  <p className="text-white/60 text-sm">Get instant help from our support team during business hours</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-5 w-5 text-purple-400" />
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
