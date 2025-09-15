import type React from "react"
import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
      </head>
      <body className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
