"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, Flag, ChevronDown, ChevronUp } from "lucide-react"
import type { Review } from "@/lib/supabase/reviews"
import { getProductReviews } from "@/lib/supabase/reviews"

interface ReviewsListProps {
  reviews: Review[]
  productId: string
}

export default function ReviewsList({ reviews: initialReviews, productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialReviews.length === 5)
  const [sortBy, setSortBy] = useState<"created_at" | "rating">("created_at")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")

  const loadMoreReviews = async () => {
    setIsLoading(true)
    try {
      const newReviews = await getProductReviews(productId, {
        limit: 5,
        offset: reviews.length,
        sortBy,
        sortOrder,
      })

      if (newReviews.length < 5) {
        setHasMore(false)
      }

      setReviews((prev) => [...prev, ...newReviews])
    } catch (error) {
      console.error("Error loading more reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSortChange = async (newSortBy: "created_at" | "rating", newSortOrder: "ASC" | "DESC") => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setIsLoading(true)

    try {
      const sortedReviews = await getProductReviews(productId, {
        limit: reviews.length,
        offset: 0,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      })
      setReviews(sortedReviews)
    } catch (error) {
      console.error("Error sorting reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sort by:</span>
        <Button
          variant={sortBy === "created_at" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("created_at", "DESC")}
        >
          Most Recent
        </Button>
        <Button
          variant={sortBy === "rating" && sortOrder === "DESC" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("rating", "DESC")}
        >
          Highest Rated
        </Button>
        <Button
          variant={sortBy === "rating" && sortOrder === "ASC" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("rating", "ASC")}
        >
          Lowest Rated
        </Button>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMoreReviews} disabled={isLoading} className="bg-transparent">
            {isLoading ? (
              <>
                <ChevronDown className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Load More Reviews
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHelpful, setIsHelpful] = useState(false)

  const shouldTruncate = review.body.length > 300
  const displayBody = shouldTruncate && !isExpanded ? review.body.substring(0, 300) + "..." : review.body

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-400 fill-current" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="outline" className="text-xs">
                  {review.rating}/5
                </Badge>
              </div>

              {review.title && <h4 className="font-medium text-foreground">{review.title}</h4>}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{review.reviewer_name}</span>
                <span>•</span>
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          {/* Review Body */}
          <div className="space-y-2">
            <p className="text-foreground leading-relaxed">{displayBody}</p>

            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Read More
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHelpful(!isHelpful)}
              className={`text-muted-foreground hover:text-foreground ${isHelpful ? "text-primary" : ""}`}
            >
              <ThumbsUp className={`h-4 w-4 mr-2 ${isHelpful ? "fill-current" : ""}`} />
              Helpful
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
