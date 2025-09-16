import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/checkout/order-service"

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 })
    }

    const result = await orderService.getOrderByNumber(orderNumber)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      order: result.order,
      items: result.items,
    })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
