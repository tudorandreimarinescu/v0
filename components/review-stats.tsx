import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"
import type { ReviewStats as ReviewStatsType } from "@/lib/supabase/reviews-server"

interface ReviewStatsProps {
  stats: ReviewStatsType
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  const { total_reviews, average_rating, rating_distribution } = stats

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Overall Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground mb-2">{average_rating.toFixed(1)}</div>
          <div className="flex items-center justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(average_rating) ? "text-yellow-400 fill-current" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {total_reviews} review{total_reviews !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = rating_distribution[rating.toString() as keyof typeof rating_distribution] || 0
            const percentage = total_reviews > 0 ? (count / total_reviews) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 w-12">
                  <span>{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-muted-foreground w-8 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
