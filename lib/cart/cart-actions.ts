"use server"

import { createClient } from "@/lib/supabase/server"
import type { CartItem } from "./cart-context"

export interface UserCartData {
  items: CartItem[]
  lastUpdated: number
}

export interface SaveCartResult {
  success: boolean
  error?: string
}

// Server action to save user cart to database
export async function saveUserCartAction(cartData: UserCartData): Promise<SaveCartResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("Authentication error in saveUserCartAction:", authError)
    return { success: false, error: "User not authenticated" }
  }

  try {
    const { error } = await supabase.from("user_carts").upsert(
      {
        user_id: user.id, // Use authenticated user ID from session
        cart_data: cartData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )

    if (error) {
      console.error("Database error in saveUserCartAction:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving user cart:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Server action to load user cart from database
export async function loadUserCartAction(): Promise<UserCartData | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("Authentication error in loadUserCartAction:", authError)
    return null
  }

  try {
    const { data, error } = await supabase
      .from("user_carts")
      .select("cart_data")
      .eq("user_id", user.id) // Use authenticated user ID from session
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Database error in loadUserCartAction:", error)
      throw error
    }

    return data?.cart_data || null
  } catch (error) {
    console.error("Error loading user cart:", error)
    return null
  }
}

// Server action to handle cart merging on login
export async function handleCartMergeOnLoginAction(guestCartItems: CartItem[]): Promise<CartItem[]> {
  try {
    let retries = 3
    while (retries > 0) {
      try {
        const userCartData = await loadUserCartAction()
        const userItems = userCartData?.items || []

        // Merge guest cart with user cart
        const mergedItems = mergeCartItems(guestCartItems, userItems)

        const saveResult = await saveUserCartAction({
          items: mergedItems,
          lastUpdated: Date.now(),
        })

        if (!saveResult.success) {
          throw new Error(saveResult.error || "Failed to save cart")
        }

        return mergedItems
      } catch (error) {
        retries--
        if (retries === 0) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return guestCartItems
  } catch (error) {
    console.error("Error merging carts on login:", error)
    // Return guest items if merge fails
    return guestCartItems
  }
}

// Merge guest cart with user cart (pure function, no database operations)
function mergeCartItems(guestItems: CartItem[], userItems: CartItem[]): CartItem[] {
  const merged = [...userItems]

  for (const guestItem of guestItems) {
    const existingIndex = merged.findIndex(
      (item) => item.productId === guestItem.productId && item.variantId === guestItem.variantId,
    )

    if (existingIndex >= 0) {
      // Merge quantities, respecting stock limits
      const existingItem = merged[existingIndex]
      const newQuantity = Math.min(
        existingItem.quantity + guestItem.quantity,
        existingItem.stock,
        10, // Max quantity per item
      )
      merged[existingIndex] = { ...existingItem, quantity: newQuantity }
    } else {
      // Add new item from guest cart
      merged.push(guestItem)
    }
  }

  return merged
}
