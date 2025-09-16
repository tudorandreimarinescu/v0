import { createBrowserClient } from "@supabase/ssr"

export interface CreateReviewData {
  product_id: string
  title: string
  body: string
  rating: number
}

function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
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
