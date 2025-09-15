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

export interface CreateReviewData {
  product_id: string
  title: string
  body: string
  rating: number
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
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_product_reviews", {
    p_product_id: productId,
    p_limit: options.limit || 10,
    p_offset: options.offset || 0,
    p_sort_by: options.sortBy || "created_at",
    p_sort_order: options.sortOrder || "DESC",
  })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

export async function getReviewStats(productId: string): Promise<ReviewStats | null> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_review_stats", {
    p_product_id: productId,
  })

  if (error) {
    console.error("Error fetching review stats:", error)
    return null
  }

  return data?.[0] || null
}

export async function createReview(reviewData: CreateReviewData): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentication required" }
  }

  const { data, error } = await supabase.rpc("create_review", {
    p_product_id: reviewData.product_id,
    p_user_id: user.id,
    p_title: reviewData.title,
    p_body: reviewData.body,
    p_rating: reviewData.rating,
  })

  if (error) {
    console.error("Error creating review:", error)
    return { success: false, message: "Failed to create review" }
  }

  const result = data?.[0]
  return {
    success: result?.success || false,
    message: result?.message || "Unknown error occurred",
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

  const { data, error } = await supabase.rpc("can_user_review_product", {
    p_user_id: user.id,
    p_product_id: productId,
  })

  if (error) {
    console.error("Error checking review eligibility:", error)
    return false
  }

  return data || false
}

export async function moderateReview(
  reviewId: string,
  status: "approved" | "rejected" | "pending",
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentication required" }
  }

  const { data, error } = await supabase.rpc("moderate_review", {
    p_review_id: reviewId,
    p_status: status,
    p_moderator_id: user.id,
  })

  if (error) {
    console.error("Error moderating review:", error)
    return { success: false, message: "Failed to moderate review" }
  }

  const result = data?.[0]
  return {
    success: result?.success || false,
    message: result?.message || "Unknown error occurred",
  }
}
