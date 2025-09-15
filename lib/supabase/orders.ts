import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface Order {
  id: string
  user_id: string
  guest_email: string | null
  order_number: string
  total_amount: number
  currency: string
  status: "pending" | "completed" | "cancelled"
  payment_status: "pending" | "completed" | "failed"
  billing_address: any
  shipping_address: any
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  products?: {
    slug: string
    image_url: string | null
    product_translations: Array<{
      name: string
      short_desc: string
    }>
  }
}

function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = createClient()

  const { data, error } = await supabase
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
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user orders:", error)
    return []
  }

  return data || []
}

export async function getOrderById(orderId: string, userId?: string): Promise<Order | null> {
  const supabase = createClient()

  let query = supabase
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

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query.single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  return data
}
