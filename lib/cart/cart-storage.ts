"use client"

import type { CartItem } from "./cart-context"

const CART_STORAGE_KEY = "kynky-cart"
const CART_COOKIE_KEY = "cart_items"

// Cookie utilities
export function setCookie(name: string, value: string, days = 30) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Cart storage interface
export interface CartStorage {
  items: CartItem[]
  lastUpdated: number
  guestId?: string
}

// Save cart to both localStorage and cookies
export function saveCart(cartData: CartStorage) {
  try {
    const serialized = JSON.stringify(cartData)

    // Save to localStorage for better performance
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, serialized)
    }

    // Save to cookies for server-side access and persistence across devices
    setCookie(CART_COOKIE_KEY, serialized, 30)
  } catch (error) {
    console.error("Error saving cart:", error)
  }
}

// Load cart from localStorage first, fallback to cookies
export function loadCart(): CartStorage | null {
  try {
    // Try localStorage first (faster)
    if (typeof localStorage !== "undefined") {
      const localData = localStorage.getItem(CART_STORAGE_KEY)
      if (localData) {
        return JSON.parse(localData)
      }
    }

    // Fallback to cookies
    const cookieData = getCookie(CART_COOKIE_KEY)
    if (cookieData) {
      const parsed = JSON.parse(cookieData)
      // Sync back to localStorage if available
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, cookieData)
      }
      return parsed
    }

    return null
  } catch (error) {
    console.error("Error loading cart:", error)
    return null
  }
}

// Clear cart from both storage methods
export function clearCartStorage() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
    deleteCookie(CART_COOKIE_KEY)
  } catch (error) {
    console.error("Error clearing cart:", error)
  }
}

// Generate a guest ID for tracking
export function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
