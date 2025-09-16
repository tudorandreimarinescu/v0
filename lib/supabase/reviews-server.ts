import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface Review {
  id: string
  user_id: string
  reviewer_name: string
  reviewer_email: string
  title: string
  body: string
  rating: number
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    "5": number
    "4": number
    "3": number
    "2": number
    "1": number
  }
}

function createServiceClient() {
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {},
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

export async function getProductReviews(
  productId: string,
  options: {
    limit?: number
    offset?: number
    sortBy?: "created_at" | "rating"
    sortOrder?: "ASC" | "DESC"
  } = {},
): Promise<Review[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      user_id,
      reviewer_name,
      reviewer_email,
      title,
      body,
      rating,
      status,
      created_at,
      updated_at
    `)
    .eq("product_id", productId)
    .eq("status", "approved")
    .order(options.sortBy || "created_at", { ascending: options.sortOrder === "ASC" })
    .range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1)

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

export async function getReviewStats(productId: string): Promise<ReviewStats | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("status", "approved")

  if (error) {
    console.error("Error fetching review stats:", error)
    return null
  }

  if (!data || data.length === 0) {
    return {
      total_reviews: 0,
      average_rating: 0,
      rating_distribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
    }
  }

  const total_reviews = data.length
  const average_rating = data.reduce((sum, review) => sum + review.rating, 0) / total_reviews
  const rating_distribution = data.reduce(
    (acc, review) => {
      acc[review.rating.toString() as keyof typeof acc]++
      return acc
    },
    { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
  )

  return {
    total_reviews,
    average_rating: Math.round(average_rating * 10) / 10,
    rating_distribution,
  }
}

export async function canUserReviewProduct(productId: string): Promise<boolean> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const serviceClient = createServiceClient()

  // Check if user has purchased the product
  const { data: orderData, error: orderError } = await serviceClient
    .from("order_items")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .limit(1)

  if (orderError) {
    console.error("Error checking purchase history:", orderError)
    return false
  }

  // If no purchase found, user cannot review
  if (!orderData || orderData.length === 0) {
    return false
  }

  // Check if user has already reviewed this product
  const { data: reviewData, error: reviewError } = await serviceClient
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .limit(1)

  if (reviewError) {
    console.error("Error checking existing reviews:", reviewError)
    return false
  }

  // User can review if they haven't already reviewed
  return !reviewData || reviewData.length === 0
}
