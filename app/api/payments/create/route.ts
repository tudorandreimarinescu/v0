import { type NextRequest, NextResponse } from "next/server"
import { createPaymentService } from "@/lib/payments/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "usd", metadata = {} } = body

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 })
    }

    const paymentService = createPaymentService()

    // Create payment intent
    const result = await paymentService.createIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error?.message || "Failed to create payment intent",
          error_code: result.error?.code,
          error_type: result.error?.type,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      client_secret: result.payment_intent?.client_secret,
      payment_intent_id: result.payment_intent?.id,
    })
  } catch (error) {
    console.error("Create payment intent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
