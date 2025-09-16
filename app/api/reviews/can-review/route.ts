import { type NextRequest, NextResponse } from "next/server"
import { canUserReviewProduct } from "@/lib/supabase/reviews-server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const canReview = await canUserReviewProduct(productId)
    return NextResponse.json({ canReview })
  } catch (error) {
    console.error("Error checking review eligibility:", error)
    return NextResponse.json({ error: "Failed to check review eligibility" }, { status: 500 })
  }
}
