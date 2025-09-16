import type React from "react"
import type { Metadata } from "next"
import { Figtree } from 'next/font/google'
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart/cart-context"
import AgeVerificationModal from "@/components/age-verification-modal"
import GDPRCookieBanner from "@/components/gdpr-cookie-banner"
import { ErrorBoundary } from "@/components/error-boundary"
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

// <CHANGE> Enhanced SEO metadata with structured data and locale support
export const metadata: Metadata = {
  title: {
    default: "kynky.ro - Premium Digital Experiences",
    template: "%s | kynky.ro",
  },
  description:
    "Discover premium shader experiences and digital products. Create stunning visual effects with our advanced shader technology.",
  keywords: [
    "shaders", 
    "digital art", 
    "visual effects", 
    "graphics", 
    "e-commerce",
    "WebGL",
    "GLSL",
    "creative coding",
    "digital products"
  ],
  authors: [{ name: "kynky.ro", url: "https://kynky.ro" }],
  creator: "kynky.ro",
  publisher: "kynky.ro",
  category: "Technology",
  classification: "Digital Products",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kynky.ro"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en-US',
      'ro-RO': '/ro-RO',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ro_RO"],
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
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: "kynky.ro - Premium Digital Experiences",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kynkyro",
    creator: "@kynkyro",
    title: "kynky.ro - Premium Digital Experiences",
    description: "Discover premium shader experiences and digital products.",
    images: [
      {
        url: "/og-image.jpg",
        alt: "kynky.ro - Premium Digital Experiences",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#8b5cf6",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "kynky.ro",
  },
  applicationName: "kynky.ro",
  referrer: "origin-when-cross-origin",
  appLinks: {
    web: {
      url: "https://kynky.ro",
      should_fallback: true,
    },
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
        {/* <CHANGE> Added structured data and additional SEO meta tags */}
        <link rel="canonical" href="https://kynky.ro" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "kynky.ro",
              "url": "https://kynky.ro",
              "logo": "https://kynky.ro/logo.png",
              "description": "Premium digital experiences and shader technology",
              "sameAs": [
                "https://twitter.com/kynkyro",
                "https://github.com/kynkyro"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-0123",
                "contactType": "customer service",
                "email": "support@kynky.ro"
              }
            })
          }}
        />
        
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
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <CartProvider>
              {children}
              <AgeVerificationModal />
              <GDPRCookieBanner />
            </CartProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
