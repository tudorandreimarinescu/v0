import { getProducts, getCategories } from "@/lib/supabase/products"
import ShopFilters from "@/components/shop-filters"
import ProductGrid from "@/components/product-grid"
import type { SearchParams } from "@/lib/types"

interface ShopContentProps {
  searchParams?: SearchParams
}

export default async function ShopContent({ searchParams }: ShopContentProps) {
  // Parse search parameters for filtering
  const categoryId = searchParams?.category as string | undefined
  const minPrice = searchParams?.min_price ? Number(searchParams.min_price) : undefined
  const maxPrice = searchParams?.max_price ? Number(searchParams.max_price) : undefined
  const searchTerm = searchParams?.search as string | undefined
  const sortBy = (searchParams?.sort as "price" | "name" | "rating" | "created_at") || "created_at"
  const sortOrder = (searchParams?.order as "ASC" | "DESC") || "DESC"
  const page = searchParams?.page ? Number(searchParams.page) : 1
  const limit = 12
  const offset = (page - 1) * limit

  // Fetch data
  const [products, categories] = await Promise.all([
    getProducts({
      categoryId,
      minPrice,
      maxPrice,
      searchTerm,
      sortBy,
      sortOrder,
      limit,
      offset,
    }),
    getCategories(),
  ])

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
          <span className="font-medium italic instrument">Premium</span> Shader Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our curated collection of premium shader experiences, templates, and digital tools
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <ShopFilters
            categories={categories}
            currentFilters={{
              categoryId,
              minPrice,
              maxPrice,
              searchTerm,
              sortBy,
              sortOrder,
            }}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid
            products={products}
            currentPage={page}
            hasMore={products.length === limit}
            totalResults={products.length}
          />
        </div>
      </div>
    </main>
  )
}
