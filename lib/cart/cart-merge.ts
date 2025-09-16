"use client"

import type { CartItem } from "./cart-context"
import { saveUserCartAction, loadUserCartAction, handleCartMergeOnLoginAction } from "./cart-actions"

export interface UserCartData {
  items: CartItem[]
  lastUpdated: number
}

export async function saveUserCart(userId: string, cartData: UserCartData) {
  try {
    await saveUserCartAction(cartData)
  } catch (error) {
    console.error("Error saving user cart:", error)
    throw error
  }
}

export async function loadUserCart(userId: string): Promise<UserCartData | null> {
  try {
    return await loadUserCartAction()
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

export async function handleCartMergeOnLogin(userId: string, guestCartItems: CartItem[]): Promise<CartItem[]> {
  try {
    return await handleCartMergeOnLoginAction(guestCartItems)
  } catch (error) {
    console.error("Error merging carts on login:", error)
    // Return guest items if merge fails
    return guestCartItems
  }
}
