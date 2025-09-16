import { createServerClient } from "@/lib/supabase/server"
import { emailService } from "@/lib/email/email-service"
import { generateOrderConfirmationTemplate, type OrderConfirmationData } from "@/lib/email/templates/order-confirmation"
import type { CartItem } from "@/lib/cart/cart-context"
import type { ShippingInfo, BillingInfo } from "./checkout-context"

export interface CreateOrderRequest {
  userId?: string
  guestEmail?: string
  items: CartItem[]
  shippingInfo: ShippingInfo
  billingInfo: BillingInfo
  paymentIntentId: string
  subtotal: number
  vatAmount: number
  total: number
  currency: string
}

export interface Order {
  id: string
  order_number: string
  user_id?: string
  guest_email?: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_intent_id: string
  subtotal: number
  vat_amount: number
  total_amount: number
  currency: string
  shipping_address: any
  billing_address: any
  created_at: string
  updated_at: string
}

export class OrderService {
  async createOrder(request: CreateOrderRequest): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const supabase = createServerClient()

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      // Prepare order data
      const orderData = {
        order_number: orderNumber,
        user_id: request.userId || null,
        guest_email: request.guestEmail || null,
        status: "confirmed",
        payment_status: "completed",
        payment_intent_id: request.paymentIntentId,
        subtotal: request.subtotal,
        vat_amount: request.vatAmount,
        total_amount: request.total,
        currency: request.currency,
        shipping_address: {
          firstName: request.shippingInfo.firstName,
          lastName: request.shippingInfo.lastName,
          email: request.shippingInfo.email,
          phone: request.shippingInfo.phone,
          address: request.shippingInfo.address,
          address2: request.shippingInfo.address2,
          city: request.shippingInfo.city,
          state: request.shippingInfo.state,
          postalCode: request.shippingInfo.postalCode,
          country: request.shippingInfo.country,
        },
        billing_address: request.billingInfo.sameAsShipping
          ? null
          : {
              firstName: request.billingInfo.firstName,
              lastName: request.billingInfo.lastName,
              address: request.billingInfo.address,
              address2: request.billingInfo.address2,
              city: request.billingInfo.city,
              state: request.billingInfo.state,
              postalCode: request.billingInfo.postalCode,
              country: request.billingInfo.country,
            },
      }

      // Create order
      const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

      if (orderError) {
        console.error("Error creating order:", orderError)
        return { success: false, error: "Failed to create order" }
      }

      // Create order items
      const orderItems = request.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId || null,
        name: item.name,
        slug: item.slug,
        image_url: item.image_url,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        currency: item.currency,
        category: item.category,
        brand: item.brand,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Error creating order items:", itemsError)
        // Try to clean up the order
        await supabase.from("orders").delete().eq("id", order.id)
        return { success: false, error: "Failed to create order items" }
      }

      return { success: true, order }
    } catch (error) {
      console.error("Order creation error:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  async sendOrderConfirmation(order: Order, items: CartItem[]): Promise<{ success: boolean; error?: string }> {
    try {
      const shippingAddress = order.shipping_address
      const customerEmail = order.guest_email || shippingAddress.email
      const customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`

      // Calculate estimated delivery (5-7 business days from now)
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)
      const deliveryString = estimatedDelivery.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const emailData: OrderConfirmationData = {
        orderNumber: order.order_number,
        customerName,
        customerEmail,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          currency: item.currency,
          image_url: item.image_url,
        })),
        subtotal: order.subtotal,
        vatAmount: order.vat_amount,
        total: order.total_amount,
        currency: order.currency,
        shippingAddress: {
          name: customerName,
          address: shippingAddress.address,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        estimatedDelivery: deliveryString,
      }

      const template = generateOrderConfirmationTemplate(emailData)
      const result = await emailService.sendTemplate(customerEmail, template)

      if (!result.success) {
        console.error("Failed to send order confirmation email:", result.error)
        return { success: false, error: result.error?.message || "Failed to send confirmation email" }
      }

      console.log("[v0] Order confirmation email sent:", {
        orderId: order.id,
        orderNumber: order.order_number,
        customerEmail,
        messageId: result.messageId,
      })

      return { success: true }
    } catch (error) {
      console.error("Error sending order confirmation:", error)
      return { success: false, error: "Failed to send confirmation email" }
    }
  }

  async getOrder(orderId: string): Promise<{ success: boolean; order?: Order; items?: any[]; error?: string }> {
    try {
      const supabase = createServerClient()

      const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

      if (orderError) {
        return { success: false, error: "Order not found" }
      }

      const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId)

      if (itemsError) {
        return { success: false, error: "Failed to load order items" }
      }

      return { success: true, order, items }
    } catch (error) {
      console.error("Error getting order:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  async getOrderByNumber(
    orderNumber: string,
  ): Promise<{ success: boolean; order?: Order; items?: any[]; error?: string }> {
    try {
      const supabase = createServerClient()

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single()

      if (orderError) {
        return { success: false, error: "Order not found" }
      }

      const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", order.id)

      if (itemsError) {
        return { success: false, error: "Failed to load order items" }
      }

      return { success: true, order, items }
    } catch (error) {
      console.error("Error getting order by number:", error)
      return { success: false, error: "Internal server error" }
    }
  }
}

export const orderService = new OrderService()
