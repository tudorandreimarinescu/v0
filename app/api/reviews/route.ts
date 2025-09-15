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

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, rating, title, body: reviewBody, reviewer_name, reviewer_email, user_id } = body

    // Validate required fields
    if (!product_id || !rating || !title || !reviewBody || !reviewer_name || !reviewer_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has already reviewed this product
    if (user_id) {
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", product_id)
        .eq("user_id", user_id)
        .single()

      if (existingReview) {
        return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
      }
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id,
        user_id: user_id || null,
        rating,
        title,
        body: reviewBody,
        reviewer_name,
        reviewer_email,
        status: "pending", // Reviews need approval
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Error in reviews POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
