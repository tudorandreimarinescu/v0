"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Loader2 } from "lucide-react"
import { createReview } from "@/lib/supabase/reviews-client"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  productId: string
  productName: string
  onReviewAdded?: () => void
}

export default function ReviewForm({ productId, productName, onReviewAdded }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    if (body.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 10 characters for your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createReview({
        product_id: productId,
        title: title.trim(),
        body: body.trim(),
        rating,
      })

      if (result.success) {
        toast({
          title: "Review Submitted",
          description: result.message,
        })

        // Reset form
        setRating(0)
        setTitle("")
        setBody("")

        if (onReviewAdded) {
          onReviewAdded()
        } else {
          router.refresh()
        }
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
          {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating}/5 stars</span>}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="review-title">Review Title (Optional)</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience..."
          maxLength={100}
          disabled={isSubmitting}
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <Label htmlFor="review-body">Your Review *</Label>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Tell others about your experience with ${productName}...`}
          rows={4}
          maxLength={1000}
          disabled={isSubmitting}
          required
        />
        <div className="text-xs text-muted-foreground text-right">{body.length}/1000 characters</div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting Review...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Your review will be moderated before being published. Please be honest and constructive in your feedback.
      </p>
    </form>
  )
}
