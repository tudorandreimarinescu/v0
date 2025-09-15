"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  slug: string
  name: string
  price: number
  currency: string
  quantity: number
  image: string
  variantId?: string
  variantName?: string
  maxStock?: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemCount: (id: string) => number
  setIsOpen: (open: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          (item) => item.productId === newItem.productId && item.variantId === newItem.variantId,
        )

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...items]
          const currentQuantity = updatedItems[existingItemIndex].quantity
          const newQuantity = currentQuantity + (newItem.quantity || 1)
          const maxStock = updatedItems[existingItemIndex].maxStock

          updatedItems[existingItemIndex].quantity = maxStock ? Math.min(newQuantity, maxStock) : newQuantity

          set({ items: updatedItems })
        } else {
          // Add new item
          const cartItem: CartItem = {
            ...newItem,
            id: `${newItem.productId}-${newItem.variantId || "default"}-${Date.now()}`,
            quantity: newItem.quantity || 1,
          }
          set({ items: [...items, cartItem] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        const items = get().items
        const updatedItems = items.map((item) => {
          if (item.id === id) {
            const newQuantity = item.maxStock ? Math.min(quantity, item.maxStock) : quantity
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemCount: (productId) => {
        const item = get().items.find((item) => item.productId === productId)
        return item ? item.quantity : 0
      },

      setIsOpen: (open) => {
        set({ isOpen: open })
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
