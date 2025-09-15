import { createClient } from "@/lib/supabase/client"

export interface GuestCheckoutData {
  email: string
  firstName: string
  lastName: string
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  shippingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface OrderItem {
  productId: string
  variantId?: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderData {
  items: OrderItem[]
  guestData?: GuestCheckoutData
  totalAmount: number
  currency: string
}

/**
 * Create an order for a guest user (no authentication required)
 */
export async function createGuestOrder(orderData: CreateOrderData): Promise<{ orderId?: string; error?: string }> {
  try {
    const supabase = createClient()

    if (!orderData.guestData) {
      return { error: "Guest data is required for guest checkout" }
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: null, // Guest order
        guest_email: orderData.guestData.email,
        total_amount: orderData.totalAmount,
        status: "pending",
        payment_status: "pending",
        billing_address: {
          first_name: orderData.guestData.firstName,
          last_name: orderData.guestData.lastName,
          email: orderData.guestData.email,
          ...orderData.guestData.billingAddress,
        },
        shipping_address: orderData.guestData.shippingAddress || orderData.guestData.billingAddress,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { error: "Failed to create order" }
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Try to clean up the order if items failed
      await supabase.from("orders").delete().eq("id", order.id)
      return { error: "Failed to create order items" }
    }

    return { orderId: order.id }
  } catch (error) {
    console.error("Error in createGuestOrder:", error)
    return { error: "An unexpected error occurred" }
  }
}

/**
 * Create an order for an authenticated user
 */
export async function createUserOrder(
  orderData: Omit<CreateOrderData, "guestData">,
): Promise<{ orderId?: string; error?: string }> {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Authentication required" }
    }

    // Get user profile for billing info
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        guest_email: null,
        total_amount: orderData.totalAmount,
        status: "pending",
        payment_status: "pending",
        billing_address: {
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          email: user.email || "",
        },
        shipping_address: {
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          email: user.email || "",
        },
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { error: "Failed to create order" }
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Try to clean up the order if items failed
      await supabase.from("orders").delete().eq("id", order.id)
      return { error: "Failed to create order items" }
    }

    return { orderId: order.id }
  } catch (error) {
    console.error("Error in createUserOrder:", error)
    return { error: "An unexpected error occurred" }
  }
}

/**
 * Get order details by ID and email (for guest orders)
 */
export async function getGuestOrder(orderId: string, email: string): Promise<{ order?: any; error?: string }> {
  try {
    const supabase = createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            slug,
            image_url,
            product_translations (
              name,
              short_desc
            )
          )
        )
      `,
      )
      .eq("id", orderId)
      .eq("guest_email", email)
      .single()

    if (error) {
      return { error: "Order not found" }
    }

    return { order }
  } catch (error) {
    console.error("Error fetching guest order:", error)
    return { error: "Failed to fetch order" }
  }
}
