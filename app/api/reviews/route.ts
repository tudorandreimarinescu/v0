import { type NextRequest, NextResponse } from "next/server"
import { getProductReviews } from "@/lib/supabase/reviews-server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = Number.parseInt(searchParams.get("offset") || "0")
  const sortBy = (searchParams.get("sortBy") as "created_at" | "rating") || "created_at"
  const sortOrder = (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC"

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const reviews = await getProductReviews(productId, {
      limit,
      offset,
      sortBy,
      sortOrder,
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
