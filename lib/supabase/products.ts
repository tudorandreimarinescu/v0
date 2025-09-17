// Mock products functionality
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

export async function getProducts(filters: ProductFilters = {}, locale = "en", currency = "USD"): Promise<Product[]> {
  console.log("[v0] Mock getProducts called with filters:", filters)
  return []
}

export async function getProductBySlug(slug: string, locale = "en", currency = "USD"): Promise<ProductDetail | null> {
  console.log("[v0] Mock getProductBySlug called for slug:", slug)
  return null
}

export async function getCategories(): Promise<Category[]> {
  console.log("[v0] Mock getCategories called")
  return []
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
  locale = "en",
  currency = "USD",
): Promise<Product[]> {
  console.log("[v0] Mock getRelatedProducts called")
  return []
}
