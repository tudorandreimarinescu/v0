import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/checkout/order-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      guestEmail,
      items,
      shippingInfo,
      billingInfo,
      paymentIntentId,
      subtotal,
      vatAmount,
      total,
      currency,
    } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 })
    }

    if (!shippingInfo || !paymentIntentId) {
      return NextResponse.json({ error: "Shipping information and payment intent are required" }, { status: 400 })
    }

    if (!userId && !guestEmail) {
      return NextResponse.json({ error: "Either user ID or guest email is required" }, { status: 400 })
    }

    // Create the order
    const result = await orderService.createOrder({
      userId,
      guestEmail,
      items,
      shippingInfo,
      billingInfo,
      paymentIntentId,
      subtotal,
      vatAmount,
      total,
      currency,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to create order" }, { status: 500 })
    }

    // Send confirmation email
    const emailResult = await orderService.sendOrderConfirmation(result.order!, items)

    if (!emailResult.success) {
      console.error("Failed to send order confirmation email:", emailResult.error)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      order: result.order,
      emailSent: emailResult.success,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
