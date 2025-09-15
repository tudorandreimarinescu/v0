import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { getProductReviews, getReviewStats, canUserReviewProduct } from "@/lib/supabase/reviews"
import ReviewForm from "@/components/review-form"
import ReviewsList from "@/components/reviews-list"
import ReviewStats from "@/components/review-stats"

interface ProductReviewsProps {
  productId: string
  productName: string
}

export default async function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, stats, canReview] = await Promise.all([
    getProductReviews(productId, { limit: 5 }),
    getReviewStats(productId),
    canUserReviewProduct(productId),
  ])

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
            <Suspense fallback={<div>Loading reviews...</div>}>
              <ReviewsList reviews={reviews} productId={productId} />
            </Suspense>

            {/* Write Review Section */}
            {canReview && (
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewForm productId={productId} productName={productName} />
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
              <ReviewForm productId={productId} productName={productName} />
            ) : (
              <p className="text-sm text-muted-foreground">Purchase this product to write the first review.</p>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}
