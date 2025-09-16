import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart/cart-context"
import AgeVerificationModal from "@/components/age-verification-modal"
import GDPRCookieBanner from "@/components/gdpr-cookie-banner"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
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
    default: "kynky.ro - Premium Digital Experiences",
    template: "%s | kynky.ro",
  },
  description:
    "Discover premium shader experiences and digital products. Create stunning visual effects with our advanced shader technology.",
  keywords: ["shaders", "digital art", "visual effects", "graphics", "e-commerce"],
  authors: [{ name: "kynky.ro" }],
  creator: "kynky.ro",
  publisher: "kynky.ro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kynky.ro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kynky.ro",
    title: "kynky.ro - Premium Digital Experiences",
    description:
      "Discover premium shader experiences and digital products. Create stunning visual effects with our advanced shader technology.",
    siteName: "kynky.ro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "kynky.ro - Premium Digital Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "kynky.ro - Premium Digital Experiences",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CartProvider>
            {children}
            <AgeVerificationModal />
            <GDPRCookieBanner />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
