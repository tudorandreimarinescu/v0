import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("product_id")

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const supabase = createClient()

    // Get all approved reviews for the product
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId)
      .eq("status", "approved")

    if (error) {
      console.error("Error fetching review stats:", error)
      return NextResponse.json({ error: "Failed to fetch review stats" }, { status: 500 })
    }

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({
        stats: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      })
    }

    // Calculate statistics
    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++
    })

    return NextResponse.json({
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        ratingDistribution,
      },
    })
  } catch (error) {
    console.error("Error in review stats API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
