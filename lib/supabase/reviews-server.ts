// Mock reviews server functionality
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

export async function getProductReviews(
  productId: string,
  options: {
    limit?: number
    offset?: number
    sortBy?: "created_at" | "rating"
    sortOrder?: "ASC" | "DESC"
  } = {},
): Promise<Review[]> {
  console.log("[v0] Mock getProductReviews called")
  return []
}

export async function getReviewStats(productId: string): Promise<ReviewStats | null> {
  console.log("[v0] Mock getReviewStats called")
  return {
    total_reviews: 0,
    average_rating: 0,
    rating_distribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
  }
}

export async function canUserReviewProduct(productId: string): Promise<boolean> {
  console.log("[v0] Mock canUserReviewProduct called")
  return false
}
