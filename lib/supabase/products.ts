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

function createServiceClient() {
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // No-op for service role
      },
    },
  })
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
  const supabase = createServiceClient()

  let query = supabase
    .from("products")
    .select(`
      id,
      slug,
      brand,
      material,
      status,
      image_url,
      base_price,
      default_currency,
      category_id,
      specs,
      created_at,
      categories!inner(
        name
      ),
      product_translations!left(
        name,
        short_desc,
        long_desc
      )
    `)
    .eq("status", "active")
    .eq("product_translations.locale", locale)

  // Apply filters
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId)
  }
  if (filters.minPrice) {
    query = query.gte("base_price", filters.minPrice)
  }
  if (filters.maxPrice) {
    query = query.lte("base_price", filters.maxPrice)
  }
  if (filters.searchTerm) {
    query = query.or(
      `product_translations.name.ilike.%${filters.searchTerm}%,product_translations.short_desc.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%`,
    )
  }

  // Apply sorting
  const sortBy = filters.sortBy || "created_at"
  const sortOrder = filters.sortOrder === "ASC" ? { ascending: true } : { ascending: false }

  if (sortBy === "price") {
    query = query.order("base_price", sortOrder)
  } else if (sortBy === "name") {
    query = query.order("product_translations.name", sortOrder)
  } else {
    query = query.order("created_at", sortOrder)
  }

  // Apply pagination
  const limit = filters.limit || 20
  const offset = filters.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return (data || []).map((item) => ({
    id: item.id,
    slug: item.slug,
    brand: item.brand,
    material: item.material,
    status: item.status,
    image_url: item.image_url,
    base_price: item.base_price,
    localized_price: item.base_price, // TODO: Apply currency conversion
    currency: currency,
    category_id: item.category_id,
    category_name: item.categories?.name || "",
    name: item.product_translations?.[0]?.name || "Untitled Product",
    short_desc: item.product_translations?.[0]?.short_desc || "",
    long_desc: item.product_translations?.[0]?.long_desc || "",
    specs: item.specs || {},
    stock: 0, // TODO: Calculate from variants
    avg_rating: 0, // TODO: Calculate from reviews
    review_count: 0, // TODO: Calculate from reviews
    created_at: item.created_at,
  }))
}

export async function getProductBySlug(slug: string, locale = "en", currency = "USD"): Promise<ProductDetail | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      brand,
      material,
      status,
      image_url,
      base_price,
      default_currency,
      category_id,
      specs,
      created_at,
      categories!inner(
        name
      ),
      product_translations!left(
        name,
        short_desc,
        long_desc
      ),
      product_variants!left(
        id,
        sku,
        attributes,
        stock,
        price_adjustment,
        is_active
      )
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .eq("product_translations.locale", locale)
    .eq("product_variants.is_active", true)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  if (!data) return null

  return {
    id: data.id,
    slug: data.slug,
    brand: data.brand,
    material: data.material,
    status: data.status,
    image_url: data.image_url,
    base_price: data.base_price,
    localized_price: data.base_price, // TODO: Apply currency conversion
    currency: currency,
    category_id: data.category_id,
    category_name: data.categories?.name || "",
    name: data.product_translations?.[0]?.name || "Untitled Product",
    short_desc: data.product_translations?.[0]?.short_desc || "",
    long_desc: data.product_translations?.[0]?.long_desc || "",
    specs: data.specs || {},
    stock: (data.product_variants || []).reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0),
    avg_rating: 0, // TODO: Calculate from reviews
    review_count: 0, // TODO: Calculate from reviews
    created_at: data.created_at,
    variants: (data.product_variants || []).map((variant: any) => ({
      id: variant.id,
      sku: variant.sku,
      attributes: variant.attributes || {},
      stock: variant.stock || 0,
      price_adjustment: variant.price_adjustment || 0,
      is_active: variant.is_active,
    })),
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      parent_id,
      sort_order,
      is_active
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  const categoriesWithCounts = (data || []).map((category) => ({
    ...category,
    product_count: 0, // Will be populated when products are loaded
  }))

  return categoriesWithCounts
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
  locale = "en",
  currency = "USD",
): Promise<Product[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      brand,
      material,
      status,
      image_url,
      base_price,
      default_currency,
      category_id,
      specs,
      created_at,
      categories!inner(
        name
      ),
      product_translations!left(
        name,
        short_desc,
        long_desc
      )
    `)
    .eq("status", "active")
    .eq("category_id", categoryId)
    .eq("product_translations.locale", locale)
    .neq("id", productId) // Exclude current product
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching related products:", error)
    return []
  }

  return (data || []).map((item) => ({
    id: item.id,
    slug: item.slug,
    brand: item.brand,
    material: item.material,
    status: item.status,
    image_url: item.image_url,
    base_price: item.base_price,
    localized_price: item.base_price, // TODO: Apply currency conversion
    currency: currency,
    category_id: item.category_id,
    category_name: item.categories?.name || "",
    name: item.product_translations?.[0]?.name || "Untitled Product",
    short_desc: item.product_translations?.[0]?.short_desc || "",
    long_desc: item.product_translations?.[0]?.long_desc || "",
    specs: item.specs || {},
    stock: 0, // TODO: Calculate from variants
    avg_rating: 0, // TODO: Calculate from reviews
    review_count: 0, // TODO: Calculate from reviews
    created_at: item.created_at,
  }))
}
