import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "ShaderStore - Premium Digital Experiences",
    template: "%s | ShaderStore",
  },
  description:
    "Discover premium shader experiences and digital products. Create stunning visual effects with our advanced shader technology.",
  keywords: ["shaders", "digital art", "visual effects", "graphics", "e-commerce"],
  authors: [{ name: "ShaderStore" }],
  creator: "ShaderStore",
  publisher: "ShaderStore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://shaderstore.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shaderstore.com",
    title: "ShaderStore - Premium Digital Experiences",
    description:
      "Discover premium shader experiences and digital products. Create stunning visual effects with our advanced shader technology.",
    siteName: "ShaderStore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShaderStore - Premium Digital Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShaderStore - Premium Digital Experiences",
    description: "Discover premium shader experiences and digital products.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
