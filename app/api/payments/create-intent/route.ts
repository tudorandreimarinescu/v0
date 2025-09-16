import { type NextRequest, NextResponse } from "next/server"
import { paymentService } from "@/lib/payments/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, metadata, description, receipt_email, shipping } = body

    // Validate required fields
    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be positive" }, { status: 400 })
    }

    // Create payment intent
    const result = await paymentService.createIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
      description,
      receipt_email,
      shipping,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error?.message || "Failed to create payment intent" }, { status: 400 })
    }

    return NextResponse.json({
      payment_intent: result.payment_intent,
    })
  } catch (error) {
    console.error("Create payment intent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
