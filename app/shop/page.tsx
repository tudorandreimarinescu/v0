import type { Metadata } from "next"
import { Suspense } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ShopContent from "@/components/shop-content"
import ShopFilters from "@/components/shop-filters"
import { getProducts, getCategories } from "@/lib/supabase/products"

export const metadata: Metadata = {
  title: "Shop - Premium Shader Products",
  description: "Browse our collection of premium shader experiences, templates, and digital tools.",
}

interface ShopPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    material?: string
    page?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 12

  // Parse filters from search params
  const filters = {
    category: searchParams.category,
    search: searchParams.search,
    minPrice: searchParams.minPrice ? Number.parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number.parseFloat(searchParams.maxPrice) : undefined,
    brand: searchParams.brand,
    material: searchParams.material,
  }

  // Parse sorting
  const [sortField, sortDirection] = (searchParams.sort || "created_at-desc").split("-")
  const sort = {
    field: sortField as "created_at" | "base_price" | "name",
    direction: sortDirection as "asc" | "desc",
  }

  // Fetch data from database
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(filters, sort, page, limit),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            <span className="font-medium italic instrument">Premium</span> Shader Collection
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover our curated collection of premium shader experiences, templates, and digital tools
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-lg h-96" />}>
              <ShopFilters categories={categoriesResult.categories || []} currentFilters={filters} currentSort={sort} />
            </Suspense>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-lg h-96" />}>
              <ShopContent
                products={productsResult.products || []}
                total={productsResult.total || 0}
                currentPage={page}
                limit={limit}
                error={productsResult.error}
              />
            </Suspense>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
