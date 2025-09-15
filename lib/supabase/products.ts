import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface Product {
  id: string
  slug: string
  status: string
  brand: string
  material: string
  default_currency: string
  image_url: string
  base_price: number
  specs: any
  category_id: string
  created_at: string
  updated_at: string
  category?: {
    name: string
    slug: string
  }
  translations?: {
    name: string
    short_desc: string
    long_desc: string
    locale: string
  }[]
  prices?: {
    currency: string
    amount_minor: number
  }[]
  variants?: {
    id: string
    sku: string
    attributes: any
    stock: number
    price_adjustment: number
    is_active: boolean
  }[]
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  brand?: string
  material?: string
  inStock?: boolean
}

export interface ProductSort {
  field: "created_at" | "base_price" | "name"
  direction: "asc" | "desc"
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

export async function getProducts(
  filters: ProductFilters = {},
  sort: ProductSort = { field: "created_at", direction: "desc" },
  page = 1,
  limit = 12,
) {
  const supabase = createClient()

  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug),
      translations:product_translations(name, short_desc, long_desc, locale),
      prices:product_prices(currency, amount_minor),
      variants:product_variants(id, sku, attributes, stock, price_adjustment, is_active)
    `)
    .eq("status", "active")

  // Apply filters
  if (filters.category) {
    query = query.eq("categories.slug", filters.category)
  }

  if (filters.minPrice) {
    query = query.gte("base_price", filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte("base_price", filters.maxPrice)
  }

  if (filters.brand) {
    query = query.eq("brand", filters.brand)
  }

  if (filters.material) {
    query = query.eq("material", filters.material)
  }

  if (filters.search) {
    // Search in product translations
    query = query.or(`
      translations.name.ilike.%${filters.search}%,
      translations.short_desc.ilike.%${filters.search}%,
      brand.ilike.%${filters.search}%
    `)
  }

  // Apply sorting
  if (sort.field === "name") {
    query = query.order("translations.name", { ascending: sort.direction === "asc" })
  } else {
    query = query.order(sort.field, { ascending: sort.direction === "asc" })
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return { products: [], total: 0, error: error.message }
  }

  return {
    products: data as Product[],
    total: count || 0,
    error: null,
  }
}

export async function getProductBySlug(slug: string, locale = "en") {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug),
      translations:product_translations(name, short_desc, long_desc, locale),
      prices:product_prices(currency, amount_minor),
      variants:product_variants(id, sku, attributes, stock, price_adjustment, is_active)
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return { product: null, error: error.message }
  }

  return { product: data as Product, error: null }
}

export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return { categories: [], error: error.message }
  }

  return { categories: data, error: null }
}

export async function getFxRates() {
  const supabase = createClient()

  const { data, error } = await supabase.from("fx_rates").select("*").order("effective_date", { ascending: false })

  if (error) {
    console.error("Error fetching fx rates:", error)
    return { rates: [], error: error.message }
  }

  return { rates: data, error: null }
}

export function formatPrice(amount: number, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function convertPrice(amount: number, fromCurrency: string, toCurrency: string, rates: any[]) {
  if (fromCurrency === toCurrency) return amount

  const rate = rates.find((r) => r.from_currency === fromCurrency && r.to_currency === toCurrency)

  return rate ? amount * Number.parseFloat(rate.rate) : amount
}
