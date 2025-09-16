"use client"

import type { CartItem } from "./cart-context"
import { createBrowserClient } from "@/lib/supabase/client"

export interface UserCartData {
  items: CartItem[]
  lastUpdated: number
}

// Save user cart to database
export async function saveUserCart(userId: string, cartData: UserCartData) {
  const supabase = createBrowserClient()

  try {
    const { error } = await supabase.from("user_carts").upsert({
      user_id: userId,
      cart_data: cartData,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error("Error saving user cart:", error)
    throw error
  }
}

// Load user cart from database
export async function loadUserCart(userId: string): Promise<UserCartData | null> {
  const supabase = createBrowserClient()

  try {
    const { data, error } = await supabase.from("user_carts").select("cart_data").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") throw error

    return data?.cart_data || null
  } catch (error) {
    console.error("Error loading user cart:", error)
    return null
  }
}

// Merge guest cart with user cart
export function mergeCartItems(guestItems: CartItem[], userItems: CartItem[]): CartItem[] {
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

// Handle cart merging on login
export async function handleCartMergeOnLogin(userId: string, guestCartItems: CartItem[]): Promise<CartItem[]> {
  try {
    // Load existing user cart
    const userCartData = await loadUserCart(userId)
    const userItems = userCartData?.items || []

    // Merge guest cart with user cart
    const mergedItems = mergeCartItems(guestCartItems, userItems)

    // Save merged cart back to database
    await saveUserCart(userId, {
      items: mergedItems,
      lastUpdated: Date.now(),
    })

    return mergedItems
  } catch (error) {
    console.error("Error merging carts on login:", error)
    // Return guest items if merge fails
    return guestCartItems
  }
}
