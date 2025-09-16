import type { Metadata } from "next"
import { Suspense } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ShopContent from "@/components/shop-content"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "Shop - Premium Shader Products",
  description:
    "Browse our collection of premium shader experiences, templates, and digital tools with advanced filtering and search.",
}

export const dynamic = "force-dynamic"

function ShopSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar skeleton */}
        <div className="lg:w-64 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Products grid skeleton */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
        <SiteHeader />
        <main id="main-content">
          <Suspense fallback={<ShopSkeleton />}>
            <ShopContent />
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    </ErrorBoundary>
  )
}
