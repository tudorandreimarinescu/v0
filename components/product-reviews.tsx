"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import ReviewForm from "@/components/review-form"
import ReviewsList from "@/components/reviews-list"
import ReviewStats from "@/components/review-stats"
import type { Review, ReviewStats as ReviewStatsType } from "@/lib/supabase/reviews-server"

interface ProductReviewsProps {
  productId: string
  productName: string
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStatsType | null>(null)
  const [canReview, setCanReview] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, statsRes, canReviewRes] = await Promise.all([
          fetch(`/api/reviews?productId=${productId}&limit=5`),
          fetch(`/api/reviews/stats?productId=${productId}`),
          fetch(`/api/reviews/can-review?productId=${productId}`),
        ])

        const [reviewsData, statsData, canReviewData] = await Promise.all([
          reviewsRes.json(),
          statsRes.json(),
          canReviewRes.json(),
        ])

        setReviews(reviewsData.reviews || [])
        setStats(statsData.stats)
        setCanReview(canReviewData.canReview)
      } catch (error) {
        console.error("Error fetching review data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  const handleReviewAdded = () => {
    // Refresh data after a review is added
    window.location.reload()
  }

  if (loading) {
    return <div>Loading reviews...</div>
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Customer Reviews
        </h2>
        {stats && stats.total_reviews > 0 && (
          <Badge variant="outline">
            {stats.total_reviews} review{stats.total_reviews !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {stats && stats.total_reviews > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Stats */}
          <div className="lg:col-span-1">
            <ReviewStats stats={stats} />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <ReviewsList reviews={reviews} productId={productId} />

            {/* Write Review Section */}
            {canReview && (
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewForm productId={productId} productName={productName} onReviewAdded={handleReviewAdded} />
                </CardContent>
              </Card>
            )}

            {!canReview && (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">You need to purchase this product to write a review.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to review {productName}</p>
            {canReview ? (
              <ReviewForm productId={productId} productName={productName} onReviewAdded={handleReviewAdded} />
            ) : (
              <p className="text-sm text-muted-foreground">Purchase this product to write the first review.</p>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}
