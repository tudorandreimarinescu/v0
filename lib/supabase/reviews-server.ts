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
