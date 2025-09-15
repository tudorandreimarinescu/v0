import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface Product {
  id: string
  slug: string
  brand: string
  material: string
  status: string
  image_url: string
  base_price: number
  localized_price: number
  currency: string
  category_id: string
  category_name: string
  name: string
  short_desc: string
  long_desc: string
  specs: Record<string, any>
  stock: number
  avg_rating: number
  review_count: number
  created_at: string
}

export interface ProductDetail extends Product {
  variants: Array<{
    id: string
    sku: string
    attributes: Record<string, any>
    stock: number
    price_adjustment: number
    is_active: boolean
  }>
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  parent_id: string | null
  sort_order: number
  product_count: number
  is_active: boolean
}

export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  searchTerm?: string
  sortBy?: "price" | "name" | "rating" | "created_at"
  sortOrder?: "ASC" | "DESC"
  limit?: number
  offset?: number
}

function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function getProducts(filters: ProductFilters = {}, locale = "en", currency = "USD"): Promise<Product[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_products_with_details", {
    p_locale: locale,
    p_currency: currency,
    p_category_id: filters.categoryId || null,
    p_min_price: filters.minPrice || null,
    p_max_price: filters.maxPrice || null,
    p_search_term: filters.searchTerm || null,
    p_sort_by: filters.sortBy || "created_at",
    p_sort_order: filters.sortOrder || "DESC",
    p_limit: filters.limit || 20,
    p_offset: filters.offset || 0,
  })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductBySlug(slug: string, locale = "en", currency = "USD"): Promise<ProductDetail | null> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_product_by_slug", {
    p_slug: slug,
    p_locale: locale,
    p_currency: currency,
  })

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data?.[0] || null
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_categories_with_counts")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
  locale = "en",
  currency = "USD",
): Promise<Product[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_products_with_details", {
    p_locale: locale,
    p_currency: currency,
    p_category_id: categoryId,
    p_limit: limit + 1, // Get one extra to exclude current product
  })

  if (error) {
    console.error("Error fetching related products:", error)
    return []
  }

  // Filter out the current product and limit results
  return (data || []).filter((product: Product) => product.id !== productId).slice(0, limit)
}
