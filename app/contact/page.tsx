import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us - kynky.ro",
  description: "Get in touch with our team for support, questions, or feedback.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
