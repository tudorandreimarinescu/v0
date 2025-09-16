import { type NextRequest, NextResponse } from "next/server"
import { createPaymentService } from "@/lib/payments/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_intent_id, payment_method } = body

    // Validate required fields
    if (!payment_intent_id || !payment_method) {
      return NextResponse.json({ error: "Payment intent ID and payment method are required" }, { status: 400 })
    }

    // Validate payment method structure
    if (payment_method.type === "card") {
      const { card } = payment_method
      if (!card?.number || !card?.exp_month || !card?.exp_year || !card?.cvc) {
        return NextResponse.json({ error: "Complete card information is required" }, { status: 400 })
      }
    }

    const paymentService = createPaymentService()

    // Confirm payment intent
    const result = await paymentService.confirmIntent({
      payment_intent_id,
      payment_method,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error?.message || "Failed to confirm payment",
          error_code: result.error?.code,
          error_type: result.error?.type,
          payment_intent_status: result.payment_intent?.status,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      payment_intent: result.payment_intent,
    })
  } catch (error) {
    console.error("Confirm payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
