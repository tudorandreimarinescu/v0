"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, MessageSquare, Loader2 } from "lucide-react"

interface Review {
  id: string
  rating: number
  title: string
  body: string
  reviewer_name: string
  reviewer_email: string
  created_at: string
  status: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    body: "",
    reviewer_name: "",
    reviewer_email: "",
  })

  useEffect(() => {
    fetchReviews()
    fetchStats()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?product_id=${productId}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews || [])
      } else {
        console.error("Error fetching reviews:", data.error)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/reviews/stats?product_id=${productId}`)
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
      } else {
        console.error("Error fetching review stats:", data.error)
      }
    } catch (error) {
      console.error("Error fetching review stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          ...newReview,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewReview({
          rating: 5,
          title: "",
          body: "",
          reviewer_name: "",
          reviewer_email: "",
        })
        setShowReviewForm(false)
        alert("Review submitted successfully! It will be published after moderation.")
      } else {
        alert(data.error || "Error submitting review. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Error submitting review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-white/60" />
            <span className="ml-2 text-white/60">Loading reviews...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews ({stats?.totalReviews || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          {stats && stats.totalReviews > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stats.averageRating.toFixed(1)}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(stats.averageRating) ? "text-yellow-400 fill-current" : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-white/60">Based on {stats.totalReviews} reviews</p>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating] || 0
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-white/80 w-8">{rating}★</span>
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-white/60 w-8 text-sm">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 mb-4">No reviews yet</p>
            </div>
          )}

          {/* Write Review Button */}
          <div className="text-center">
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-white text-black hover:bg-white/90"
            >
              Write a Review
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={submitReview} className="space-y-4 p-4 bg-white/5 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newReview.reviewer_name}
                  onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={newReview.reviewer_email}
                  onChange={(e) => setNewReview({ ...newReview, reviewer_email: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div>
                <label className="text-white/80 block mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating <= newReview.rating ? "text-yellow-400 fill-current" : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Review Title"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50"
                required
              />

              <Textarea
                placeholder="Write your review..."
                value={newReview.body}
                onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                rows={4}
                required
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-white text-black hover:bg-white/90 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  className="border-white/20 text-white bg-transparent hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{review.reviewer_name}</span>
                    <Badge variant="secondary" className="bg-white/10 text-white/80">
                      Verified Purchase
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-white/20"}`}
                        />
                      ))}
                    </div>
                    <span className="text-white/60 text-sm">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <h4 className="text-white font-medium mb-2">{review.title}</h4>
              <p className="text-white/80 leading-relaxed mb-4">{review.body}</p>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && !loading && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <p className="text-white/60">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
